import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function Create({ products }: { products: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        quantity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stock.store'));
    };

    return (
        <AppLayout>
            <Head title="Agregar Stock" />
            <div className="p-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Agregar Stock</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Producto</Label>
                        <select
                            className="border rounded w-full p-2"
                            value={data.product_id}
                            onChange={(e) => setData('product_id', e.target.value)}
                        >
                            <option value="">Selecciona un producto</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        {errors.product_id && (
                            <p className="text-red-500 text-sm">{errors.product_id}</p>
                        )}
                    </div>

                    <div>
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm">{errors.quantity}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Link href={route('stock.index')}>
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>Guardar</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
