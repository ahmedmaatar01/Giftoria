<?php

return [
    'merchant_id' => env('SADAD_MERCHANT_ID'),
    'mode' => env('SADAD_MODE', 'test'),
    'secret_key' => env('SADAD_MODE') === 'live'
        ? env('SADAD_SECRET_KEY_LIVE')
        : env('SADAD_SECRET_KEY_TEST'),
    'payment_url' => env('SADAD_PAYMENT_URL'),
];
