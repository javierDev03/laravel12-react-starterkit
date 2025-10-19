<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function createSale(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            // Crear la venta base
            $sale = Sale::create([
                'user_id' => $data['user_id'],
                'branch_id' => $data['branch_id'],
                'client_id' => $data['client_id'] ?? null,
                'total' => 0,
                'discount' => $data['discount'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'status' => 'completed',
                'payment_method' => $data['payment_method'] ?? 'cash',
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                $total += $subtotal;

                // Crear los items de la venta
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $subtotal,
                ]);

                // Descontar stock
                $stock = Stock::where('product_id', $item['product_id'])
                    ->where('branch_id', $data['branch_id'])
                    ->first();

                if ($stock) {
                    $stock->quantity -= $item['quantity'];
                    $stock->save();
                }
            }

            // Calcular total final
            $sale->total = $total - $sale->discount + $sale->tax;
            $sale->save();

            return $sale;
        });
    }
}
