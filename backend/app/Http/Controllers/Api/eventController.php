<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\event_participant;
use App\Models\team_members;
use App\Models\User;
use App\Models\user_credit_hour;

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

    // public function createEvent(Request $request)
    // {
    //     $eventTitle = $request->input('title');
    //     $teamUniqueId = $request->input('team_unique_id');
    //     $coordinatorEmail = $request->input('coordinator_email');

    //     // Check if the coordinator's email exists in the team's members
    //     $isCoordinatorInTeam = User::join('team_members', 'users.id', '=', 'team_members.user_id')
    //         ->join('teams', 'team_members.team_id', '=', 'teams.id')
    //         ->where('teams.unique_id', $teamUniqueId)
    //         ->where('users.email', $coordinatorEmail)
    //         ->exists();

    //     if (!$isCoordinatorInTeam) {
    //         return response()->json([
    //             'status' => 400,
    //             'message' => 'Coordinator is not part of the team.'
    //         ]);
    //     }

    //     // Check if an event with the same title and team ID already exists
    //     $existingEvent = Event::where('title', $eventTitle)
    //         ->where('team_id', function ($query) use ($teamUniqueId) {
    //             $query->select('id')
    //                 ->from('teams')
    //                 ->where('unique_id', $teamUniqueId);
    //         })
    //         ->first();

    //     if ($existingEvent) {
    //         return response()->json([
    //             'status' => 400,
    //             'message' => 'Event with the same title already exists'
    //         ]);
    //     }

    //     // If no existing event found and the coordinator is in the team, create a new event
    //     $event = new Event();
    //     $event->title = $eventTitle;
    //     $event->date = $request->input('date');
    //     $event->organization_name = $request->input('organization_name');
    //     $event->location = $request->input('location');
    //     $event->credit_hours = $request->input('credit_hours');
    //     $event->coordinator_email = $coordinatorEmail; // Set the coordinator's email
    //     $comments = $request->input('comments');

    //     // Find the team ID based on the unique_id
    //     $team = Team::where('unique_id', $teamUniqueId)->first();
    //     if (!$team) {
    //         // Handle the case where the team with the given unique_id doesn't exist
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'Team not found.'
    //         ]);
    //     }

    //     $event->team_id = $team->id;
    //     $event->comments = $comments;

    //     // Save the event
    //     $event->save();

    //     return response()->json([
    //         'status' => 201,
    //         'message' => 'Event created successfully.',
    //         'event' => $event
    //     ]);
    // }







    public function createEvent(Request $request)
    {
        $eventTitle = $request->input('title');
        $teamUniqueId = $request->input('team_unique_id');
        $coordinatorEmail = $request->input('coordinator_email');

        // Check if the coordinator's email exists in the team's members
        $isCoordinatorInTeam = User::join('team_members', 'users.id', '=', 'team_members.user_id')
            ->join('teams', 'team_members.team_id', '=', 'teams.id')
            ->where('teams.unique_id', $teamUniqueId)
            ->where('users.email', $coordinatorEmail)
            ->exists();

        if (!$isCoordinatorInTeam) {
            return response()->json([
                'status' => 400,
                'message' => 'Coordinator is not part of the team.'
            ]);
        }

        // Find the team ID based on the unique_id
        $team = Team::where('unique_id', $teamUniqueId)->first();
        if (!$team) {
            // Handle the case where the team with the given unique_id doesn't exist
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Use updateOrCreate to create or update the event
        $event = Event::updateOrCreate(
            ['title' => $eventTitle, 'team_id' => $team->id],
            [
                'date' => $request->input('date'),
                'organization_name' => $request->input('organization_name'),
                'location' => $request->input('location'),
                'credit_hours' => $request->input('credit_hours'),
                'coordinator_email' => $coordinatorEmail,
                'comments' => $request->input('comments')
            ]
        );

        $message = $event->wasRecentlyCreated ? 'Event created successfully.' : 'Event updated successfully.';

        return response()->json([
            'status' => 201,
            'message' => $message,
            'event' => $event
        ]);
    }


    public function deleteEvent(Request $request)
    {
        $eventTitle = $request->input('event_title');
        $teamUniqueId = $request->input('team_unique_id');

        // Find the team ID based on the unique_id
        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Find the event by its title and team ID
        $event = Event::where('title', $eventTitle)
            ->where('team_id', $team->id)
            ->first();

        if (!$event) {
            return response()->json([
                'status' => 404,
                'message' => 'Event not found.'
            ]);
        }

        $credits = user_credit_hour::where('event_id', $event->id)
            ->where('team_id', $team->id)
            ->get();

        foreach ($credits as $credit) {
            $credit->delete();
        }
        // Find the event participants associated with the event
        $eventParticipants = event_participant::where('event_id', $event->id)->get();

        // Delete each event participant
        foreach ($eventParticipants as $participant) {
            $participant->delete();
        }

        // Delete the event
        $event->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Event and its participants deleted successfully.'
        ]);
    }



    public function getUnenrolledEvents(Request $request)
    {
        $teamUniqueId = $request->input('unique_id');
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

        // Retrieve events in the specified team that the user is not enrolled in
        $events = Event::where('team_id', $team->id)
            ->whereNotIn('id', function ($query) use ($user) {
                $query->select('event_id')
                    ->from('event_participants')
                    ->where('user_id', $user->id);
            })
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Events in team not enrolled by the user retrieved successfully.',
            'events' => $events
        ]);
    }

    public function getEventsInTeam(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');

        // Find the team based on the unique_id
        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ], 404);
        }

        // Retrieve all events in the specified team
        $events = Event::where('team_id', $team->id)->get();

        return response()->json([
            'status' => 200,
            'message' => 'Events in team retrieved successfully.',
            'events' => $events
        ], 200);
    }


    // public function getEventParticipants(Request $request)
    // {
    //     $teamUniqueId = $request->input('team_unique_id');
    //     $eventTitle = $request->input('event_title');

    //     // Find the team based on the unique_id
    //     $team = Team::where('unique_id', $teamUniqueId)->first();

    //     if (!$team) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'Team not found.'
    //         ]);
    //     }

    //     // Retrieve the list of members participating in the event
    //     $participants = event_participant::join('events', 'event_participants.event_id', '=', 'events.id')
    //         ->join('users', 'event_participants.user_id', '=', 'users.id')
    //         ->where('events.team_id', $team->id)
    //         ->where('events.title', $eventTitle)
    //         ->select('users.*')
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'message' => 'List of event participants retrieved successfully.',
    //         'participants' => $participants
    //     ]);
    // }



    public function getEventParticipants(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');
        $eventTitle = $request->input('event_title');

        // Find the team based on the unique_id
        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Retrieve the list of members participating in the event with their attendance status
        $participants = event_participant::join('events', 'event_participants.event_id', '=', 'events.id')
            ->join('users', 'event_participants.user_id', '=', 'users.id')
            ->where('events.team_id', $team->id)
            ->where('events.title', $eventTitle)
            ->select('users.*', 'event_participants.attendance_status')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'List of event participants retrieved successfully.',
            'participants' => $participants
        ]);
    }

    public function getCoordinatorEvent(Request $request)
    {
        $userEmail = $request->input('user_email');
        $teamUniqueId = $request->input('team_unique_id');

        // Find the user based on the email
        $user = User::where('email', $userEmail)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ]);
        }

        // Retrieve all events in the specified team where the user is the coordinator
        $events = Event::where('team_id', function ($query) use ($teamUniqueId) {
            $query->select('id')
                ->from('teams')
                ->where('unique_id', $teamUniqueId);
        })
            ->where('coordinator_email', $user->email)
            ->get();

        if ($events->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No events found where the user is the coordinator in the specified team.'
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Coordinator events retrieved successfully.',
            'events' => $events
        ]);
    }
}
