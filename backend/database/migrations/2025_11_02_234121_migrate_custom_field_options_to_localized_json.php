<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MigrateCustomFieldOptionsToLocalizedJson extends Migration
{
    public function up()
    {
        // Make sure column type can hold JSON/text
        Schema::table('custom_fields', function (Blueprint $table) {
            $table->text('options')->nullable()->change();
        });

        // Convert old CSV or JSON-of-strings to JSON-of-objects {en,ar}
        $fields = DB::table('custom_fields')->select('id','options')->get();

        foreach ($fields as $f) {
            $opts = $f->options;

            if (is_null($opts) || $opts === '') {
                continue;
            }

            // Try decode JSON
            $decoded = json_decode($opts, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                // If already an array of objects with 'en' keys, keep as is
                $isLocalized = count($decoded) > 0 && is_array($decoded[0]) && array_key_exists('en', $decoded[0]);
                if ($isLocalized) {
                    continue; // already localized
                }

                // else decoded is array of strings => convert
                $new = array_map(function($v){
                    return ['en' => (string)$v, 'ar' => ''];
                }, $decoded);
            } else {
                // Assume CSV: "Small,Medium,Large"
                $parts = array_filter(array_map('trim', explode(',', $opts)));
                $new = array_map(function($v){ return ['en' => (string)$v, 'ar' => '']; }, $parts);
            }

            DB::table('custom_fields')->where('id', $f->id)->update(['options' => json_encode(array_values($new))]);
        }
    }

    public function down()
    {
        // We won't convert back automatically. Optionally, you could convert to CSV of en values.
        Schema::table('custom_fields', function (Blueprint $table) {
            // keep as text (no change)
        });
    }
}
