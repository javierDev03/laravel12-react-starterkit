<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id(); // ID único del cliente
            $table->string('name'); // Nombre completo del cliente
            $table->string('email')->nullable(); // Correo electrónico opcional
            $table->string('phone')->nullable(); // Teléfono opcional
            $table->text('notes')->nullable(); // Notas internas

            // Fiscal data (optional / datos fiscales opcionales)
            $table->string('rfc', 13)->nullable()->index(); // RFC, obligatorio solo si requiere factura
            $table->string('business_name')->nullable(); // Razón social
            $table->string('fiscal_regime', 3)->nullable(); // Régimen fiscal (ej. 601)
            $table->string('cfdi_usage', 3)->nullable(); // Uso del CFDI (ej. G01)
            $table->string('postal_code', 5)->nullable(); // Código postal para facturación
            $table->string('address')->nullable(); // Dirección opcional
            $table->string('billing_email')->nullable(); // Correo de facturación

            // Control
            $table->boolean('requires_invoice')->default(false); // Si el cliente desea factura
            $table->boolean('fiscal_data_completed')->default(false); // Si completó sus datos fiscales

            $table->timestamps(); // created_at / updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
