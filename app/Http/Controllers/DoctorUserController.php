<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // Importante para validación avanzada si se necesita

class DoctorUserController extends Controller
{
    public function __construct()
    {
        // Permisos del doctor
        $this->middleware('permission:users-view', ['only' => ['index']]);
        // $this->middleware('permission:users-create', ['only' => ['create', 'store']]);
        // $this->middleware('permission:users-edit', ['only' => ['edit', 'update']]);
        // $this->middleware('permission:users-delete', ['only' => ['destroy']]);
    }

    public function index()
    {
        // Solo usuarios de la clínica del doctor
        $users = User::where('clinic_id', auth()->user()->clinic_id)
            ->with('roles')           // Trae roles del usuario
            ->with('clinic:id,name')  // Solo id y nombre de la clínica
            ->get();

        return Inertia::render('Doctor/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        // Solo roles de la clínica del doctor
        $roles = Role::where('clinic_id', auth()->user()->clinic_id)
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            });

        return Inertia::render('Doctor/Users/Form', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        // Obtener los IDs de los roles de la clínica para validar
        $clinicRoleIds = Role::where('clinic_id', auth()->user()->clinic_id)->pluck('id');
        $clinicRoleNames = Role::where('clinic_id', auth()->user()->clinic_id)->pluck('name');


        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'required|array',
            // CORRECCIÓN: Validar que los nombres de rol existan en la tabla 'roles'
            // y que pertenezcan a la clínica del doctor
            'roles.*' => [
                'required',
                'string',
                Rule::in($clinicRoleNames) // Asegura que solo sean roles de esta clínica
            ],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'clinic_id' => auth()->user()->clinic_id, // Solo su clínica
        ]);

        // Asigna roles seleccionados por nombre (syncRoles es inteligente y acepta nombres o IDs)
        $user->syncRoles($request->roles);

        return redirect()->route('doctor.users.index')->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        // Asegurarse que el doctor solo edite usuarios de su clínica
        if ($user->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $roles = Role::where('clinic_id', auth()->user()->clinic_id)
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            });

        // CORRECCIÓN: Enviar los nombres de los roles, no los IDs,
        // para que coincida con la lógica del checkbox en React.
        $currentRoles = $user->roles->pluck('name')->toArray();

        return Inertia::render('Doctor/Users/Form', [
            'user' => $user,
            'roles' => $roles,
            'currentRoles' => $currentRoles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Asegurarse que el doctor solo actualice usuarios de su clínica
        if ($user->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        // Obtener los nombres de los roles de la clínica para validar
        $clinicRoleNames = Role::where('clinic_id', auth()->user()->clinic_id)->pluck('name');

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'password' => 'nullable|string|min:8',
            'roles' => 'required|array',
            // CORRECCIÓN: Validar que los nombres de rol existan
            'roles.*' => [
                'required',
                'string',
                Rule::in($clinicRoleNames) // Asegura que solo sean roles de esta clínica
            ],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        // syncRoles también funciona con nombres
        $user->syncRoles($request->roles);

        return redirect()->route('doctor.users.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        // Asegurarse que el doctor solo elimine usuarios de su clínica
        if ($user->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $user->delete();
        return redirect()->route('doctor.users.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
