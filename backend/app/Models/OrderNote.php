<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'command_id',
        'user_id',
        'admin_id',
        'note_type',
        'content',
        'is_visible_to_customer',
    ];

    protected $casts = [
        'is_visible_to_customer' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the command that owns the note.
     */
    public function command()
    {
        return $this->belongsTo(Command::class);
    }

    /**
     * Get the user who created the note (if customer note).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who created the note (if admin note).
     * Since we're using User model with role='admin', admin_id references users table
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Scope to get only customer notes.
     */
    public function scopeCustomer($query)
    {
        return $query->where('note_type', 'customer');
    }

    /**
     * Scope to get only admin notes.
     */
    public function scopeAdmin($query)
    {
        return $query->where('note_type', 'admin');
    }

    /**
     * Scope to get only system notes.
     */
    public function scopeSystem($query)
    {
        return $query->where('note_type', 'system');
    }

    /**
     * Scope to get only notes visible to customer.
     */
    public function scopeVisibleToCustomer($query)
    {
        return $query->where('is_visible_to_customer', true);
    }
}