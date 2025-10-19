import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Branch {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Sale {
    id: number;
    branch: Branch;
    user: User;
    total: number;
    payment_method: string;
    status: string;
    created_at: string;
}

interface PageProps {
    sales: {
        data: Sale[];
    };
}

export default function Index() {
    const { sales } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title="Ventas" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Gestión de Ventas</h1>
                    <Link href={route('sales.create')}>
                        <Button>Registrar nueva venta</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sales.data.length > 0 ? (
                            <table className="w-full text-left border">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-2">#</th>
                                    <th className="p-2">Sucursal</th>
                                    <th className="p-2">Usuario</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2">Método de pago</th>
                                    <th className="p-2">Estado</th>
                                    <th className="p-2">Fecha</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="border-b">
                                        <td className="p-2">{sale.id}</td>
                                        <td className="p-2">{sale.branch?.name}</td>
                                        <td className="p-2">{sale.user?.name}</td>
                                        <td className="p-2">${sale.total.toFixed(2)}</td>
                                        <td className="p-2 capitalize">{sale.payment_method}</td>
                                        <td className="p-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-sm ${
                                                        sale.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {sale.status}
                                                </span>
                                        </td>
                                        <td className="p-2">
                                            {new Date(sale.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No hay ventas registradas aún.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
