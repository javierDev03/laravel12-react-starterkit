import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Inertia,  } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Head } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';

//
// Interfaces
//
interface Category {
    id: number;
    name: string;
    description?: string;
}

interface Product {
    id: number;
    name: string;
    sku?: string;
    price: number;
    stock?: number;
    category?: Category;
}

// <-- AÑADIDO: Interfaz para el objeto de paginación
interface PaginatedProducts {
    data: Product[];
    prev_page_url?: string | null;
    next_page_url?: string | null;
}

interface ProductsPageProps {
    products: PaginatedProducts; // <-- USADO: Reutilizamos la interfaz
    categories: Category[];
}

export default function ProductsIndex() {
    const { products, categories } = usePage<ProductsPageProps>().props;

    // Estados para productos
    const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    // Estados para categorías
    const [newCategory, setNewCategory] = React.useState('');
    const [categoryLoading, setCategoryLoading] = React.useState(false);

    // Búsqueda
    const [searchQuery, setSearchQuery] = React.useState('');
    // <-- CORREGIDO: El estado guarda el objeto paginado completo, no solo el array
    const [searchResults, setSearchResults] = React.useState<PaginatedProducts>(products);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults(products); // <-- CORREGIDO: Resetea al objeto 'products' original
            return;
        }

        try {
            const response = await fetch(`/products/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data); // <-- CORREGIDO: Guarda el objeto de paginación completo
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // <-- AÑADIDO: Función para manejar la paginación
    const handlePaginate = (page: number) => {
        router.get('/products', { page }, { preserveState: true });
    };


    const openDeleteProductDialog = (product: Product) => {
        setProductToDelete(product);
        setOpenDeleteDialog(true);
    };

    const handleDeleteProduct = () => {
        if (productToDelete) {
            Inertia.delete(`/products/${productToDelete.id}`);
            setOpenDeleteDialog(false);
            setProductToDelete(null);
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setCategoryLoading(true);
        Inertia.post('/categories', { name: newCategory }, {
            onFinish: () => {
                setNewCategory('');
                setCategoryLoading(false);
            },
        });
    };

    const handleDeleteCategory = (id: number) => {
        Inertia.delete(`/categories/${id}`);
    };

    return (
        <>
            <Head title="Products" />
            <AppLayout breadcrumbs={[{ title: 'Products', href: '/products' }]}>
                <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">

                    {/* Tabla de productos */}
                    <div className="flex-1">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-5">
                                <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                                    {/* Buscador */}
                                    <div className="flex items-center gap-2 w-full md:w-1/3">
                                        <Input
                                            type="text"
                                            placeholder="Buscar por nombre o SKU..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>

                                    {/* Botón crear */}
                                    <Link href="/products/create">
                                        <Button>Create Product</Button>
                                    </Link>
                                </div>

                                <table className="w-full table-auto border border-border">
                                    <thead>
                                    <tr className="bg-muted text-left">
                                        <th className="p-2 border-b">Name</th>
                                        <th className="p-2 border-b">SKU</th>
                                        <th className="p-2 border-b">Category</th>
                                        <th className="p-2 border-b">Price</th>
                                        <th className="p-2 border-b">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* <-- CORREGIDO: Mapear sobre .data */}
                                    {searchResults.data.map((product) => (
                                        <tr key={product.id}>
                                            <td className="p-2 border-b">{product.name}</td>
                                            <td className="p-2 border-b">{product.sku || '-'}</td>
                                            <td className="p-2 border-b">{product.category?.name || '-'}</td>
                                            <td className="p-2 border-b">${product.price.toFixed(2)}</td>
                                            <td className="p-2 border-b flex gap-2">
                                                <Link href={`/products/${product.id}/edit`}>
                                                    <Button size="sm">Edit</Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteProductDialog(product)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>

                                </table>

                                <div className="mt-4 flex justify-end gap-2">
                                    {products.prev_page_url && (
                                        <Button onClick={() => handlePaginate(products.current_page - 1)}>Prev</Button>
                                    )}
                                    {products.next_page_url && (
                                        <Button onClick={() => handlePaginate(products.current_page + 1)}>Next</Button>
                                    )}
                                </div>



                                {/* Diálogo de eliminación */}
                                <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete{' '}
                                                <strong>{productToDelete?.name}</strong>? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex justify-end gap-2">
                                            <Button variant="secondary" onClick={() => setOpenDeleteDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleDeleteProduct}>
                                                Delete
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mini CRUD de Categorías */}
                    <div className="w-full md:w-80">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-5 space-y-4">
                                {/* Form agregar */}
                                <form onSubmit={handleAddCategory} className="flex gap-2">
                                    <Input
                                        placeholder="New category..."
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <Button type="submit" disabled={categoryLoading}>
                                        {categoryLoading ? 'Saving...' : 'Add'}
                                    </Button>
                                </form>

                                {/* Lista categorías con scroll */}
                                <div className="h-96 overflow-y-auto border rounded-md">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <div key={cat.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                                                <span>{cat.name}</span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm text-center py-4">
                                            No categories yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
