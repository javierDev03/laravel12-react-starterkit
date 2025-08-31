import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        notes: '',
        requires_invoice: false,
        rfc: '',
        business_name: '',
        fiscal_regime: '',
        cfdi_usage: '',
        postal_code: '',
        address: '',
        billing_email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clients');
    };

    const breadcrumbs = [
        { title: 'Clients', href: '/clients' },
        { title: 'Create Client', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />
            <div className="flex-1 p-4 md:p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Client</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} className={errors.name ? 'border-red-500' : ''} />
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
                                <Checkbox id="requires_invoice" checked={data.requires_invoice} onCheckedChange={(value) => setData('requires_invoice', value)} />
                                <Label htmlFor="requires_invoice">Requires Invoice?</Label>
                            </div>

                            {data.requires_invoice && (
                                <div className="space-y-4 pl-5 border-l border-muted/40">
                                    <div>
                                        <Label>RFC</Label>
                                        <Input value={data.rfc} onChange={e => setData('rfc', e.target.value)} />
                                        {errors.rfc && <p className="text-red-500 text-sm">{errors.rfc}</p>}
                                    </div>
                                    <div>
                                        <Label>Business Name</Label>
                                        <Input value={data.business_name} onChange={e => setData('business_name', e.target.value)} />
                                        {errors.business_name && <p className="text-red-500 text-sm">{errors.business_name}</p>}
                                    </div>
                                    <div>
                                        <Label>Fiscal Regime</Label>
                                        <Input value={data.fiscal_regime} onChange={e => setData('fiscal_regime', e.target.value)} />
                                        {errors.fiscal_regime && <p className="text-red-500 text-sm">{errors.fiscal_regime}</p>}
                                    </div>
                                    <div>
                                        <Label>CFDI Usage</Label>
                                        <Input value={data.cfdi_usage} onChange={e => setData('cfdi_usage', e.target.value)} />
                                        {errors.cfdi_usage && <p className="text-red-500 text-sm">{errors.cfdi_usage}</p>}
                                    </div>
                                    <div>
                                        <Label>Postal Code</Label>
                                        <Input value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} />
                                        {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code}</p>}
                                    </div>
                                    <div>
                                        <Label>Billing Email</Label>
                                        <Input value={data.billing_email} onChange={e => setData('billing_email', e.target.value)} />
                                        {errors.billing_email && <p className="text-red-500 text-sm">{errors.billing_email}</p>}
                                    </div>
                                    <div>
                                        <Label>Address</Label>
                                        <Input value={data.address} onChange={e => setData('address', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Link href="/clients"><Button variant="secondary">Cancel</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Create Client'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
