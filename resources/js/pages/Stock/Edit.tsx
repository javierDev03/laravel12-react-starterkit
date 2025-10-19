import React from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Edit() {
    const { stock, products } = usePage().props; // viene desde el controlador
    const { data, setData, put, processing, errors } = useForm({
        product_id: stock.product_id || '',
        quantity: stock.quantity || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('stock.update', stock.id), {
            onSuccess: () => toast.success('Stock actualizado correctamente'),
            onError: () => toast.error('Ocurrió un error al actualizar el stock'),
        });
    };

    return (
        <AppLayout title="Editar Stock">
            <Head title="Editar Stock" />

            <div className="max-w-3xl mx-auto p-4">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Editar Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="product_id">Producto</Label>
                                <select
                                    id="product_id"
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="quantity">Cantidad</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Link
                                    href={route('stock.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Guardar cambios
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
