<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    /**
     * Obtiene todos los productos con su categoría y la URL de la imagen.
     */
    public function getAll()
    {
        return Product::with('category')
            ->orderBy('name')
            ->paginate(10)
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'active' => $product->active,
                    'category' => $product->category,
                    'image_url' => $product->getFirstMediaUrl('product_images'),
                ];
            });
    }

    /**
     * Crea un producto y sube la imagen opcionalmente.
     */
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $image = $data['image'] ?? null;
            unset($data['image']);

            $product = Product::create($data);

            if ($image) {
                $product->addMedia($image)->toMediaCollection('product_images');
            }

            return $product;
        });
    }

    /**
     * Actualiza un producto y reemplaza la imagen si se envía una nueva.
     */
    public function update(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $image = $data['image'] ?? null;
            unset($data['image']); // 🔹 Separamos la imagen del resto

            // Actualizamos solo los campos que llegaron
            $product->update($data);

            if ($image) {
                // Eliminamos la imagen anterior y agregamos la nueva
                $product->clearMediaCollection('product_images');
                $product->addMedia($image)->toMediaCollection('product_images');
            }

            return $product;
        });
    }


    /**
     * Elimina un producto y su imagen asociada.
     */
    public function delete(Product $product): void
    {
        $product->clearMediaCollection('product_images');
        $product->delete();
    }
}
