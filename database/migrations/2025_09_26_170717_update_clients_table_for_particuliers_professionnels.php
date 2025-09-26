<?php

// database/migrations/2025_09_26_120000_update_clients_table_for_particuliers_professionnels.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            // Type de client : 'particulier' ou 'professionnel'
            $table->enum('type', ['particulier', 'professionnel'])->default('particulier')->after('company_id');

            // Champs pour particuliers
            $table->string('first_name')->nullable()->after('type');
            $table->string('last_name')->nullable()->after('first_name');

            // Champs pour professionnels (renommer et ajouter)
            $table->string('company_name')->nullable()->after('last_name');
            $table->string('tva_number')->nullable()->after('siret');

            // Adresse structurée
            $table->string('postal_code')->nullable()->after('address');
            $table->string('city')->nullable()->after('postal_code');

            // Paramètres commerciaux
            $table->integer('payment_terms')->default(30)->after('city'); // Délai de paiement en jours
            $table->text('notes')->nullable()->after('payment_terms'); // Notes internes

            // Rendre le champ name nullable car il sera calculé automatiquement
            $table->string('name')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'first_name',
                'last_name',
                'company_name',
                'tva_number',
                'postal_code',
                'city',
                'payment_terms',
                'notes'
            ]);

            // Remettre name comme requis
            $table->string('name')->nullable(false)->change();
        });
    }
};
