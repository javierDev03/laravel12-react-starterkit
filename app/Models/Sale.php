<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'user_id', 'branch_id', 'total', 'discount', 'tax', 'status', 'payment_method'
    ];

    protected $casts = [
        'total' => 'float',
        'discount' => 'float',
        'tax' => 'float',
    ];


    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function calculateTotal(): float
    {
        $itemsTotal = $this->items->sum(fn($item) => $item->subtotal);
        return $itemsTotal - $this->discount + $this->tax;
    }
}
