<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'description',
        'price',
        'active',
        'clinic_id',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('product_images')
            ->useDisk('public')
            ->singleFile();
    }

    protected static function booted()
    {
        static::addGlobalScope('clinic', function (Builder $builder) {
            $user = Auth::user();

            if ($user && ! $user->hasRole('admin')) {
                $builder->where('clinic_id', $user->clinic_id);
            }
        });

        static::creating(function ($product) {
            if (Auth::check()) {
                $product->clinic_id = Auth::user()->clinic_id;
            }
        });
    }
}
