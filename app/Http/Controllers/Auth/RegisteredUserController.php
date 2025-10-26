<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación incluyendo nombre de clínica
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'clinic_name' => 'required|string|max:255', // nuevo campo para la clínica
            'clinic_address' => 'nullable|string|max:255',
            'clinic_phone' => 'nullable|string|max:50',
        ]);

        // Crear la clínica
        $clinic = Clinic::create([
            'name' => $request->clinic_name,
            'address' => $request->clinic_address,
            'phone' => $request->clinic_phone,
        ]);

        // Crear el usuario y asignarle la clínica
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'clinic_id' => $clinic->id,

        ]);

        // Asignar rol por defecto
        $user->assignRole(Role::where('name', 'user')->first());

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
