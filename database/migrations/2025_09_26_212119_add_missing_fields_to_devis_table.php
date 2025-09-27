<?php

// Créer cette migration : php artisan make:migration add_missing_fields_to_devis_table

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('devis', function (Blueprint $table) {
            // Ajouter les champs manquants utilisés dans le seeder
            $table->timestamp('date_envoi')->nullable()->after('status');
            $table->timestamp('date_signature')->nullable()->after('date_envoi');
            $table->string('signed_by')->nullable()->after('date_signature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devis', function (Blueprint $table) {
            $table->dropColumn(['date_envoi', 'date_signature', 'signed_by']);
        });
    }
};
