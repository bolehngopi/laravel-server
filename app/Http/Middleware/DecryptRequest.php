<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DecryptRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->filled('payload')) {

            $json = Crypt::decryptString($request->get('payload'));

            $data = json_decode($json, true);

            if (!is_array($data)) {
                return response()->json([
                    'message' => 'Invalid decrypted payload'
                ], 400);
            }

            // Merge and remove the payload from the request
            $request->merge($data);
            $request->request->remove('payload');
        }

        return $next($request);
    }
}
