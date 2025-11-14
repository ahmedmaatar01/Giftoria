<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('gift_cards', function (Blueprint $table) {
            $table->foreignId('occasion_id')->nullable()->constrained('occasions')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('gift_cards', function (Blueprint $table) {
            $table->dropForeign(['occasion_id']);
            $table->dropColumn('occasion_id');
        });
    }

    
};
