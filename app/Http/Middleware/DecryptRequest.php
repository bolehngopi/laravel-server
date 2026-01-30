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
        // Get the raw JSON body content (encrypted string)
        $content = $request->getContent();

        if (!empty($content)) {
            // Remove surrounding quotes if the encrypted string is JSON-encoded
            $encryptedString = json_decode($content);

            // If json_decode returns null or non-string, try using content directly
            if (!is_string($encryptedString)) {
                $encryptedString = $content;
            }

            try {
                $json = Crypt::decryptString($encryptedString);
                $data = json_decode($json, true);

                if (!is_array($data)) {
                    return response()->json([
                        'message' => 'Invalid decrypted payload'
                    ], 400);
                }

                // Replace request data with decrypted data
                $request->replace($data);
            } catch (\Exception $e) {
                Log::error('Decryption failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to decrypt request'
                ], 400);
            }
        }

        return $next($request);
    }
}
