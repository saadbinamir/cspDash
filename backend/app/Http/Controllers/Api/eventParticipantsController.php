<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\event;
use Illuminate\Http\Request;
use App\Models\event_participant;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\user_credit_hour;

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



    public function addEventParticipant(Request $request)
    {
        $unique_id = $request->input('unique_id');
        $eventTitle = $request->input('event_title');
        $userEmail = $request->input('user_email');

        // Find the team, event, and user
        $team = Team::where('unique_id', $unique_id)->first();
        $event = Event::where('title', $eventTitle)->first();
        $user = User::where('email', $userEmail)->first();

        // Check if the team exists
        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Check if the event exists
        if (!$event) {
            return response()->json([
                'status' => 404,
                'message' => 'Event not found.'
            ]);
        }

        // Check if the user exists
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ]);
        }

        // Check if the user is already a participant in the event
        $existingParticipant = event_participant::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingParticipant) {
            return response()->json([
                'status' => 400,
                'message' => 'User is already a participant in this event.'
            ]);
        }

        // Create a new event participant
        event_participant::create([
            'team_id' => $team->id,
            'event_id' => $event->id,
            'user_id' => $user->id,
            'attendance_status' => true, // Set the attendance status as needed
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Event participant added successfully.'
        ]);
    }
    public function removeEventParticipant(Request $request)
    {
        $uniqueId = $request->input('unique_id');
        $eventTitle = $request->input('event_title');
        $userEmail = $request->input('user_email');

        // Find the team, event, and user
        $team = Team::where('unique_id', $uniqueId)->first();
        $event = Event::where('title', $eventTitle)->first();
        $user = User::where('email', $userEmail)->first();

        // Check if the team exists
        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Check if the event exists
        if (!$event) {
            return response()->json([
                'status' => 404,
                'message' => 'Event not found.'
            ]);
        }

        // Check if the user exists
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ]);
        }

        // Find and delete the event participant
        $eventParticipant = event_participant::where('team_id', $team->id)
            ->where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$eventParticipant) {
            return response()->json([
                'status' => 404,
                'message' => 'Event participant not found.'
            ]);
        }

        $eventParticipant->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Event participant removed successfully.'
        ]);
    }



    public function getEventsForUserInTeam(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');
        $userEmail = $request->input('user_email');

        // Find the team based on the unique_id
        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Find the user based on the email
        $user = User::where('email', $userEmail)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ]);
        }

        // Retrieve all events in the specified team that the user has participated in
        $events = Event::where('events.team_id', $team->id)
            ->join('event_participants', 'events.id', '=', 'event_participants.event_id')
            ->where('event_participants.user_id', $user->id)
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Events in team participated by the user retrieved successfully.',
            'events' => $events
        ]);
    }








    public function markAttendance(Request $request)
    {
        $eventTitle = $request->input('event_title');
        $studentEmails = $request->input('user_email');
        $team_id = $request->input('team_id');

        // Find the event by title
        $event = Event::where('title', $eventTitle)->first();
        $team = Team::where('unique_id', $team_id)->first();

        if (!$event) {
            return response()->json([
                'status' => 404,
                'message' => 'Event not found'
            ]);
        }
        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'team not found'
            ]);
        }

        // Get all participants for the event
        $participants = event_participant::where('event_id', $event->id)
            ->where('team_id', $team->id)
            ->get();

        // Loop through all participants
        foreach ($participants as $participant) {
            // Check if the participant's email is in the array
            $email = User::find($participant->user_id)->email;
            $isAbsent = in_array($email, $studentEmails);
            $participant->attendance_status = !$isAbsent;
            $participant->save();

            // Find the user_credit_hour record or create a new one if it doesn't exist
            $creditHour = user_credit_hour::updateOrCreate(
                [
                    'user_id' => $participant->user_id,
                    'event_id' => $event->id,
                    'team_id' => $team->id,
                ],
                ['credit_hours' => $isAbsent ? 0 : $event->credit_hours]
            );
        }

        return response()->json([
            'status' => 200,
            'message' => 'Attendance Marked'
        ]);
    }





    // public function getEventsForUser(Request $request)
    // {
    //     $userEmail = $request->input('user_email'); // Replace with how you pass the user's email

    //     // Find the user based on the email
    //     $user = User::where('email', $userEmail)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'User not found.'
    //         ]);
    //     }

    //     // Retrieve all events that the user has participated in
    //     $events = Event::join('event_participants', 'events.id', '=', 'event_participants.event_id')
    //         ->where('event_participants.user_id', $user->id)
    //         ->select('events.title as event_title', 'events.date as event_date', 'events.organization_name as event_organization', 'events.location as event_location', 'events.credit_hours as event_credit_hours', 'event_participants.attendance_status as attendance_status', 'events.comments as event_comments')
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'message' => 'Events participated by the user retrieved successfully.',
    //         'events' => $events
    //     ]);
    // }

    public function getEventsForUser(Request $request)
    {
        $userEmail = $request->input('user_email');

        $user = User::where('email', $userEmail)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ]);
        }

        $events = Event::join('event_participants', 'events.id', '=', 'event_participants.event_id')
            ->join('teams', 'events.team_id', '=', 'teams.id')
            ->where('event_participants.user_id', $user->id)
            ->select(
                'events.title as event_title',
                'events.date as event_date',
                'events.organization_name as event_organization',
                'events.location as event_location',
                'events.credit_hours as event_credit_hours',
                'event_participants.attendance_status as attendance_status',
                'events.comments as event_comments',
                'teams.team_name as team_name',
                'teams.unique_id as team_unique_id'
            )
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Events retrieved successfully.',
            'events' => $events
        ]);
    }
}
