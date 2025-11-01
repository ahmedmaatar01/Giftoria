<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('command_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('admin_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('note_type', ['customer', 'admin', 'system'])->default('customer');
            $table->text('content');
            $table->boolean('is_visible_to_customer')->default(true);
            $table->timestamps();

            // Indexes for performance
            $table->index(['command_id', 'created_at']);
            $table->index(['command_id', 'note_type']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_notes');
    }
};