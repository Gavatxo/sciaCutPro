<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'address',
        'phone',
        'email',
        'contact_person',
        'siret',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function devis()
    {
        return $this->hasMany(Devis::class);
    }
}
