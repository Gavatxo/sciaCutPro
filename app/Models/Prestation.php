<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'unit',
        'default_price',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function lignes()
    {
        return $this->hasMany(LigneDevis::class);
    }
}
