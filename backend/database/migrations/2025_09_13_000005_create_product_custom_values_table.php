<?php
// 5. product_custom_values table
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_custom_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('custom_field_id')->constrained('custom_fields')->onDelete('cascade');
            $table->text('value');
            $table->decimal('extra_price', 10, 2)->default(0);
            $table->timestamps();
            $table->index(['product_id', 'custom_field_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('product_custom_values');
    }
};
