<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareMenus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        Inertia::share('menus', function () use ($user) {
            if (!$user) {
                return [];
            }

            // Obtenemos todos los menús ordenados
            $menus = Menu::orderBy('order')->get();
            $indexed = $menus->keyBy('id');

            // Función recursiva para construir el árbol
            $buildTree = function ($parentId = null) use (&$buildTree, $indexed, $user) {
                return $indexed
                    ->filter(function ($menu) use ($parentId, $user) {
                        return $menu->parent_id === $parentId
                            && (!$menu->permission_name || $user->can($menu->permission_name));
                    })
                    ->map(function ($menu) use (&$buildTree, $user) {
                        // 🚨 Excepción: si es doctor, cambiar rutas específicas
                        if ($user->hasRole('doctor')) {
                            if ($menu->route === '/users') {
                                $menu->route = '/doctor/users';
                            } elseif ($menu->route === '/roles') {
                                $menu->route = '/doctor/roles';
                            }
                        }

                        // Construimos hijos
                        $menu->children = $buildTree($menu->id)->values();
                        return $menu;
                    })
                    ->filter(fn($menu) => $menu->route || $menu->children->isNotEmpty())
                    ->values();
            };

            return $buildTree();
        });

        return $next($request);
    }
}
