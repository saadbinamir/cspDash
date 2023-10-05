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
        $studentEmail = $request->input('user_email');

        // Find the event by title
        $event = Event::where('title', $eventTitle)->first();

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        // Loop through each absent student email and update attendance
        foreach ($studentEmail as $email) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Check if the user is already marked as attending the event
                $participant = event_participant::where('event_id', $event->id)
                    ->where('user_id', $user->id)
                    ->first();

                if ($participant) {
                    // Update attendance status to false for absent students
                    $participant->attendance_status = false;
                    $participant->save();

                    // Update credit hours to 0 for absent students
                    user_credit_hour::where('user_id', $user->id)
                        ->where('event_id', $event->id)
                        ->update(['credit_hours' => 0]);
                }
            }
        }

        return response()->json(['message' => 'Attendance updated for absent students']);
    }
}



// $eventTitle = $request->input('event_title');
// $studentEmail = $request->input('user_email');

// // Find the event by title
// $event = Event::where('title', $eventTitle)->first();

// if (!$event) {
//     return response()->json(['message' => 'Event not found'], 404);
// }

// // Loop through each student email and mark attendance
// foreach ($studentEmail as $email) {
//     $user = User::where('email', $email)->first();

//     if ($user) {
//         $attendanceStatus = false; // Set initial attendance status to false

//         // Check if the user is already marked as attending the event
//         $participant = event_participant::where('event_id', $event->id)
//             ->where('user_id', $user->id)
//             ->first();

//         if ($participant) {
//             // Update attendance status to true
//             $attendanceStatus = true;
//             $participant->attendance_status = true;
//             $participant->save();
//         } else {
//             // Add the user as a participant with attendance status true
//             event_participant::create([
//                 'event_id' => $event->id,
//                 'user_id' => $user->id,
//                 'attendance_status' => true,
//             ]);
//         }

//         // Update credit hours for the user
//         user_credit_hour::create([
//             'user_id' => $user->id,
//             'event_id' => $event->id,
//             'credit_hours' => $event->credit_hours,
//         ]);
//     }
// }

// return response()->json(['message' => 'Attendance marked and credit hours updated successfully']);