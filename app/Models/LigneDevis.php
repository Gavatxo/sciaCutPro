<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneDevis extends Model
{
    protected $fillable = [
        'devis_id',
        'prestation_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    public function devis()
    {
        return $this->belongsTo(Devis::class);
    }

    public function prestation()
    {
        return $this->belongsTo(Prestation::class);
    }
}
