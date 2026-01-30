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
            // Return encrypted string directly as JSON value
            return response()->json(Crypt::encryptString($response->getContent()));
        }

        return $response;
    }
}
