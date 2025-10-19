<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;


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

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('product_images')
            ->useDisk('public')
            ->singleFile();
    }
}
