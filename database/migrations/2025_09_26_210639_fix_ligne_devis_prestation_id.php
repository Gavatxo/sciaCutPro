<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('ligne_devis', function (Blueprint $table) {
            // Rendre prestation_id nullable
            $table->unsignedBigInteger('prestation_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('ligne_devis', function (Blueprint $table) {
            $table->unsignedBigInteger('prestation_id')->nullable(false)->change();
        });
    }
};
