<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Models\Client;
use App\Models\Product;
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
        $sales = \App\Models\Sale::with(['items.product', 'user', 'branch', 'client'])
            ->latest()
            ->paginate(10);


        $clients = Client::orderBy('name')->get();

        return Inertia::render('sales/Index', [
            'sales' => $sales,
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        // Productos filtrados por stock en la sucursal
        $products = Product::whereHas('stocks', function ($query) use ($user) {
            $query->where('branch_id', $user->branch_id)
                ->where('quantity', '>', 0);
        })
            ->with(['stocks' => function ($query) use ($user) {
                $query->where('branch_id', $user->branch_id);
            }])
            ->get();

        // Clientes filtrados por sucursal del usuario
        $clients = Client::where('branch_id', $user->branch_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('sales/Create', [
            'products' => $products,
            'clients' => $clients,
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

    public function searchProducts(Request $request)
    {
        $query = $request->input('query', '');
        $branchId = auth()->user()->branch_id;

        $products = $this->saleService->searchProducts($query, $branchId);

        return response()->json($products);
    }



}
