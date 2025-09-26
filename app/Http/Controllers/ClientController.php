<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::where('company_id', auth()->user()->company_id)
                      ->withCount([
                          'devis',
                          'devis as devis_signes_count' => function ($q) {
                              $q->where('status', 'signe');
                          },
                          'devis as devis_attente_count' => function ($q) {
                              $q->where('status', 'envoye');
                          }
                      ])
                      ->with(['devis' => function ($q) {
                          $q->where('status', 'signe')->select('id', 'client_id', 'total_ttc');
                      }]);

        // Filtres
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $clients = $query->orderBy('name')->paginate(15);

        // Calculer les statistiques pour chaque client
        $clients->getCollection()->transform(function ($client) {
            // Calculer le CA total des devis signés
            $totalCa = $client->devis->sum('total_ttc');

            $client->stats = [
                'total_devis' => $client->devis_count,
                'total_ca' => $totalCa,
                'devis_attente' => $client->devis_attente_count,
                'devis_signes' => $client->devis_signes_count,
            ];

            // Nettoyer la relation devis pour alléger la réponse
            unset($client->devis);

            return $client;
        });

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'type']),
            'stats' => [
                'total_clients' => Client::where('company_id', auth()->user()->company_id)->count(),
                'particuliers' => Client::where('company_id', auth()->user()->company_id)->where('type', 'particulier')->count(),
                'professionnels' => Client::where('company_id', auth()->user()->company_id)->where('type', 'professionnel')->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:particulier,professionnel',
            'first_name' => 'required_if:type,particulier|nullable|string|max:100',
            'last_name' => 'required_if:type,particulier|nullable|string|max:100',
            'company_name' => 'required_if:type,professionnel|nullable|string|max:255',
            'address' => 'required|string|max:500',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:100',
            'siret' => 'nullable|string|max:20',
            'tva_number' => 'nullable|string|max:20',
            'payment_terms' => 'nullable|integer|min:1|max:120',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['company_id'] = auth()->user()->company_id;

        // Calculer le nom d'affichage
        if ($validated['type'] === 'particulier') {
            $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
            $validated['payment_terms'] = $validated['payment_terms'] ?? 15;
        } else {
            $validated['name'] = $validated['company_name'];
            $validated['payment_terms'] = $validated['payment_terms'] ?? 30;
        }

        try {
            $client = Client::create($validated);

            return redirect()->route('clients.index')
                ->with('success', "Client {$client->name} créé avec succès !");

        } catch (\Exception $e) {
            \Log::error('Erreur création client: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Erreur lors de la création du client: ' . $e->getMessage()])
                        ->withInput();
        }
    }

    public function show(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $client->load(['devis' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'stats' => [
                'total_devis' => $client->devis()->count(),
                'total_signe' => $client->devis()->where('status', 'signe')->sum('total_ttc'),
                'devis_attente' => $client->devis()->where('status', 'envoye')->count(),
                'ca_annuel' => $client->devis()
                                    ->where('status', 'signe')
                                    ->whereYear('created_at', date('Y'))
                                    ->sum('total_ttc'),
            ]
        ]);
    }

    public function edit(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        return Inertia::render('Clients/Edit', [
            'client' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:particulier,professionnel',
            'first_name' => 'required_if:type,particulier|nullable|string|max:100',
            'last_name' => 'required_if:type,particulier|nullable|string|max:100',
            'company_name' => 'required_if:type,professionnel|nullable|string|max:255',
            'address' => 'required|string|max:500',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:100',
            'siret' => 'nullable|string|max:20',
            'tva_number' => 'nullable|string|max:20',
            'payment_terms' => 'nullable|integer|min:1|max:120',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Calculer le nom d'affichage
        if ($validated['type'] === 'particulier') {
            $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        } else {
            $validated['name'] = $validated['company_name'];
        }

        $client->update($validated);

        return redirect()->route('clients.show', $client)
            ->with('success', 'Client modifié avec succès !');
    }

    public function destroy(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        if ($client->devis()->count() > 0) {
            return redirect()->route('clients.index')
                ->with('error', 'Impossible de supprimer un client qui a des devis associés.');
        }

        $clientName = $client->name;
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', "Client {$clientName} supprimé avec succès !");
    }
}
