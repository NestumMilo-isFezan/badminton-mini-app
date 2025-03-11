<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Collection of Lee Chong Wei quotes
     *
     * @return array
     */
    protected function getLeeChongWeiQuotes(): array
    {
        return [
            "When you lose, you get up, you make it better, you try again." => "Lee Chong Wei",
            "Defeat is not the worst of failures. Not to have tried is the true failure." => "Lee Chong Wei",
            "The more you practice, the more confidence you get." => "Lee Chong Wei",
            "I just try my best in every match. Win or lose, I just accept the result." => "Lee Chong Wei",
            "Success is not final, failure is not fatal: it is the courage to continue that counts." => "Lee Chong Wei",
            "Every time I lose, I learn from my mistakes and I come back stronger." => "Lee Chong Wei",
            "In badminton, you need power, speed, endurance, and mental strength." => "Lee Chong Wei",
            "The key to success is not giving up, even when nobody else believes in you." => "Lee Chong Wei",
            "Hard work beats talent when talent doesn't work hard." => "Lee Chong Wei",
            "Champions keep playing until they get it right." => "Lee Chong Wei",
        ];
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $quotes = $this->getLeeChongWeiQuotes();
        $message = array_rand($quotes);
        $author = $quotes[$message];

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => [
                'message' => $message,
                'author' => $author
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
