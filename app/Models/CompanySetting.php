<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_id',
        'logo_path',
        'colors',
        'signature_text',
        'payment_conditions',
        'legal_mentions',
        'warranty_conditions',
        'quote_validity_days',
        'quote_footer',
        'invoice_footer',
        'email_signature',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
