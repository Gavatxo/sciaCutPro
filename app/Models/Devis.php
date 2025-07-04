<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Devis extends Model
{
    use HasFactory;

    protected $table = 'devis';

    protected $fillable = [
        'company_id',
        'client_id',
        'numero',
        'chantier_name',
        'chantier_address',
        'date_intervention',
        'validity_days',
        'notes',
        'total_ht',
        'tva_rate',
        'total_ttc',
        'status',
        'signed_at',
        'signature_data',
    ];

    protected $casts = [
        'date_intervention' => 'date',
        'signed_at' => 'datetime',
        'signature_data' => 'array',
        'total_ht' => 'decimal:2',
        'tva_rate' => 'decimal:2', 
        'total_ttc' => 'decimal:2',
        'validity_days' => 'integer',
    ];

    // Relations
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
        return $this->hasMany(LigneDevis::class)->orderBy('order');
    }

    // Accesseurs
    public function getValidUntilAttribute()
    {
        if (!$this->created_at || !$this->validity_days) {
            return null;
        }
        
        return $this->created_at->addDays($this->validity_days);
    }

    public function getIsExpiredAttribute()
    {
        $validUntil = $this->valid_until;
        return $validUntil ? $validUntil->isPast() : false;
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'brouillon' => 'Brouillon',
            'envoye' => 'Envoyé',
            'signe' => 'Signé',
            'refuse' => 'Refusé',
            'expire' => 'Expiré',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    // Scopes
    public function scopeForCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('numero', 'like', "%{$search}%")
              ->orWhere('chantier_name', 'like', "%{$search}%")
              ->orWhereHas('client', function($clientQuery) use ($search) {
                  $clientQuery->where('name', 'like', "%{$search}%");
              });
        });
    }
}