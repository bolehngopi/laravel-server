<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $client = new Client([
                'base_uri' => 'https://dummyjson.com/',
                'timeout' => 12,
                'connect_timeout' => 5,
            ]);

            $response = $client->get('posts');
            $payload = json_decode($response->getBody()->getContents(), true);

            return response()->json($payload, $response->getStatusCode());
        } catch (\Throwable $exception) {
            return response()->json(
                [
                    'message' => 'Failed to fetch posts. Returning fallback data.',
                    'error' => $exception->getMessage(),
                    'posts' => [
                        [
                            'id' => 1,
                            'title' => 'His mother had always taught him',
                            'body' => "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
                            'tags' => ['history', 'american', 'crime'],
                            'reactions' => [
                                'likes' => 192,
                                'dislikes' => 25,
                            ],
                            'views' => 305,
                            'userId' => 121,
                        ],
                    ],
                    'total' => 1,
                    'skip' => 0,
                    'limit' => 30,
                ],
                200
            );
        }
    }

    public function store(Request $request)
    {
        Log::info('Decrypted Request Data:');
        return $request->all(); // sudah decrypted
    }

}
