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
        Schema::create('order_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('command_id')->constrained()->onDelete('cascade');
            $table->string('old_status', 50)->nullable();
            $table->string('new_status', 50);
            $table->foreignId('changed_by_admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->boolean('changed_by_system')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['command_id', 'created_at']);
            $table->index(['command_id', 'new_status']);
            $table->index(['changed_by_admin_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_history');
    }
};