import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Product {
    id: number;
    name: string;
    price?: number;
}

interface Client {
    id: number;
    name: string;
}

interface FormData {
    items: {
        product_id: number;
        quantity: number;
        price: number;
    }[];
    client_id: '',
    discount: number;
    tax: number;
    payment_method: string;
}

interface PageProps {
    products: Product[];
    clients: Client[];
}

export default function Create({ products, clients }: PageProps) {
    const { data, setData, post, processing } = useForm<FormData>({
        items: [],
        client_id: '',
        discount: 0,
        tax: 0,
        payment_method: 'cash',
    });

    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        quantity: 1,
        price: 0,
    });

    const addItem = () => {
        if (!currentItem.product_id || Number(currentItem.quantity) <= 0) return;
        const product = products.find((p) => p.id === Number(currentItem.product_id));
        if (!product) return;

        setData('items', [
            ...data.items,
            {
                product_id: product.id,
                quantity: Number(currentItem.quantity),
                price: Number(currentItem.price || product.price || 0),
            },
        ]);

        setCurrentItem({ product_id: '', quantity: 1, price: 0 });
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('sales.store'));
    };

    const total = data.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const totalFinal = total - Number(data.discount || 0) + Number(data.tax || 0);

    return (
        <AppLayout>
            <Head title="Registrar Venta" />

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Nueva Venta</h1>
                    <Link href={route('sales.index')}>
                        <Button variant="outline">Volver</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Agregar productos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Label>Producto</Label>
                                <Select
                                    value={currentItem.product_id}
                                    onValueChange={(v) =>
                                        setCurrentItem({ ...currentItem, product_id: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Cantidad</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={currentItem.quantity}
                                    onChange={(e) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            quantity: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Precio unitario</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={currentItem.price}
                                    onChange={(e) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            price: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <Button type="button" onClick={addItem}>
                                Agregar
                            </Button>
                        </div>

                        {data.items.length > 0 && (
                            <table className="w-full mt-4 border">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-2">Producto</th>
                                    <th className="p-2">Cantidad</th>
                                    <th className="p-2">Precio</th>
                                    <th className="p-2">Subtotal</th>
                                    <th className="p-2">Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.items.map((item, i) => {
                                    const product = products.find(
                                        (p) => p.id === item.product_id
                                    );
                                    return (
                                        <tr key={i} className="border-b">
                                            <td className="p-2">{product?.name}</td>
                                            <td className="p-2">{item.quantity}</td>
                                            <td className="p-2">${item.price.toFixed(2)}</td>
                                            <td className="p-2">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="p-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => removeItem(i)}
                                                >
                                                    Quitar
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Cliente</label>
                            <select
                                name="client_id"
                                value={data.client_id} // <-- data en vez de form.data
                                onChange={(e) => setData('client_id', e.target.value)} // <-- setData
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Seleccionar cliente</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </CardContent>
                </Card>


                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de venta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Descuento</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.discount}
                                    onChange={(e) =>
                                        setData('discount', Number(e.target.value))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Impuesto</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.tax}
                                    onChange={(e) => setData('tax', Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <Label>Método de pago</Label>
                                <Select
                                    value={data.payment_method}
                                    onValueChange={(v) => setData('payment_method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end text-lg font-semibold">
                            <span>Total final: ${totalFinal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Guardar venta
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
