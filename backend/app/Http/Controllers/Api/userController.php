<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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
}
