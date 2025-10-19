<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    protected $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index()
    {
        $sales = \App\Models\Sale::with(['items.product', 'user', 'branch'])
            ->latest()
            ->paginate(10);

        return Inertia::render('sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        $products = \App\Models\Product::whereHas('stocks', function ($query) use ($user) {
            $query->where('branch_id', $user->branch_id)
                ->where('quantity', '>', 0);
        })
            ->with(['stocks' => function ($query) use ($user) {
                $query->where('branch_id', $user->branch_id);
            }])
            ->get();

        return Inertia::render('sales/Create', [
            'products' => $products,
        ]);
    }

    public function store(SaleRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['branch_id'] = auth()->user()->branch_id;

        $sale = $this->saleService->createSale($data);

        return redirect()->route('sales.index')
            ->with('success', 'Venta registrada correctamente.');
    }
}
