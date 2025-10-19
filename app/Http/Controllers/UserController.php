<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\Branch;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $branches = Branch::all();

        $query = User::with(['roles', 'branch'])->latest();


        if ($request->filled('branch_id') && $request->branch_id !== '__all__') {
            $query->where('branch_id', $request->branch_id);
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('users/Index', [
            'users' => $users,
            'branches' => $branches,
            'filters' => $request->only('branch_id'),
        ]);
    }


    public function create()
    {
        $roles = Role::all();
        $branches = Branch::all();

        return Inertia::render('users/Form', [
            'roles' => $roles,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'roles'    => ['required', 'array', 'min:1'],
            'roles.*'  => ['required', Rule::exists('roles', 'name')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')], // 👈
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'branch_id' => $validated['branch_id'] ?? null,
        ]);

        $user->assignRole($validated['roles']);

        return redirect()->route('users.index')->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $branches = Branch::all();

        return Inertia::render('users/Form', [
            'user'         => $user->only(['id', 'name', 'email', 'branch_id']),
            'roles'        => $roles,
            'branches'     => $branches,
            'currentRoles' => $user->roles->pluck('name')->toArray(), // multiple roles
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'roles'    => ['required', 'array', 'min:1'],
            'roles.*'  => ['required', Rule::exists('roles', 'name')],
            'branch_id' => ['nullable', Rule::exists('branches', 'id')], // 👈
        ]);

        $user->update([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password']
                ? Hash::make($validated['password'])
                : $user->password,
            'branch_id' => $validated['branch_id'] ?? null,
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(User $user)
    {
        $user->update([
            'password' => Hash::make('ResetPasswordNya'),
        ]);

        return redirect()->back()->with('success', 'Password berhasil direset ke default.');
    }
}
