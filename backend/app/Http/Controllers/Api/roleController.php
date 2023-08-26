<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\role;
use Illuminate\Http\Request;

class roleController extends Controller
{
    public function roleNames()
    {
        $roles = role::all();

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
