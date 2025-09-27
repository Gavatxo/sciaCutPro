<?php

// app/Http/Controllers/DevisController.php

namespace App\Http\Controllers;

use App\Models\Devis;
use App\Models\Client;
use App\Models\Prestation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevisController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;

        $query = Devis::where('company_id', $companyId)->with(['client']);

        // Filtres
        if (request('search')) {
            $query->where(function ($q) {
                $q->where('numero', 'like', '%' . request('search') . '%')
                  ->orWhere('chantier_name', 'like', '%' . request('search') . '%')
                  ->orWhereHas('client', function ($clientQuery) {
                      $clientQuery->where('name', 'like', '%' . request('search') . '%');
                  });
            });
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        // Tri
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $devis = $query->paginate(10)->withQueryString();

        return Inertia::render('Devis/Index', [
            'devis' => $devis,
            'filters' => request()->only(['search', 'status']),
            'stats' => [
                'total' => Devis::where('company_id', $companyId)->count(),
                'brouillon' => Devis::where('company_id', $companyId)->where('status', 'brouillon')->count(),
                'envoye' => Devis::where('company_id', $companyId)->where('status', 'envoye')->count(),
                'signe' => Devis::where('company_id', $companyId)->where('status', 'signe')->count(),
                'total_ca' => Devis::where('company_id', $companyId)->where('status', 'signe')->sum('total_ttc'),
            ]
        ]);
    }

    public function create()
    {
        $companyId = auth()->user()->company_id;

        // Récupérer le client_id depuis l'URL si présent
        $preselectedClientId = request('client_id');
        $selectedClient = null;

        if ($preselectedClientId) {
            $selectedClient = Client::where('id', $preselectedClientId)
                ->where('company_id', $companyId)
                ->first();
        }

        return Inertia::render('Devis/Create', [
            'clients' => Client::where('company_id', $companyId)->orderBy('name')->get(),
            'prestations' => Prestation::where('company_id', $companyId)->orderBy('name')->get(),
            'nextNumero' => $this->generateNextNumero($companyId),
            'selectedClient' => $selectedClient, // Client présélectionné
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'chantier_name' => 'required|string|max:255',
            'chantier_address' => 'nullable|string',
            'date_intervention' => 'nullable|date',
            'notes' => 'nullable|string',
            'lignes' => 'required|array|min:1',
            'lignes.*.description' => 'required|string',
            'lignes.*.description_detail' => 'nullable|string',
            'lignes.*.quantity' => 'required|numeric|min:0',
            'lignes.*.unit' => 'required|string',
            'lignes.*.unit_price' => 'required|numeric|min:0',
        ]);

        $companyId = auth()->user()->company_id;

        // Vérifier que le client appartient à la bonne entreprise
        $client = Client::where('id', $validated['client_id'])
                    ->where('company_id', $companyId)
                    ->firstOrFail();

        // Générer le numéro AVANT la création
        $numeroDevis = $this->generateNextNumero($companyId);

        // Créer le devis avec tous les champs requis
        $devis = Devis::create([
            'company_id' => $companyId,
            'client_id' => $validated['client_id'],
            'numero' => $numeroDevis,
            'chantier_name' => $validated['chantier_name'],
            'chantier_address' => $validated['chantier_address'],
            'date_intervention' => $validated['date_intervention'],
            'notes' => $validated['notes'],
            'total_ht' => 0,
            'tva_rate' => 20.00,
            'total_ttc' => 0,
            'status' => 'brouillon',
            'validity_days' => 30,
        ]);

        // Créer les lignes
        $totalHt = 0;
        foreach ($validated['lignes'] as $index => $ligne) {
            $total = $ligne['quantity'] * $ligne['unit_price'];
            $totalHt += $total;

            $devis->lignes()->create([
                'description' => $ligne['description'],
                'description_detail' => $ligne['description_detail'] ?? null,
                'quantity' => $ligne['quantity'],
                'unit' => $ligne['unit'],
                'unit_price' => $ligne['unit_price'],
                'total' => $total,
                'order' => $index + 1,
                'prestation_id' => null,
            ]);
        }

        // Mettre à jour les totaux
        $tva = $totalHt * 0.20;
        $totalTtc = $totalHt + $tva;

        $devis->update([
            'total_ht' => $totalHt,
            'total_ttc' => $totalTtc,
        ]);

        return redirect()->route('devis.index')
            ->with('success', "Devis #{$devis->numero} créé avec succès !");
    }

    public function show(Devis $devis)
    {
        // // Vérifier que le devis appartient à la bonne entreprise
        // if ($devis->company_id !== auth()->user()->company_id) {
        //     abort(403);
        // }

        $devis->load(['client', 'lignes' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('Devis/Show', [
            'devis' => $devis
        ]);
    }

    public function edit(Devis $devis)
    {
        // if ($devis->company_id !== auth()->user()->company_id) {
        //     abort(403);
        // }

        // ✅ MODIFICATION : Permettre l'édition pour plus de statuts
        if (!in_array($devis->status, ['brouillon', 'envoye'])) {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Ce devis ne peut plus être modifié (statut: ' . $devis->status . ').');
        }

        $companyId = auth()->user()->company_id;
        $devis->load(['lignes' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('Devis/Edit', [
            'devis' => $devis,
            'clients' => Client::where('company_id', $companyId)->orderBy('name')->get(),
            'prestations' => Prestation::where('company_id', $companyId)->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Devis $devis)
    {
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        if (!in_array($devis->status, ['brouillon', 'envoye'])) {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Ce devis ne peut plus être modifié.');
        }

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'chantier_name' => 'required|string|max:255',
            'chantier_address' => 'nullable|string',
            'date_intervention' => 'nullable|date',
            'notes' => 'nullable|string',
            'lignes' => 'required|array|min:1',
            'lignes.*.description' => 'required|string',
            'lignes.*.description_detail' => 'nullable|string',
            'lignes.*.quantity' => 'required|numeric|min:0',
            'lignes.*.unit' => 'required|string',
            'lignes.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Mettre à jour le devis
        $devis->update([
            'client_id' => $validated['client_id'],
            'chantier_name' => $validated['chantier_name'],
            'chantier_address' => $validated['chantier_address'],
            'date_intervention' => $validated['date_intervention'],
            'notes' => $validated['notes'],
        ]);

        // Supprimer les anciennes lignes et recréer
        $devis->lignes()->delete();

        $totalHt = 0;
        foreach ($validated['lignes'] as $index => $ligne) {
            $total = $ligne['quantity'] * $ligne['unit_price'];
            $totalHt += $total;

            $devis->lignes()->create([
                'description' => $ligne['description'],
                'description_detail' => $ligne['description_detail'] ?? null,
                'quantity' => $ligne['quantity'],
                'unit' => $ligne['unit'],
                'unit_price' => $ligne['unit_price'],
                'total' => $total,
                'order' => $index + 1,
                'prestation_id' => null,
            ]);
        }

        // Mettre à jour les totaux
        $tva = $totalHt * 0.20;
        $totalTtc = $totalHt + $tva;

        $devis->update([
            'total_ht' => $totalHt,
            'total_ttc' => $totalTtc,
        ]);

        return redirect()->route('devis.show', $devis)
            ->with('success', 'Devis modifié avec succès !');
    }

    /**
     * Changer le statut d'un devis
     */
    public function updateStatus(Request $request, Devis $devis)
    {
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:brouillon,envoye,signe,refuse,expire',
            'notes' => 'nullable|string',
            'signed_by' => 'nullable|string|required_if:status,signe',
        ]);

        // Logique de validation des transitions de statut
        $allowedTransitions = [
            'brouillon' => ['envoye'],
            'envoye' => ['signe', 'refuse', 'expire'],
            'signe' => [], // Un devis signé ne peut plus changer de statut
            'refuse' => ['brouillon'], // Un devis refusé peut redevenir brouillon
            'expire' => ['brouillon'], // Un devis expiré peut redevenir brouillon
        ];

        if (!in_array($validated['status'], $allowedTransitions[$devis->status] ?? [])) {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Transition de statut non autorisée.');
        }

        // Préparer les données de mise à jour
        $updateData = ['status' => $validated['status']];

        // Ajouter les champs spécifiques selon le statut
        switch ($validated['status']) {
            case 'envoye':
                $updateData['date_envoi'] = now();
                break;
            case 'signe':
                $updateData['date_signature'] = now();
                $updateData['signed_by'] = $validated['signed_by'];
                break;
        }

        // Ajouter les notes si fournies
        if (!empty($validated['notes'])) {
            $updateData['notes'] = $devis->notes . "\n\n" . now()->format('d/m/Y H:i') . " - " . $validated['notes'];
        }

        $devis->update($updateData);

        $statusLabels = [
            'brouillon' => 'brouillon',
            'envoye' => 'envoyé',
            'signe' => 'signé',
            'refuse' => 'refusé',
            'expire' => 'expiré',
        ];

        return redirect()->route('devis.show', $devis)
            ->with('success', "Devis #{$devis->numero} marqué comme {$statusLabels[$validated['status']]} !");
    }

    /**
     * Envoyer le devis par email (placeholder)
     */
    public function send(Devis $devis)
    {
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        if ($devis->status !== 'brouillon') {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Seuls les devis en brouillon peuvent être envoyés.');
        }

        // TODO: Implémenter l'envoi par email
        $devis->update([
            'status' => 'envoye',
            'date_envoi' => now(),
        ]);

        return redirect()->route('devis.show', $devis)
            ->with('success', "Devis #{$devis->numero} envoyé avec succès !");
    }

    public function destroy(Devis $devis)
    {
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        // Seuls les devis en brouillon peuvent être supprimés
        if ($devis->status !== 'brouillon') {
            return redirect()->route('devis.index')
                ->with('error', 'Seuls les devis en brouillon peuvent être supprimés.');
        }

        $numero = $devis->numero;
        $devis->delete();

        return redirect()->route('devis.index')
            ->with('success', "Devis #{$numero} supprimé avec succès !");
    }

    private function generateNextNumero($companyId)
    {
        $year = date('Y');
        $lastDevis = Devis::where('company_id', $companyId)
            ->where('numero', 'like', $year . '-%')
            ->orderBy('numero', 'desc')
            ->first();

        if ($lastDevis) {
            $lastNumber = (int) substr($lastDevis->numero, -3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $year . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
