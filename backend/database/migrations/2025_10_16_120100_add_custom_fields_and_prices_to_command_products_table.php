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
        Schema::table('command_products', function (Blueprint $table) {
            if (!Schema::hasColumn('command_products', 'custom_fields')) {
                $table->json('custom_fields')->nullable()->after('price_at_order_time');
            }
            if (!Schema::hasColumn('command_products', 'unit_price')) {
                $table->decimal('unit_price', 10, 2)->default(0)->after('custom_fields');
            }
            if (!Schema::hasColumn('command_products', 'line_total')) {
                $table->decimal('line_total', 10, 2)->default(0)->after('unit_price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('command_products', function (Blueprint $table) {
            if (Schema::hasColumn('command_products', 'line_total')) {
                $table->dropColumn('line_total');
            }
            if (Schema::hasColumn('command_products', 'unit_price')) {
                $table->dropColumn('unit_price');
            }
            if (Schema::hasColumn('command_products', 'custom_fields')) {
                $table->dropColumn('custom_fields');
            }
        });
    }
};
