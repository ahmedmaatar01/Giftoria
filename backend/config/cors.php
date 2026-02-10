<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'sadad/*',
        'payment/*',
        '*'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://giftoria.me',
        'https://www.giftoria.me',
        'https://admin.giftoria.me',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
