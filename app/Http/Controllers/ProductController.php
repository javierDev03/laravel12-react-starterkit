<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    /**
     * Muestra la lista de productos junto con las categorías.
     */
    public function index()
    {
        $products = $this->service->getAll();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Redirige al index (no usamos vista separada para crear).
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }


    /**
     * Crea un nuevo producto.
     */
    public function store(StoreProductRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto creado correctamente.');
    }

    /**
     * Actualiza un producto existente.
     */

    public function edit(Product $product)
    {
        $categories = Category::all(); // traer todas las categorías
        return Inertia::render('Products/Edit', [ // apunta a tu componente React
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->service->update($product, $request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Elimina un producto.
     */
    public function destroy(Product $product)
    {
        $this->service->delete($product);

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto eliminado correctamente.');
    }
}
