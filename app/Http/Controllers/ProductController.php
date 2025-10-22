<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ProductController extends Controller
{
    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $products = $this->service->getAll();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();

        return Inertia::render('Products/Edit', [
            'product' => [
                ...$product->toArray(),
                'image_url' => $product->getFirstMediaUrl('product_images'),
            ],
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

    public function destroy(Product $product)
    {
        $this->service->delete($product);

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto eliminado correctamente.');
    }

    public function searchProducts(Request $request)
    {
        $query = $request->get('query', '');
        $currentBranchId = auth()->user()->branch_id ?? null;

        if (!$query) {
            return response()->json([]);
        }

        $products = Product::with(['stocks.branch'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('sku', 'like', "%{$query}%");
            })
            ->get()
            ->map(function ($product) use ($currentBranchId) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price ?? 0,
                    'stocks' => $product->stocks->map(function ($stock) use ($currentBranchId) {
                        return [
                            // --- FIX AQUÍ ---
                            'branch_name' => $stock->branch?->name ?? 'Sucursal desconocida',
                            'branch_id' => $stock->branch_id,
                            'quantity' => $stock->quantity,
                            'is_current_branch' => $currentBranchId && $stock->branch_id == $currentBranchId,

                            // --- Y FIX AQUÍ ---
                            'branch_phone' => $stock->branch?->phone ?? null,
                            'branch_address' => $stock->branch?->address ?? null,
                        ];
                    }),
                ];
            });

        return response()->json($products);
    }

}
