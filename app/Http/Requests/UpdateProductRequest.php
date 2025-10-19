<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Puedes personalizar según permisos
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Esta versión permite actualizar solo los campos enviados,
     * haciendo que la imagen sea opcional y validando los demás
     * campos solo si están presentes en la solicitud.
     */
    public function rules(): array
    {
        $productId = $this->route('product')->id ?? null;

        return [
            'name' => 'sometimes|required|string|max:255',
            'sku' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'active' => 'sometimes|required|boolean',
            'image' => 'sometimes|nullable|image|max:2048', // 2MB máximo
        ];
    }
}
