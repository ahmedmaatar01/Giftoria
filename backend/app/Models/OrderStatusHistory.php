<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $table = 'order_status_history';

    protected $fillable = [
        'command_id',
        'old_status',
        'new_status',
        'changed_by_admin_id',
        'changed_by_system',
        'notes',
    ];

    protected $casts = [
        'changed_by_system' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the command that owns the status history.
     */
    public function command()
    {
        return $this->belongsTo(Command::class);
    }

    /**
     * Get the admin who changed the status.
     */
    public function changedBy()
    {
        return $this->belongsTo(Admin::class, 'changed_by_admin_id');
    }

    /**
     * Get the display name of who changed the status.
     */
    public function getChangedByDisplayAttribute()
    {
        if ($this->changed_by_system) {
            return 'System';
        } elseif ($this->changedBy) {
            return $this->changedBy->name ?? 'Admin';
        } else {
            return 'Unknown';
        }
    }

    /**
     * Get status display with proper formatting.
     */
    public function getStatusDisplayAttribute()
    {
        return [
            'old' => $this->formatStatus($this->old_status),
            'new' => $this->formatStatus($this->new_status),
        ];
    }

    /**
     * Format status for display.
     */
    private function formatStatus($status)
    {
        if (!$status) return null;
        
        $statusMap = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'out_for_delivery' => 'Out for Delivery',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
        ];

        return $statusMap[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }

    /**
     * Create a status change record.
     */
    public static function createStatusChange($commandId, $oldStatus, $newStatus, $adminId = null, $notes = null)
    {
        return self::create([
            'command_id' => $commandId,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by_admin_id' => $adminId,
            'changed_by_system' => is_null($adminId),
            'notes' => $notes,
        ]);
    }
}