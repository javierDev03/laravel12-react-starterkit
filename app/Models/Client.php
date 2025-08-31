<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    // Campos que se pueden llenar masivamente
    protected $fillable = [
        'name', // Nombre completo
        'email', // Correo electrónico
        'phone', // Teléfono
        'notes', // Notas internas
        'rfc', // RFC
        'business_name', // Razón social
        'fiscal_regime', // Régimen fiscal
        'cfdi_usage', // Uso CFDI
        'postal_code', // Código postal
        'address', // Dirección
        'billing_email', // Correo de facturación
        'requires_invoice', // Cliente quiere factura
        'fiscal_data_completed', // Datos fiscales completos
    ];
}
