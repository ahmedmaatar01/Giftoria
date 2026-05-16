<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'customer_first_name',
        'customer_last_name',
        'customer_email',
        'customer_phone',
        'total',
        'status',
        'shipping_address',
        'billing_address',
        'placed_at',
        'desired_delivery_at',
        'payment_method',
        'source',
        'description',
        'has_gift_card',
        'gift_card_template_id',
        'gift_card_message',
        'gift_card_signature',
        'gift_card_signature_type',
        'gift_card_is_custom',
        'has_tag',
        'tag_template_id'
    ];

    protected $casts = [
        'placed_at' => 'datetime',
        'desired_delivery_at' => 'datetime',
    ];

    protected $appends = ['gift_card_signature_url'];

    /**
     * Get the full URL for the signature (if it's an image)
     */
    public function getGiftCardSignatureUrlAttribute()
    {
        if (!$this->gift_card_signature) {
            return null;
        }

        // If it's a file path (image), return the full URL
        if ($this->gift_card_signature_type === 'image' || str_starts_with($this->gift_card_signature, 'signatures/')) {
            return url('storage/' . $this->gift_card_signature);
        }

        // Otherwise it's text, return as-is
        return $this->gift_card_signature;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function commandProducts()
    {
        return $this->hasMany(CommandProduct::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'command_products')
            ->withPivot('quantity', 'price_at_order_time', 'custom_fields', 'unit_price', 'line_total')
            ->withTimestamps();
    }

    /**
     * Get the gift card template for this command.
     */
    public function giftCardTemplate()
    {
        return $this->belongsTo(\App\Models\GiftCard::class, 'gift_card_template_id');
    }

    /**
     * Get the tag template for this command.
     */
    public function tagTemplate()
    {
        return $this->belongsTo(\App\Models\Tag::class, 'tag_template_id');
    }

    /**
     * Get all notes for this command.
     */
    public function notes()
    {
        return $this->hasMany(OrderNote::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get customer notes only.
     */
    public function customerNotes()
    {
        return $this->hasMany(OrderNote::class)
            ->where('note_type', 'customer')
            ->where('is_visible_to_customer', true)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get admin notes only.
     */
    public function adminNotes()
    {
        return $this->hasMany(OrderNote::class)
            ->where('note_type', 'admin')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get status history for this command.
     */
    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the latest status change.
     */
    public function latestStatusChange()
    {
        return $this->hasOne(OrderStatusHistory::class)->latestOfMany();
    }

    /**
     * Update status and create history record.
     */
    public function updateStatus($newStatus, $adminId = null, $notes = null)
    {
        $oldStatus = $this->status;
        
        // Update the status
        $this->update(['status' => $newStatus]);
        
        // Create history record
        OrderStatusHistory::createStatusChange(
            $this->id,
            $oldStatus,
            $newStatus,
            $adminId,
            $notes
        );

        return $this;
    }
}
