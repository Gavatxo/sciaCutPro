<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'siret',
    ];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function devis()
    {
        return $this->hasMany(Devis::class);
    }
}
