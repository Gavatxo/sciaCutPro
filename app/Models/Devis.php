<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    protected $fillable = [
        'company_id',
        'client_id',
        'number',
        'date',
        'validity_date',
        'status',
        'total_amount',
        'tax_amount',
        'net_amount',
        'footer_text',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes()
    {
        return $this->hasMany(LigneDevis::class);
    }
}
