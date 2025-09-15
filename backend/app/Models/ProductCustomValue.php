<?php
// app/Models/ProductCustomValue.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductCustomValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'custom_field_id', 'value', 'extra_price'
    ];

    protected $casts = [
        'extra_price' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function customField()
    {
        return $this->belongsTo(CustomField::class);
    }
}
