<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class teamController extends Controller
{
    public function teams()
    {
        $teams = Team::all();

        if ($teams->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $teams
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
