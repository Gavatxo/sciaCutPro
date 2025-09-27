<?php

// app/Models/Client.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'type',
        'first_name',
        'last_name',
        'company_name',
        'name',
        'address',
        'postal_code',
        'city',
        'phone',
        'email',
        'contact_person',
        'siret',
        'tva_number',
        'payment_terms',
        'notes',
    ];

    // Calculer automatiquement le nom complet
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($client) {
            if ($client->type === 'particulier') {
                $client->name = trim($client->first_name . ' ' . $client->last_name);
            } elseif ($client->type === 'professionnel') {
                $client->name = $client->company_name;
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function devis()
    {
        return $this->hasMany(Devis::class);
    }

    // Accesseur pour obtenir le nom d'affichage
    public function getDisplayNameAttribute()
    {
        if ($this->type === 'particulier') {
            return trim($this->first_name . ' ' . $this->last_name);
        }

        return $this->company_name;
    }

    // Accesseur pour obtenir le type formaté
    public function getTypeFormattedAttribute()
    {
        return $this->type === 'particulier' ? 'Particulier' : 'Professionnel';
    }
}
