<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $doctor = Role::firstOrCreate(['name' => 'doctor']);
        $user = Role::firstOrCreate(['name' => 'user']);

        $permissions = [
            'Dashboard' => [
                'dashboard-view',
            ],
            'Access' => [
                'access-view',
                'permission-view',
                'users-view',
                'roles-create',
                'users-create',
                'roles-view',
                'clients-view',
                'branches-view',
                'products-view',
                'stocks-view',
                'sales-view',
            ],
            'Settings' => [
                'settings-view',
                'menu-view',
                'app-settings-view',
                'backup-view',
            ],
            'Utilities' => [
                'utilities-view',
                'log-view',
                'filemanager-view',
            ],
        ];

        foreach ($permissions as $group => $perms) {
            foreach ($perms as $name) {

                $permission = Permission::firstOrCreate([
                    'name' => $name,
                    'group' => $group,
                ]);

                if (! $admin->hasPermissionTo($permission)) {
                    $admin->givePermissionTo($permission);
                }

                $doctorPermissions = [
                    'access-view',
                    'dashboard-view',
                    'clients-view',
                    'sales-view',
                    'roles-view',
                    'roles-create',
                    'users-view',
                ];

                if (in_array($name, $doctorPermissions) && ! $doctor->hasPermissionTo($permission)) {
                    $doctor->givePermissionTo($permission);
                }
            }
        }
    }
}
