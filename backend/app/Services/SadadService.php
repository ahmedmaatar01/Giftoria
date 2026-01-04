<?php

namespace App\Services;

class SadadService
{
    public static function generateSignature(array $data, string $secretKey): string
    {
        unset($data['checksumhash']);
        ksort($data);

        $plain = '';
        foreach ($data as $key => $value) {
            $plain .= $key . '=' . $value . '|';
        }

        return hash_hmac('sha256', rtrim($plain, '|'), $secretKey);
    }

    public static function verifySignature(array $data, string $secretKey): bool
    {
        $received = $data['checksumhash'] ?? '';
        unset($data['checksumhash']);

        return self::generateSignature($data, $secretKey) === $received;
    }
}
