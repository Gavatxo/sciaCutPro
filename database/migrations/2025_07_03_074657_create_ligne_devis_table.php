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
        Schema::create('ligne_devis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devis_id')->constrained('devis')->onDelete('cascade');
            $table->foreignId('prestation_id')->constrained('prestations')->onDelete('cascade');
            $table->string('description');
            $table->text('description_detail')->nullable();
            $table->decimal('quantity', 10, 2);
            $table->string('unit');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total', 10, 2);
            $table->integer('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ligne_devis');
    }
};
