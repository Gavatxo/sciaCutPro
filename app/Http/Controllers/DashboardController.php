<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;

        // Statistiques du mois en cours
        $currentMonth = now()->startOfMonth();
        
        $stats = [
            'ca_mois' => Devis::where('company_id', $companyId)
                ->where('status', 'signe')
                ->whereBetween('created_at', [$currentMonth, now()])
                ->sum('total_ttc'),
            
            'devis_attente' => Devis::where('company_id', $companyId)
                ->where('status', 'envoye')
                ->count(),
            
            'factures_emises' => Devis::where('company_id', $companyId)
                ->where('status', 'signe')
                ->whereMonth('created_at', now()->month)
                ->count(),
            
            'impayes' => Devis::where('company_id', $companyId)
                ->where('status', 'signe')
                ->where('created_at', '<', now()->subDays(30))
                ->sum('total_ttc') * 0.1
        ];

        // Activité récente
        $activites = Devis::where('company_id', $companyId)
            ->with('client')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($devis) {
                return [
                    'id' => $devis->id,
                    'type' => $this->getActivityType($devis->status),
                    'titre' => $this->getActivityTitle($devis),
                    'description' => $devis->client->name . ' - ' . $devis->chantier_name,
                    'created_at' => $devis->created_at->diffForHumans(),
                    'icon' => $this->getActivityIcon($devis->status)
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'activites' => $activites
        ]);
    }

    private function getActivityType($status)
    {
        return match($status) {
            'brouillon' => 'Devis créé',
            'envoye' => 'Devis envoyé',
            'signe' => 'Devis signé',
            'refuse' => 'Devis refusé',
            default => 'Devis mis à jour'
        };
    }

    private function getActivityTitle($devis)
    {
        return $this->getActivityType($devis->status) . " #" . $devis->numero;
    }

    private function getActivityIcon($status)
    {
        return match($status) {
            'brouillon' => '📋',
            'envoye' => '📧',
            'signe' => '✅',
            'refuse' => '❌',
            default => '📝'
        };
    }
}

