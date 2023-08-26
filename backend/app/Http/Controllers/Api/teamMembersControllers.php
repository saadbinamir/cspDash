<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\team_members;
use Illuminate\Http\Request;

class teamMembersControllers extends Controller
{
    public function membersList()
    {
        $members = team_members::all();

        if ($members->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $members
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
