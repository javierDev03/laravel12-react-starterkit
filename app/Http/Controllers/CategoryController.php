<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $categories = $this->service->getAll();
        return Inertia::render('Products/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->service->update($category, $request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return redirect()
            ->route('products.index')
            ->with('success', 'Categoría eliminada correctamente.');
    }
}
