<?php
// 2. products table
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->longText('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->string('featured_image')->nullable();
            $table->timestamps();
            $table->index('category_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
