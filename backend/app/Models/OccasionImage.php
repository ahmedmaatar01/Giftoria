<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OccasionImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'occasion_id', 'image_path', 'is_featured'
    ];

    public function occasion()
    {
        return $this->belongsTo(Occasion::class);
    }
}
