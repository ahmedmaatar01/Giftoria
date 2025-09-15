<?php
// 4. custom_fields table
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('custom_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['text', 'number', 'select', 'checkbox', 'file']);
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('affects_price')->default(false);
            $table->enum('price_type', ['fixed', 'percentage'])->nullable();
            $table->decimal('price_value', 10, 2)->nullable();
            $table->timestamps();
            $table->index('category_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('custom_fields');
    }
};
