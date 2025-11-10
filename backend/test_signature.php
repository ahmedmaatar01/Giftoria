<?php

// Test signature processing logic
require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Str;

function processSignature($signature)
{
    if (empty($signature)) {
        return ['signature' => null, 'type' => null];
    }

    // Check if it's a base64 image (drawn signature)
    if (Str::startsWith($signature, 'data:image')) {
        echo "✅ Detected as base64 image\n";
        return ['signature' => 'signatures/test.png', 'type' => 'image'];
    }
    
    // It's a text signature, return as-is
    echo "✅ Detected as text\n";
    return ['signature' => $signature, 'type' => 'text'];
}

// Test cases
echo "Test 1: Text signature\n";
$result1 = processSignature("John Doe");
print_r($result1);

echo "\nTest 2: Base64 image signature\n";
$result2 = processSignature("data:image/png;base64,iVBORw0KGgoAAAANS...");
print_r($result2);

echo "\nTest 3: Empty signature\n";
$result3 = processSignature("");
print_r($result3);

echo "\nTest 4: Null signature\n";
$result4 = processSignature(null);
print_r($result4);
