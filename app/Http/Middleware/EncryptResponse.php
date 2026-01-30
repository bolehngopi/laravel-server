<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Crypt;

class EncryptResponse
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if ($response->getContent()) {
            return response()->json([
                'payload' => Crypt::encryptString($response->getContent())
            ]);
        }

        return $response;
    }
}
