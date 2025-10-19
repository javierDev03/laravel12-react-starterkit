import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/branches', {
            onSuccess: () => console.log('Sucursal creada correctamente!'),
            onError: (errors) => console.log('Errores de validación:', errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Nueva Sucursal" />
            <div className="flex-1 p-4 md:p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Crear Sucursal</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label>Nombre</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <Label>Teléfono</Label>
                                <Input value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input value={data.email} onChange={e => setData('email', e.target.value)} />
                            </div>
                            <div>
                                <Label>Dirección</Label>
                                <Input value={data.address} onChange={e => setData('address', e.target.value)} />
                            </div>
                            <div>
                                <Label>Ciudad</Label>
                                <Input value={data.city} onChange={e => setData('city', e.target.value)} />
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <Input value={data.state} onChange={e => setData('state', e.target.value)} />
                            </div>
                            <div>
                                <Label>Código Postal</Label>
                                <Input value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} />
                            </div>

                            {/* Switch para activo */}
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={data.active}
                                    onCheckedChange={(checked) => setData('active', checked)}
                                />
                                <Label>Activo</Label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Link href="/branches"><Button variant="secondary">Cancelar</Button></Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
