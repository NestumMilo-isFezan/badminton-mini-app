<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyUserController extends Controller
{
    public function verify(User $user)
    {
        $user->forceFill([
            'verified' => true,
            'email_verified_at' => now()  // Also update email verification
        ])->save();

        return back();
    }
}
