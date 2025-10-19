import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Edit() {
    const { client } = usePage().props; // viene del controlador
    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        notes: client.notes || '',
        requires_invoice: client.requires_invoice || false,
        rfc: client.rfc || '',
        business_name: client.business_name || '',
        fiscal_regime: client.fiscal_regime || '',
        cfdi_usage: client.cfdi_usage || '',
        postal_code: client.postal_code || '',
        address: client.address || '',
        billing_email: client.billing_email || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/clients/${client.id}`);
    };

    const breadcrumbs = [
        { title: 'Clients', href: '/clients' },
        { title: `Edit ${client.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${client.name}`} />
            <div className="flex-1 p-4 md:p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Client</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires_invoice"
                                    checked={data.requires_invoice}
                                    onCheckedChange={(value) => setData('requires_invoice', value)}
                                />
                                <Label htmlFor="requires_invoice">Requires Invoice?</Label>
                            </div>

                            {data.requires_invoice && (
                                <div className="space-y-4 pl-5 border-l border-muted/40 animate-in fade-in duration-300">
                                    <div>
                                        <Label>RFC</Label>
                                        <Input value={data.rfc} onChange={e => setData('rfc', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Business Name</Label>
                                        <Input value={data.business_name} onChange={e => setData('business_name', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Fiscal Regime</Label>
                                        <Input value={data.fiscal_regime} onChange={e => setData('fiscal_regime', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>CFDI Usage</Label>
                                        <Input value={data.cfdi_usage} onChange={e => setData('cfdi_usage', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Postal Code</Label>
                                        <Input value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Billing Email</Label>
                                        <Input value={data.billing_email} onChange={e => setData('billing_email', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Address</Label>
                                        <Input value={data.address} onChange={e => setData('address', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Link href="/clients">
                                    <Button variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Update Client'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
