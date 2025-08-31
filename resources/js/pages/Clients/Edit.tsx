import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BreadcrumbItem } from '@/types';

//
// Interfaces
//
interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rfc?: string;
  business_name?: string;
  fiscal_regime?: string;
  cfdi_usage?: string;
  postal_code?: string;
  billing_email?: string;
  address?: string;
}

interface EditClientProps {
  client: Client;
}

export default function EditClient({ client }: EditClientProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    rfc: client.rfc || '',
    business_name: client.business_name || '',
    fiscal_regime: client.fiscal_regime || '',
    cfdi_usage: client.cfdi_usage || '',
    postal_code: client.postal_code || '',
    billing_email: client.billing_email || '',
    address: client.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/clients/${client.id}`, {
      onSuccess: () => {
        // Puedes mostrar un toast o mensaje de éxito
      },
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clients', href: '/clients' },
    { title: 'Edit Client', href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Client" />

      <div className="flex-1 p-4 md:p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Editar Cliente</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <Label htmlFor="name" className="mb-2 block">Nombre *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Nombre completo"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="mb-2 block">Teléfono</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="(55) 1234-5678"
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* RFC */}
              <div>
                <Label htmlFor="rfc" className="mb-2 block">RFC</Label>
                <Input
                  id="rfc"
                  value={data.rfc}
                  onChange={(e) => setData('rfc', e.target.value)}
                  placeholder="AAA010101AAA"
                />
                {errors.rfc && <p className="text-sm text-red-500 mt-1">{errors.rfc}</p>}
              </div>

              {/* Nombre fiscal */}
              <div>
                <Label htmlFor="business_name" className="mb-2 block">Razón Social</Label>
                <Input
                  id="business_name"
                  value={data.business_name}
                  onChange={(e) => setData('business_name', e.target.value)}
                  placeholder="Nombre fiscal"
                />
              </div>

              {/* Régimen fiscal */}
              <div>
                <Label htmlFor="fiscal_regime" className="mb-2 block">Régimen Fiscal</Label>
                <Input
                  id="fiscal_regime"
                  value={data.fiscal_regime}
                  onChange={(e) => setData('fiscal_regime', e.target.value)}
                  placeholder="Régimen"
                />
              </div>

              {/* Uso CFDI */}
              <div>
                <Label htmlFor="cfdi_usage" className="mb-2 block">Uso CFDI</Label>
                <Input
                  id="cfdi_usage"
                  value={data.cfdi_usage}
                  onChange={(e) => setData('cfdi_usage', e.target.value)}
                  placeholder="Uso CFDI"
                />
              </div>

              {/* Código Postal */}
              <div>
                <Label htmlFor="postal_code" className="mb-2 block">Código Postal</Label>
                <Input
                  id="postal_code"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  placeholder="Código postal"
                />
              </div>

              <div>
                <Label htmlFor="billing_email" className="mb-2 block">Email de Facturación</Label>
                <Input
                  id="billing_email"
                  value={data.billing_email}
                  onChange={(e) => setData('billing_email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
                {errors.billing_email && <p className="text-sm text-red-500 mt-1">{errors.billing_email}</p>}
              </div>

              <div>
                <Label htmlFor="address" className="mb-2 block">Dirección</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Dirección"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/clients">
                  <Button variant="secondary">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Guardando...' : 'Actualizar Cliente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
