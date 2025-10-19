import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface Category {
    id: number;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
}

export default function CreateProduct({ categories }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        description: '',
        price: '',
        category_id: '',
        active: true,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products', data, { preserveScroll: true, forceFormData: true });
    };

    return (
        <>
            <Head title="Create Product" />
            <AppLayout breadcrumbs={[
                { title: 'Products', href: '/products' },
                { title: 'Create', href: '/products/create' },
            ]}>
                <div className="flex-1 p-4 md:p-6">
                    <Card className='max-w-4xl mx-auto'>
                        <CardHeader>
                            <CardTitle>Create New Product</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Nombre */}
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* SKU */}
                                <div>
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="Unique code for product"
                                    />
                                    {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
                                </div>

                                {/* Categoría */}
                                <div>
                                    <Label htmlFor="category_id">Category</Label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full border rounded-md p-2"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Optional product description"
                                    />
                                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                                </div>

                                {/* Precio */}
                                <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                                </div>

                                {/* Imagen */}
                                <div>
                                    <Label htmlFor="image">Image (optional)</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setData('image', e.target.files[0]);
                                            }
                                        }}
                                    />
                                    {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
                                </div>

                                {/* Activo */}
                                <div className="flex items-center justify-between border p-3 rounded-md">
                                    <Label htmlFor="active">Active</Label>
                                    <Switch
                                        id="active"
                                        checked={data.active}
                                        onCheckedChange={(val) => setData('active', val)}
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end gap-2">
                                    <Link href="/products">
                                        <Button variant="secondary">Cancel</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
