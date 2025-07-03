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
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('logo_path')->nullable();
            $table->json('colors')->nullable();
            $table->text('signature_text')->nullable();
            $table->text('payment_conditions')->nullable();
            $table->text('legal_mentions')->nullable();
            $table->text('warranty_conditions')->nullable();
            $table->integer('quote_validity_days')->default(30);
            $table->text('quote_footer')->nullable();
            $table->text('invoice_footer')->nullable();
            $table->text('email_signature')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
