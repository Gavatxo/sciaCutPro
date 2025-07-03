<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('numero')->unique();
            $table->string('chantier_name');
            $table->text('chantier_address')->nullable();
            $table->date('date_intervention')->nullable();
            $table->integer('validity_days')->default(30);
            $table->text('notes')->nullable();
            $table->decimal('total_ht', 10, 2)->default(0);
            $table->decimal('tva_rate', 5, 2)->default(20);
            $table->decimal('total_ttc', 10, 2)->default(0);
            $table->enum('status', ['brouillon', 'envoye', 'signe', 'refuse', 'expire'])->default('brouillon');
            $table->timestamp('signed_at')->nullable();
            $table->json('signature_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devis');
    }
};
