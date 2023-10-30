<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Api\teamController;
use App\Http\Controllers\Api\eventController;
use App\Http\Controllers\Api\eventParticipantsController;


class userController extends Controller
{
    public function userslist()
    {
        $users = User::all();

        if ($users->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $users
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }



    public function signup(Request $request)
    {
        $email = $request->input('email');
        $phone = $request->input('phone');

        $existingEmail = User::where('email', $email)->first();
        $existingPhone = User::where('phone', $phone)->first();

        if ($existingEmail) {
            return response()->json([
                'status' => 409,
                'message' => 'User with this email already exists!'
            ]);
        } else if ($existingPhone) {
            return response()->json([
                'status' => 409,
                'message' => 'User with this phone already exists!'
            ]);
        }

        $user = new User();
        $user->name = $request->input('name');
        $user->email = $email;
        $user->phone = $phone;
        $user->address = $request->input('address');
        $user->password = Hash::make($request->input('password'));

        $user->save();

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully!',
            'user' => $user,
        ]);
    }




    // public function login(Request $request)
    // {
    //     $email = $request->input('email');
    //     $pass = $request->input('password');
    //     // Retrieve the user from the database using the provided email
    //     $user = User::where('email', $email)->first();
    //     if (!$user) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'User not found',
    //         ], 404);
    //     }
    //     // Verify the password using Hash::check()
    //     if (Hash::check($pass, $user->password)) {
    //         // Password is correct
    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Login successful',
    //             'user' => $user,
    //         ], 200);
    //     } else {
    //         // Password is incorrect
    //         return response()->json([
    //             'status' => 401,
    //             'message' => 'Invalid credentials',
    //         ], 401);
    //     }
    // }


    public function login(Request $request)
    {
        $email = $request->input('email');
        $pass = $request->input('password');


        if (strpos($email, '@') === false) {
            // If the "@" symbol is not present, assume the entered input is a username
            $user = User::where('email', 'LIKE', $email . '@%')->first();
            if ($user) {
                $email = $user->email;
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid credentials',
                ]);
            }
        } else {
            $email = $email;
        }


        if (Auth::attempt(['email' => $email, 'password' => $pass])) {

            $user = Auth::user();

            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid credentials',
            ]);
        }
    }


    public function updateProfile(Request $request)
    {
        $email = $request->input('email');
        // $password = $request->input('password');

        $user = User::where('email', $email)->first();
        // if (!Hash::check($request->input('password'), $user->password)) {
        //     return response()->json([
        //         'status' => 401, // Unauthorized
        //         'message' => 'Invalid password',
        //     ]);
        // }
        $updated = User::where('email', $email)->update([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'password' => Hash::make($request->input('newPass')),
        ]);

        if ($updated) {
            $user = User::where('email', $email)->first();

            return response()->json([
                'status' => 200,
                'message' => 'Profile updated successfully',
                'user' => $user,
            ], 200);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Profile update failed',
            ], 400);
        }
    }
}
