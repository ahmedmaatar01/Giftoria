<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('image_path');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_images');
    }
};