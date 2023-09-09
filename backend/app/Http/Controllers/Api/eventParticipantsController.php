<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\event;
use Illuminate\Http\Request;
use App\Models\event_participant;
use App\Http\Controllers\Controller;
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
        $eventTitle = $request->input('event_title');
        $userEmail = $request->input('user_email');

        $event = event::where('title', $eventTitle)->first();
        $user = User::where('email', $userEmail)->first();

        if ($event && $user) {
            // Create a new event participant
            event_participant::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'attendance_status' => true, // Set the attendance status as needed
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Event participant added successfully.',
                'event_id' => $event->id,
                'user_email' => $user->email,
            ], 201);
        }

        return response()->json(['message' => 'Event participant not added.'], 400);
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