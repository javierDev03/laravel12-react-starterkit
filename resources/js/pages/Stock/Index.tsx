import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function Index() {
    const { stocks = [], products = [] } = usePage().props as {
        stocks: any[];
        products: any[];
    };

    return (
        <AppLayout>
            <Head title="Gestión de Stock" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Gestión de Stock</h1>
                    <Link href={route('stock.create')}>
                        <Button>Agregar stock</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stocks.length > 0 ? (
                            <table className="w-full text-left border">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-2">Producto</th>
                                    <th className="p-2">Cantidad</th>
                                    <th className="p-2">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stocks.map((stock) => (
                                    <tr key={stock.id} className="border-b">
                                        <td className="p-2">{stock.product?.name}</td>
                                        <td className="p-2">{stock.quantity}</td>
                                        <td className="p-2 space-x-2">
                                            <Link href={route('stock.edit', stock.id)}>
                                                <Button variant="outline" size="sm">Editar</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay registros de stock.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
