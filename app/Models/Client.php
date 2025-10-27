<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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
        'clinic_id', // ID de la clínica (sucursal)
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    protected static function booted()
    {
        static::addGlobalScope('clinic', function (Builder $builder) {
            if ($user = Auth::user()) {
                $builder->where('clinic_id', $user->clinic_id);
            }
        });
    }
}
