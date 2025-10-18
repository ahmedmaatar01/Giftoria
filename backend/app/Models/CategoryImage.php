<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoryImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'image_path', 'is_featured'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}