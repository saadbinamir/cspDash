<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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


    public function createEvent(Request $request)
    {
        $event = new Event();
        $event->title = $request->input('title');
        $event->date = $request->input('date');
        $event->organization_name = $request->input('organization_name');
        $event->location = $request->input('location');
        $event->credit_hours = $request->input('credit_hours');
        $event->coordinator_email = $request->input('coordinator_email');
        $comments = $request->input('comments');
        $team_unique_id = $request->input('team_unique_id');

        // Find the team ID based on the unique_id
        $team = Team::where('unique_id', $team_unique_id)->first();
        if (!$team) {
            // Handle the case where the team with the given unique_id doesn't exist
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ], 404);
        }

        $event->team_id = $team->id;
        $event->comments = $comments;

        // Save the event
        $event->save();

        return response()->json([
            'status' => 201,
            'message' => 'Event created successfully.',
            'event' => $event
        ], 201);
    }
}
