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
        'name', // Calculé automatiquement
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

    protected $casts = [
        'payment_terms' => 'integer',
    ];

    // Relations
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function devis()
    {
        return $this->hasMany(Devis::class);
    }

    // Accesseurs et mutateurs

    /**
     * Génère automatiquement le nom d'affichage selon le type de client
     */
    public function getDisplayNameAttribute()
    {
        if ($this->type === 'particulier') {
            return trim($this->first_name . ' ' . $this->last_name);
        } else {
            return $this->company_name;
        }
    }

    /**
     * Retourne l'adresse complète formatée
     */
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->address,
            $this->postal_code . ' ' . $this->city
        ]);

        return implode("\n", $parts);
    }

    /**
     * Vérifie si le client est un particulier
     */
    public function isParticulier()
    {
        return $this->type === 'particulier';
    }

    /**
     * Vérifie si le client est un professionnel
     */
    public function isProfessionnel()
    {
        return $this->type === 'professionnel';
    }

    /**
     * Retourne le délai de paiement par défaut selon le type
     */
    public function getDefaultPaymentTerms()
    {
        return $this->type === 'particulier' ? 15 : 30;
    }

    /**
     * Boot du modèle pour gérer les événements
     */
    protected static function boot()
    {
        parent::boot();

        // Avant sauvegarde, calculer le nom d'affichage
        static::saving(function ($client) {
            $client->name = $client->display_name;

            // Définir les délais de paiement par défaut si non spécifiés
            if (empty($client->payment_terms)) {
                $client->payment_terms = $client->getDefaultPaymentTerms();
            }
        });
    }

    // Scopes

    /**
     * Scope pour filtrer par type de client
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour les particuliers
     */
    public function scopeParticuliers($query)
    {
        return $query->where('type', 'particulier');
    }

    /**
     * Scope pour les professionnels
     */
    public function scopeProfessionnels($query)
    {
        return $query->where('type', 'professionnel');
    }

    /**
     * Scope pour rechercher par nom/prénom/raison sociale
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('company_name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%");
        });
    }

    // Méthodes utilitaires

    /**
     * Retourne les informations de facturation formatées
     */
    public function getBillingInfo()
    {
        if ($this->type === 'particulier') {
            return [
                'name' => $this->display_name,
                'address' => $this->full_address,
                'payment_terms' => $this->payment_terms,
                'vat_applicable' => false,
            ];
        } else {
            return [
                'name' => $this->company_name,
                'contact' => $this->contact_person,
                'address' => $this->full_address,
                'siret' => $this->siret,
                'tva_number' => $this->tva_number,
                'payment_terms' => $this->payment_terms,
                'vat_applicable' => true,
            ];
        }
    }

    /**
     * Validation des données selon le type de client
     */
    public static function getValidationRules($type = null)
    {
        $baseRules = [
            'type' => 'required|in:particulier,professionnel',
            'address' => 'required|string|max:500',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'payment_terms' => 'nullable|integer|min:1|max:120',
            'notes' => 'nullable|string|max:1000',
        ];

        if ($type === 'particulier') {
            return array_merge($baseRules, [
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
            ]);
        } elseif ($type === 'professionnel') {
            return array_merge($baseRules, [
                'company_name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:100',
                'siret' => 'nullable|string|max:20',
                'tva_number' => 'nullable|string|max:20',
            ]);
        }

        return $baseRules;
    }
}
