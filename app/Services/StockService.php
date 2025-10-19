<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

class StockService
{
    /**
     * Obtener todo el stock de la sucursal del usuario logueado
     */
    public function getAll(): Collection
    {
        $branchId = Auth::user()->branch_id;

        return Stock::with('product')
            ->where('branch_id', $branchId)
            ->get();
    }

    /**
     * Crear o agregar stock para un producto
     */
    public function createOrAdd(int $productId, int $quantity): Stock
    {
        $branchId = Auth::user()->branch_id;

        // Verifica si ya existe stock para ese producto en esta sucursal
        $stock = Stock::where('branch_id', $branchId)
            ->where('product_id', $productId)
            ->first();

        if ($stock) {
            $stock->quantity += $quantity;
            $stock->save();
        } else {
            $stock = Stock::create([
                'branch_id'  => $branchId,
                'product_id' => $productId,
                'quantity'   => $quantity,
            ]);
        }

        return $stock;
    }

    /**
     * Actualizar stock existente
     */
    public function update(Stock $stock, int $quantity): Stock
    {
        $stock->quantity = $quantity;
        $stock->save();

        return $stock;
    }

    /**
     * Eliminar stock
     */
    public function delete(Stock $stock): bool
    {
        return $stock->delete();
    }
}
