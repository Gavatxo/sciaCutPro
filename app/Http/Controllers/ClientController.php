<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;

        $query = Client::where('company_id', $companyId);

        // Recherche
        if (request('search')) {
            $query->where(function($q) {
                $q->where('name', 'like', '%' . request('search') . '%')
                  ->orWhere('email', 'like', '%' . request('search') . '%')
                  ->orWhere('contact_person', 'like', '%' . request('search') . '%');
            });
        }

        $clients = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => request()->only(['search']),
            'stats' => [
                'total' => Client::where('company_id', $companyId)->count(),
                'actifs' => Client::where('company_id', $companyId)
                    ->whereHas('devis', function($q) {
                        $q->where('created_at', '>=', now()->subMonths(6));
                    })->count(),
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
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:20',
        ]);

        Client::create(array_merge($validated, [
            'company_id' => auth()->user()->company_id
        ]));

        return redirect()->route('clients.index')
            ->with('success', 'Client créé avec succès !');
    }

    public function show(Client $client)
    {
        // Vérifier que le client appartient à la bonne entreprise
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        $client->load(['devis' => function($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'stats' => [
                'total_devis' => $client->devis()->count(),
                'total_signe' => $client->devis()->where('status', 'signe')->sum('total_ttc'),
                'devis_attente' => $client->devis()->where('status', 'envoye')->count(),
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
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:20',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client modifié avec succès !');
    }

    public function destroy(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            abort(403);
        }

        // Vérifier qu'il n'y a pas de devis
        if ($client->devis()->count() > 0) {
            return redirect()->route('clients.index')
                ->with('error', 'Impossible de supprimer un client qui a des devis associés.');
        }

        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Client supprimé avec succès !');
    }
}