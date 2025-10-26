<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = ['name', 'clinic_id'];
    
    protected $attributes = [
    'guard_name' => 'web',
];


    public function assignablePermissions()
    {
        if(auth()->check() && auth()->user()->hasRole('doctor')) {
            return $this->permissions()->whereIn('name', [
                'dashboard-view',
                'clients-view',
                'sales-view',
                'roles-view',
                'roles-create',
                'users-create',
            ]);
        }
        return $this->permissions();
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
