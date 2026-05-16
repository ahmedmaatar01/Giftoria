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
        Schema::table('commands', function (Blueprint $table) {
            $table->boolean('has_tag')->default(false)->after('gift_card_is_custom');
            $table->unsignedBigInteger('tag_template_id')->nullable()->after('has_tag');

            $table->foreign('tag_template_id')
                ->references('id')
                ->on('tags')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commands', function (Blueprint $table) {
            $table->dropForeign(['tag_template_id']);
            $table->dropColumn(['has_tag', 'tag_template_id']);
        });
    }
};
