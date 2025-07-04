<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devis', function (Blueprint $table) {
            // Supprimer la contrainte unique problématique
            $table->dropUnique(['numero']);
            
            // Recreer l'index unique mais combiné avec company_id
            $table->unique(['company_id', 'numero'], 'devis_company_numero_unique');
        });
    }

    public function down(): void
    {
        Schema::table('devis', function (Blueprint $table) {
            $table->dropUnique('devis_company_numero_unique');
            $table->unique('numero');
        });
    }
};