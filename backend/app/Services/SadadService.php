<?php

namespace App\Services;

class SadadService
{
    /**
     * Generate SADAD signature
     */
    public static function generateSignature(array $params, string $secret)
    {
        // ❌ Remove productdetail fields (array fields)
        $filtered = array_filter(
            $params,
            fn ($key) => !str_starts_with($key, 'productdetail')
                && $key !== 'signature',
            ARRAY_FILTER_USE_KEY
        );

        // ✅ Sort keys alphabetically
        ksort($filtered);

        // ✅ Build signature string
        $string = $secret;
        foreach ($filtered as $value) {
            $string .= $value;
        }

        // ✅ SHA256 hash
        return hash('sha256', $string);
    }

    /**
     * Verify SADAD signature (callback & webhook)
     */
    public static function verifySignature(array $params, string $secret): bool
    {
        if (!isset($params['signature'])) {
            return false;
        }

        $receivedSignature = $params['signature'];
        unset($params['signature']);

        $generated = self::generateSignature($params, $secret);

        return hash_equals($generated, $receivedSignature);
    }

}