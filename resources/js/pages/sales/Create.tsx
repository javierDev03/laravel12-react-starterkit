import React, { useState, useEffect } from 'react';
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
// --- IMPORTS PARA EL BUSCADOR Y MODAL ---
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';
import { debounce } from 'lodash';

// --- INTERFACES (CLIENT Y PRODUCT LOCAL) ---
interface Product {
    id: number;
    name: string;
    price?: number;
}

interface Client {
    id: number;
    name: string;
}

// --- INTERFAZ PARA EL BUSCADOR GLOBAL (CON DATOS DE SUCURSAL) ---
interface ProductGlobal {
    id: number;
    name: string;
    sku: string;
    price?: number;
    stocks: {
        branch_name: string;
        branch_id: number;
        quantity: number;
        is_current_branch: boolean;
        branch_phone?: string;
        branch_address?: string;
    }[];
}

interface FormData {
    items: {
        product_id: number;
        quantity: number;
        price: number;
    }[];
    client_id: '';
    discount: number;
    tax: number;
    payment_method: string;
}

interface PageProps {
    products: Product[]; // Estos son los productos locales
    clients: Client[];
    currentBranchId: number; // Necesitarás pasar esto desde tu SaleController@create
}

export default function Create({ products, clients, currentBranchId }: PageProps) {
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

    // --- ESTADOS PARA EL BUSCADOR GLOBAL ---
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductGlobal[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductGlobal | null>(null);

    // --- FUNCIÓN DE BÚSQUEDA CON AXIOS ---
    const searchProducts = debounce(async (q: string) => {
        if (!q) return setResults([]);
        setLoading(true);
        // Llama a la ruta que definiste en web.php
        const response = await axios.get('/search-products', { params: { query: q } });
        setResults(response.data);
        setLoading(false);
    }, 300);

    useEffect(() => {
        searchProducts(query);
    }, [query]);

    // --- FUNCIÓN PARA ABRIR EL MODAL ---
    const showBranchDetails = (product: ProductGlobal) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // --- FUNCIÓN PARA AGREGAR ITEM (GLOBAL O LOCAL) ---
    const addItem = (product: Product | ProductGlobal) => {
        const exists = data.items.find((i) => i.product_id === product.id);
        if (exists) return;
        setData('items', [
            ...data.items,
            { product_id: product.id, quantity: 1, price: product.price || 0 },
        ]);
    };

    // --- FUNCIÓN PARA AGREGAR ITEM LOCAL (DEL DROPDOWN) ---
    const addLocalItem = () => {
        const product = products.find(
            (p) => p.id === Number(currentItem.product_id)
        );
        if (!product) return;

        const priceToUse = Number(currentItem.price) > 0 ? Number(currentItem.price) : (product.price || 0);

        setData('items', [
            ...data.items,
            { product_id: product.id, quantity: Number(currentItem.quantity), price: priceToUse },
        ]);
        setCurrentItem({ product_id: '', quantity: 1, price: 0 });
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
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

                {/* --- Buscador global (el nuevo) --- */}
                <div className="mt-4">
                    <Label>Buscar productos (global)</Label>
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nombre o SKU en todas las sucursales"
                    />
                    {loading && <p className="text-sm text-gray-500 mt-2">Buscando...</p>}

                    {results.length > 0 && (
                        <table className="w-full border mt-2">
                            <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Producto</th>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-left">Disponibilidad</th>
                                <th className="p-2 text-left">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">{product.sku}</td>
                                    <td className="p-2">
                                        {product.stocks.reduce((acc, s) => acc + s.quantity, 0) > 0
                                            ? `En ${product.stocks.filter(s => s.quantity > 0).length} sucursal(es)`
                                            : 'Sin stock'}
                                    </td>
                                    <td className="p-2 flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => showBranchDetails(product)}
                                        >
                                            Ver Detalles
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => addItem(product)}
                                        >
                                            Agregar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* ======= Sección de agregar productos ======= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agregar productos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* --- Selector de productos locales (el que tenías) --- */}
                        <div className="flex flex-col md:flex-row gap-4 items-end p-4 border rounded-md">
                            <div className="flex-1">
                                <Label>Producto local</Label>
                                <Select
                                    value={currentItem.product_id}
                                    onValueChange={(v) => {
                                        const prod = products.find(p => p.id === Number(v));
                                        setCurrentItem({
                                            ...currentItem,
                                            product_id: v,
                                            price: prod?.price || 0 // Auto-llena el precio
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un producto local" />
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
                                        setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })
                                    }
                                    className="w-24"
                                />
                            </div>
                            <div>
                                <Label>Precio</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={currentItem.price}
                                    onChange={(e) =>
                                        setCurrentItem({ ...currentItem, price: Number(e.target.value) })
                                    }
                                    className="w-28"
                                />
                            </div>
                            <Button type="button" onClick={addLocalItem}>
                                Agregar
                            </Button>
                        </div>



                        {/* --- Tabla de productos agregados (común para ambos) --- */}
                        {data.items.length > 0 && (
                            <table className="w-full mt-6 border">
                                <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-2 text-left">Producto</th>
                                    <th className="p-2 text-left">Cantidad</th>
                                    <th className="p-2 text-left">Precio</th>
                                    <th className="p-2 text-left">Subtotal</th>
                                    <th className="p-2 text-left">Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.items.map((item, i) => {
                                    // Busca en la lista local O en los resultados de búsqueda
                                    const product = products.find((p) => p.id === item.product_id) || results.find((p) => p.id === item.product_id);
                                    return (
                                        <tr key={i} className="border-b">
                                            <td className="p-2">{product?.name || `Producto ID: ${item.product_id}`}</td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        setData('items', data.items.map((it, idx) =>
                                                            idx === i ? { ...it, quantity: Number(e.target.value) } : it
                                                        ))
                                                    }
                                                    className="w-20"
                                                />
                                            </td>
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

                        {/* --- Cliente (usando <Select> de shadcn) --- */}
                        {/* --- Cliente (FIX) --- */}
                        <div className="mb-4 pt-4">
                            <Label>Cliente</Label>
                            <Select
                                value={data.client_id}
                                onValueChange={(v) => setData('client_id', v)}
                            >
                                <SelectTrigger>
                                    {/* 1. El placeholder se define aquí DENTRO de SelectValue */}
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* El map de tus clientes está perfecto así: */}
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={String(client.id)}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* --- Resumen de venta --- */}
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
                                    onChange={(e) => setData('discount', Number(e.target.value))}
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

                        <div className="flex justify-end text-lg font-semibold pt-4">
                            <span>Total final: ${totalFinal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing || data.items.length === 0}>
                                Guardar venta
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* --- MODAL PARA VER DETALLES DE STOCK --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Stock de: {selectedProduct?.name}</DialogTitle>
                        <DialogDescription>
                            Disponibilidad y datos de las sucursales.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
                        {selectedProduct?.stocks && selectedProduct.stocks.filter(s => s.quantity > 0).length > 0 ? (
                            selectedProduct.stocks.filter(s => s.quantity > 0).map((stock) => (
                                <div key={stock.branch_id} className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-lg">{stock.branch_name}</h4>
                                        <span className={`font-bold text-green-600`}>
                                            Stock: {stock.quantity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        📞 Tel: {stock.branch_phone || 'No disponible'}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        📍 Dir: {stock.branch_address || 'No disponible'}
                                    </p>
                                    {stock.is_current_branch && (
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mt-1"> (Tu Sucursal Actual)</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Este producto no tiene stock disponible en ninguna sucursal.</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
