<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use App\Models\Client;
use App\Models\Prestation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevisController extends Controller
{
    public function index(Request $request)
    {
        $companyId = auth()->user()->company_id;
        
        // Construction de la requête avec filtres
        $query = Devis::where('company_id', $companyId)
            ->with(['client:id,name'])
            ->orderBy('created_at', 'desc');
        
        // Filtres
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('numero', 'like', "%{$search}%")
                  ->orWhere('chantier_name', 'like', "%{$search}%")
                  ->orWhereHas('client', function($clientQuery) use ($search) {
                      $clientQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Pagination
        $devis = $query->paginate(15)->withQueryString();
        
        // Statistiques pour les KPI
        $stats = [
            'total' => Devis::where('company_id', $companyId)->count(),
            'en_attente' => Devis::where('company_id', $companyId)
                ->where('status', 'envoye')->count(),
            'signes' => Devis::where('company_id', $companyId)
                ->where('status', 'signe')->count(),
            'montant_total' => Devis::where('company_id', $companyId)
                ->where('status', 'signe')
                ->sum('total_ttc'),
        ];
        
        return Inertia::render('Devis/Index', [
            'devis' => $devis,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        $companyId = auth()->user()->company_id;
        
        // Générer le prochain numéro pour affichage
        $nextNumero = $this->generateNextNumero($companyId);

        return Inertia::render('Devis/Create', [
            'clients' => Client::where('company_id', $companyId)->orderBy('name')->get(),
            'prestations' => Prestation::where('company_id', $companyId)->orderBy('name')->get(),
            'nextNumero' => $nextNumero
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
        
        try {
            // ✅ Générer le numéro AU MOMENT de la création (pas avant!)
            $numeroDevis = $this->generateNextNumero($companyId);
            
            Log::info('Création devis', [
                'company_id' => $companyId,
                'numero_genere' => $numeroDevis,
                'client_id' => $validated['client_id']
            ]);
            
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

            // Créer les lignes de devis
            $totalHt = 0;
            foreach ($validated['lignes'] as $index => $ligne) {
                $total = $ligne['quantity'] * $ligne['unit_price'];
                $totalHt += $total;

                $devis->lignes()->create([
                    'description' => $ligne['description'],
                    'description_detail' => $ligne['description_detail'] ?? null,
                    'prestation_id' => null, // Optionnel
                    'quantity' => $ligne['quantity'],
                    'unit' => $ligne['unit'],
                    'unit_price' => $ligne['unit_price'],
                    'total' => $total,
                    'order' => $index + 1,
                ]);
            }

            // Mettre à jour les totaux
            $tva = $totalHt * 0.20;
            $totalTtc = $totalHt + $tva;

            $devis->update([
                'total_ht' => $totalHt,
                'total_ttc' => $totalTtc,
            ]);

            Log::info('Devis créé avec succès', [
                'devis_id' => $devis->id,
                'numero' => $devis->numero
            ]);

            return redirect()->route('devis.index')
                ->with('success', "Devis #{$devis->numero} créé avec succès !");
                
        } catch (\Exception $e) {
            Log::error('Erreur création devis', [
                'error' => $e->getMessage(),
                'company_id' => $companyId
            ]);
            
            return back()->withErrors(['error' => 'Erreur lors de la création du devis: ' . $e->getMessage()]);
        }
    }

    public function show(Devis $devis)
    {
        // Vérifier que le devis appartient à la bonne entreprise
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $devis->load(['client', 'lignes' => function($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('Devis/Show', [
            'devis' => $devis
        ]);
    }

    public function edit(Devis $devis)
    {
        if ($devis->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        // Seuls les devis en brouillon peuvent être modifiés
        if ($devis->status !== 'brouillon') {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Seuls les devis en brouillon peuvent être modifiés.');
        }

        $companyId = auth()->user()->company_id;
        $devis->load(['lignes' => function($query) {
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

        if ($devis->status !== 'brouillon') {
            return redirect()->route('devis.show', $devis)
                ->with('error', 'Seuls les devis en brouillon peuvent être modifiés.');
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
        
        // Trouver le dernier numéro de l'année pour cette entreprise
        $lastDevis = Devis::where('company_id', $companyId)
            ->where('numero', 'like', $year . '-%')
            ->orderByRaw('CAST(SUBSTRING(numero, 6) AS UNSIGNED) DESC') // Tri numérique
            ->first();

        if ($lastDevis && $lastDevis->numero) {
            // Extraire le numéro séquentiel
            $parts = explode('-', $lastDevis->numero);
            if (count($parts) >= 2) {
                $lastNumber = (int) end($parts);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }
        } else {
            $nextNumber = 1;
        }

        $numero = $year . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        
        Log::info('Numéro généré', [
            'company_id' => $companyId,
            'last_devis' => $lastDevis ? $lastDevis->numero : 'aucun',
            'numero_genere' => $numero
        ]);
        
        return $numero;
    }
}