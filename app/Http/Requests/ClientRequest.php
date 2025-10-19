<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Client;

class ClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $clientId = $this->route('client') instanceof Client
            ? $this->route('client')->id
            : $this->route('client');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:clients,email,' . $clientId],
            'phone' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string'],
            'requires_invoice' => ['required', 'boolean'],
            'rfc' => ['nullable', 'string', 'size:13', 'required_if:requires_invoice,true', 'unique:clients,rfc,' . $clientId],
            'business_name' => ['nullable', 'string', 'max:255', 'required_if:requires_invoice,true'],
            'fiscal_regime' => ['nullable', 'string', 'size:3', 'required_if:requires_invoice,true'],
            'cfdi_usage' => ['nullable', 'string', 'size:3', 'required_if:requires_invoice,true'],
            'postal_code' => ['nullable', 'string', 'size:5', 'required_if:requires_invoice,true'],
            'address' => ['nullable', 'string', 'max:255'],
            'billing_email' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Por favor, ingresa el nombre del cliente.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Ya existe un cliente con este correo.',
            'rfc.required_if' => 'El RFC es obligatorio si el cliente desea factura.',
            'rfc.unique' => 'Ya existe un cliente con este RFC.',
            'business_name.required_if' => 'La razón social es obligatoria si quiere factura.',
            'fiscal_regime.required_if' => 'El régimen fiscal es obligatorio si quiere factura.',
            'cfdi_usage.required_if' => 'El uso del CFDI es obligatorio si quiere factura.',
            'postal_code.required_if' => 'El código postal es obligatorio si quiere factura.',
            'billing_email.email' => 'Ingresa un correo de facturación válido.',
        ];
    }
}
