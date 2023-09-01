<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

        // Check if the user with the provided email or phone already exists
        $existingEmail = User::where('email', $email)->first();
        $existingPhone = User::where('phone', $phone)->first();

        if ($existingEmail) {
            return response()->json([
                'status' => 409,
                'message' => 'User with this email already exists!'
            ], 409);
        } else if ($existingPhone) {
            return response()->json([
                'status' => 409,
                'message' => 'User with this phone already exists!'
            ], 409);
        }


        // Create a new user
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $email;
        $user->phone = $phone;
        $user->address = $request->input('address');
        // $user->password = $request->input('password');
        $user->password = Hash::make($request->input('password'));

        $user->save();

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully!',
            'user' => $user,
        ], 201);
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

        // Attempt to authenticate the user
        if (Auth::attempt(['email' => $email, 'password' => $pass])) {

            $user = Auth::user();

            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'user' => $user,
            ], 200);
        } else {
            // Authentication failed
            return response()->json([
                'status' => 401,
                'message' => 'Invalid credentials',
            ], 401);
        }
    }


    public function updateProfile(Request $request)
    {
        $email = $request->input('email');

        // Update user's profile
        $updated = User::where('email', $email)->update([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'password' => Hash::make($request->input('password')),
        ]);

        if ($updated) {
            // Fetch the updated user record
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
