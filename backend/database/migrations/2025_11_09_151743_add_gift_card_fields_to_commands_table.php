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
            // Gift card related fields
            $table->boolean('has_gift_card')->default(false)->after('description');
            $table->unsignedBigInteger('gift_card_template_id')->nullable()->after('has_gift_card');
            $table->text('gift_card_message')->nullable()->after('gift_card_template_id');
            $table->string('gift_card_signature')->nullable()->after('gift_card_message');
            $table->boolean('gift_card_is_custom')->default(false)->after('gift_card_signature');

            // Foreign key constraint for gift card template
            $table->foreign('gift_card_template_id')->references('id')->on('gift_cards')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commands', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['gift_card_template_id']);

            // Drop columns
            $table->dropColumn([
                'has_gift_card',
                'gift_card_template_id',
                'gift_card_message',
                'gift_card_signature',
                'gift_card_is_custom'
            ]);
        });
    }
};
