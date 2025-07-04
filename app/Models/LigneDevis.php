<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneDevis extends Model
{
    protected $fillable = [
        'devis_id',
        'prestation_id',
        'description',
        'description_detail',
        'quantity',
        'unit',
        'unit_price',
        'total',
        'order'
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
