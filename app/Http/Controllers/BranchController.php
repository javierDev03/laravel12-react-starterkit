<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Http\Requests\BranchRequest;
use App\Services\BranchService;
use Inertia\Inertia;

class BranchController extends Controller
{
    protected BranchService $service;

    public function __construct(BranchService $service)
    {
        $this->service = $service;
    }

    // Listado
    public function index()
    {

        $branches = Branch::paginate(10);
        return Inertia::render('Branches/Index', [
            'branches' => $branches
        ]);
    }


    // Formulario de creación
    public function create()
    {
        return Inertia::render('Branches/Create');
    }

    // Guardar nueva sucursal
    public function store(BranchRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('branches.index')->with('success', 'Sucursal creada correctamente.');
    }

    // Formulario de edición
    public function edit(Branch $branch)
    {
        return Inertia::render('Branches/Edit', compact('branch'));
    }

    // Actualizar sucursal
    public function update(BranchRequest $request, Branch $branch)
    {
        $this->service->update($branch, $request->validated());
        return redirect()->route('branches.index')->with('success', 'Sucursal actualizada correctamente.');
    }

    // Eliminar sucursal
    public function destroy(Branch $branch)
    {
        $this->service->delete($branch);
        return redirect()->route('branches.index')->with('success', 'Sucursal eliminada correctamente.');
    }

    public function toggleActive(Branch $branch)
    {
        $branch->active = !$branch->active;
        $branch->save();

        return redirect()->route('branches.index');
    }

}
