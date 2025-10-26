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
        if (!$user) return [];

        // Si es Doctor, solo mostramos su mini-panel
        if ($user->hasRole('doctor')) {
            return [
                (object)[
                    'title' => 'Dashboard',
                    'route' => route('dashboard'),
                    'children' => [],
                ],
                (object)[
                    'title' => 'Roles',
                    'route' => route('doctor.roles.index'),
                    'children' => [],
                ],
                (object)[
                    'title' => 'Usuarios',
                    'route' => route('doctor.users.index'),
                    'children' => [],
                ],
            ];
        }

        // Para todos los demás (Admin, etc.) usamos el menú completo filtrado por permisos
        $allMenus = Menu::orderBy('order')->get();
        $indexed = $allMenus->keyBy('id');

        $buildTree = function ($parentId = null) use (&$buildTree, $indexed, $user) {
            return $indexed
                ->filter(fn($menu) =>
                    $menu->parent_id === $parentId &&
                    (!$menu->permission_name || $user->can($menu->permission_name))
                )
                ->map(function ($menu) use (&$buildTree) {
                    $menu->children = $buildTree($menu->id)->values();
                    return $menu;
                })
                ->filter(fn($menu) =>
                    $menu->route || $menu->children->isNotEmpty()
                )
                ->values();
        };

        return $buildTree();
    });

    return $next($request);
}

}
