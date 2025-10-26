<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class DoctorRoleController extends Controller
{
    public function __construct()
    {
        // Middleware para permisos del doctor
        $this->middleware('permission:roles-view', ['only' => ['index']]);
        $this->middleware('permission:roles-create', ['only' => ['create', 'store']]);
        // $this->middleware('permission:roles-edit', ['only' => ['edit', 'update']]);
        // $this->middleware('permission:roles-delete', ['only' => ['destroy']]);
    }

    /**
     * Lista los roles que el doctor puede ver.
     */
    public function index()
    {
        $roles = auth()->user()->clinic?->roles()->with('permissions')->get() ?? collect();

        return Inertia::render('Doctor/Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Muestra el formulario para crear un rol.
     */
    public function create()
    {
        $assignablePermissions = $this->assignablePermissions();

        return Inertia::render('Doctor/Roles/Form', [
            'role' => null,
            'groupedPermissions' => $assignablePermissions,
        ]);
    }

    /**
     * Guarda un nuevo rol creado por el doctor.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
        ]);

        $requestedPermissions = $request->input('permissions', []);
        $this->validatePermissions($requestedPermissions);

        $role = Role::create([
            'name' => $request->name,
            'clinic_id' => auth()->user()->clinic_id,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($requestedPermissions);

        return redirect()->route('doctor.roles.index')->with('success', 'Rol creado correctamente.');
    }

    /**
     * Muestra el formulario para editar un rol existente.
     */
    public function edit(Role $role)
    {
        $this->authorizeRole($role);

        $assignablePermissions = $this->assignablePermissions();

        return Inertia::render('Doctor/Roles/Form', [
            'role' => $role->load('permissions'),
            'groupedPermissions' => $assignablePermissions,
        ]);
    }

    /**
     * Actualiza un rol existente.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorizeRole($role);

        $data = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
        ]);

        $requestedPermissions = $request->input('permissions', []);
        $this->validatePermissions($requestedPermissions);

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($requestedPermissions);

        return redirect()->route('doctor.roles.index')->with('success', 'Rol actualizado correctamente.');
    }

    /**
     * Elimina un rol.
     */
    public function destroy(Role $role)
    {
        $this->authorizeRole($role);

        $role->delete();

        return redirect()->route('doctor.roles.index')->with('success', 'Rol eliminado correctamente.');
    }

    /**
     * Obtiene los permisos que el doctor puede asignar.
     */
    private function assignablePermissions()
    {
        return Permission::whereIn('name', [
            'access-view',
            'dashboard-view',
            'clients-view',
            'sales-view',
            'roles-view',
            'roles-create',
            'roles-edit',
            'roles-delete',
            'users-view',
        ])->get()->groupBy('group');
    }

    /**
     * Valida que los permisos solicitados estén permitidos para el doctor.
     */
    private function validatePermissions(array $permissions)
    {
        $allowed = Permission::whereIn('name', [
            'access-view',
            'dashboard-view',
            'clients-view',
            'sales-view',
            'roles-view',
            'roles-create',
            'roles-edit',
            'roles-delete',
            'users-view',
        ])->pluck('name')->toArray();

        foreach ($permissions as $perm) {
            if (!in_array($perm, $allowed)) {
                abort(403, 'Intento de asignar un permiso no autorizado.');
            }
        }
    }

    /**
     * Valida que el rol pertenezca a la clínica del doctor.
     */
    private function authorizeRole(Role $role)
    {
        if ($role->clinic_id !== auth()->user()->clinic_id) {
            abort(403, 'No autorizado.');
        }
    }
}
