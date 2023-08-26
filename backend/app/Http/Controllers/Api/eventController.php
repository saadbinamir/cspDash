<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\event;
use Illuminate\Http\Request;

class eventController extends Controller
{
    public function eventList()
    {
        $events = event::all();

        if ($events->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $events
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
