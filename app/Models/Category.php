<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Database\Eloquent\Builder;
class Category extends Model
{
    use hasFactory;

    protected $fillable = [
        'name',
        'description',
        'active',
        'clinic_id',
    ];

    
    protected static function booted()
    {
        // 🔹 Scope global para filtrar por clínica del usuario logueado
        static::addGlobalScope('clinic', function (Builder $builder) {
            $user = Auth::user();

            if ($user && ! $user->hasRole('admin')) {
                $builder->where('clinic_id', $user->clinic_id);
            }
        });

        // 🔹 Asigna automáticamente la clínica al crear
        static::creating(function ($category) {
            if (Auth::check()) {
                $category->clinic_id = Auth::user()->clinic_id;
            }
        });
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }


    // Relación con la clínica
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }


}
