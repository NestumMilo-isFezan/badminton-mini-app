<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'roles' => 'required|in:player,umpire',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::transaction(function () use ($user) {
            $user = User::create([
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
                'roles' => $user['roles'],
                'verified' => false,
            ]);

            $address = Address::create([
                'address_1' => "",
                'address_2' => "",
                'city' => "",
                'state' => "",
                'zip' => "",
                'country' => "",
            ]);

            Profile::create([
                'user_id' => $user->id,
                'phone' => "",
                'avatar' => "",
                'gender' => "",
                'address_id' => $address->id,
            ]);

            switch ($user['roles']) {
                case 'player':
                    $user->player()->create([
                        'verified' => false,
                        'wins' => 0,
                        'losses' => 0,
                        'matches' => 0,
                        'win_rate' => 0,
                    ]);
                    break;
                case 'umpire':
                    $user->umpire()->create([
                        'verified' => false,
                    ]);
                    break;
            }
        });

        event(new Registered($user));

        Auth::login($user);

        return to_route('home');
    }
}
