<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use App\Http\Requests\StockRequest;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    protected $service;

    public function __construct(StockService $service)
    {
        $this->service = $service;
    }

    // Listar stock
    public function index()
    {
        $stocks = $this->service->getAll();
        $products = Product::all();

        return Inertia::render('Stock/Index', [
            'stocks' => $stocks ?? [],
            'products' => $products ?? [],
        ]);
    }

    // Formulario de creación
    public function create()
    {
        $products = Product::all();

        return Inertia::render('Stock/Create', [
            'products' => $products ?? [],
        ]);
    }

    // Guardar stock nuevo
    public function store(StockRequest $request)
    {
        $this->service->createOrAdd(
            $request->product_id,
            $request->quantity
        );

        return redirect()->route('stock.index')->with('success', 'Stock actualizado correctamente.');
    }

    // Editar cantidad de stock
    public function edit(Stock $stock)
    {
        $products = Product::all();

        return Inertia::render('Stock/Edit', [
            'stock' => $stock,
            'products' => $products ?? [],
        ]);
    }

    public function update(StockRequest $request, Stock $stock)
    {
        $this->service->update($stock, $request->quantity);

        return redirect()->route('stock.index')->with('success', 'Stock actualizado correctamente.');
    }

    public function destroy(Stock $stock)
    {
        $this->service->delete($stock);

        return redirect()->route('stock.index')->with('success', 'Stock eliminado correctamente.');
    }
}
