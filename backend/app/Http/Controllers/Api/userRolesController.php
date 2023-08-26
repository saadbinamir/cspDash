<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\user_roles;
use Illuminate\Http\Request;

class userRolesController extends Controller
{
    public function userRoles()
    {
        $roles = user_roles::all();

        if ($roles->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $roles
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
