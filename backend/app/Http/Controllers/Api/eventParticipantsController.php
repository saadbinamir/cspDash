<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\event_participant;
use Illuminate\Http\Request;

class eventParticipantsController extends Controller
{
    public function participanstList()
    {
        $participants = event_participant::all();

        if ($participants->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $participants
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
