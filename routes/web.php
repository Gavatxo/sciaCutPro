<?php

// routes/web.php

use Inertia\Inertia;
use App\Models\Client;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevisController;

Route::redirect('/', '/dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('clients', ClientController::class);

    Route::get('/clients/{client}/devis', [ClientController::class, 'devis'])->name('clients.devis');

    Route::get('/devis/{devis}/pdf', [DevisController::class, 'downloadPdf'])->name('devis.pdf');
    Route::get('/devis/{devis}/preview', [DevisController::class, 'preview'])->name('devis.preview');
    Route::post('/devis/{devis}/send-email', [DevisController::class, 'sendEmail'])->name('devis.send-email');
    Route::patch('/devis/{devis}/status', [DevisController::class, 'updateStatus'])->name('devis.update-status');
    Route::post('/devis/{devis}/duplicate', [DevisController::class, 'duplicate'])->name('devis.duplicate');


    Route::resource('devis', DevisController::class)->parameters(['devis' => 'devis']);



    Route::get('/test-pdf-data', function () {
        $fakeDevis = (object) [
            'numero' => '2025-001',
            'chantier_name' => 'Test Chantier',
            'total_ht' => 1000,
            'total_ttc' => 1200,
            'client' => (object) ['name' => 'Test Client'],
            'lignes' => [
                (object) [
                    'description' => 'Test ligne',
                    'quantity' => 1,
                    'unit' => 'u',
                    'unit_price' => 100,
                    'total' => 100
                ]
            ]
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.devis.default', ['devis' => $fakeDevis]);
        return $pdf->download('test-data.pdf');
    });




});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
