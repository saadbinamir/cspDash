<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\User;
use App\Models\user_roles;
use App\Models\team_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\announcements;
use App\Models\event;
use App\Models\event_participant;
use App\Models\user_credit_hour;

class teamController extends Controller
{
    public function showTeams()
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


    public function createTeam(Request $request)
    {
        $uniqueId = $request->input('unique_id');
        $teamName = $request->input('team_name');
        $organizerEmail = $request->input('organizerEmail');

        $user = User::where('email', $organizerEmail)->first();

        $existingTeam = Team::where('unique_id', $uniqueId)->first();

        if ($existingTeam) {
            return response()->json([
                'status' => 400,
                'message' => 'Team already exists'
            ]);
        }

        $team = new Team();
        $team->unique_id = $uniqueId;
        $team->team_name = $teamName;
        $team->organizer_id = $user->id;
        $team->save();

        $user_roles = new user_roles();
        $user_roles->user_id = $user->id;
        $user_roles->role_id = 1;
        $user_roles->team_id = $team->id;
        $user_roles->save();

        $team_members = new team_members();
        $team_members->team_id = $team->id;
        $team_members->user_id = $user->id;
        $team_members->save();


        return response()->json([
            'status' => 201,
            'message' => 'Team created successfully',
            'team' => $team,
            'role' => $user_roles,
            'teamMember' => $team_members
        ]);
    }



    public function deleteTeam(Request $request)
    {
        $uniqueId = $request->input('unique_id');
        $organizerEmail = $request->input('organizerEmail');

        $user = User::where('email', $organizerEmail)->first();

        // Find the team by unique ID and ensure the organizer matches
        $team = Team::where('unique_id', $uniqueId)
            ->where('organizer_id', $user->id)
            ->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found or unauthorized to delete',
            ]);
        }

        // Delete associated user roles and team members
        user_roles::where('team_id', $team->id)->delete();
        team_members::where('team_id', $team->id)->delete();
        event::where('team_id', $team->id)->delete();
        event_participant::where('team_id', $team->id)->delete();
        user_credit_hour::where('team_id', $team->id)->delete();

        // Delete the team itself
        $team->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Team deleted successfully',
        ]);
    }



    public function addUserToTeam(Request $request)
    {
        $email = $request->input('email');
        $unique_id = $request->input('unique_id');

        // $user = User::where('email', $email)->first();

        if (strpos($email, '@') === false) {
            // Assume the entered input is a username, so search for a user based on this pattern
            $user = User::where('email', 'LIKE', $email . '@%')->first();
        } else {
            $user = User::where('email', $email)->first();
        }

        $team = Team::where('unique_id', $unique_id)->first();
        if (!$user) {
            return response()->json([
                'status' => 400,
                'message' => 'User not found'
            ]);
        }
        if ($user && $team) {
            $existingMember = team_members::where('team_id', $team->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingMember) {
                return response()->json([
                    'status' => 400,
                    'message' => 'User is already a member of the team.'
                ]);
            }

            user_roles::create([
                'user_id' => $user->id,
                'role_id' => 3, // 3 = Member role
                'team_id' => $team->id,
            ]);

            team_members::create([
                'team_id' => $team->id,
                'user_id' => $user->id,
            ]);

            $teams = DB::table('teams')
                ->select('teams.unique_id as team_unique_id')
                ->join('team_members', 'teams.id', '=', 'team_members.team_id')
                ->join('users', 'team_members.user_id', '=', 'users.id')
                ->where('users.email', '=', $email)
                ->get();

            return response()->json([
                'status' => 201,
                'message' => 'User added to the team.',
                'user_email' => $user->email,
                'name' => $user->name
            ], 201);
        }

        return response()->json([
            'status' => 400,
            'message' => 'User not added to the team.'
        ]);
    }




    public function removeUserFromTeam(Request $request)
    {
        $email = $request->input('email');
        $unique_id = $request->input('unique_id');

        $user = User::where('email', $email)->first();
        $team = Team::where('unique_id', $unique_id)->first();

        if ($user && $team) {
            $teamMember = team_members::where('team_id', $team->id)
                ->where('user_id', $user->id)
                ->first();

            if ($teamMember) {
                $teamMember->delete();
                user_roles::where('team_id', $team->id)
                    ->where('user_id', $user->id)
                    ->delete();
                team_members::where('team_id', $team->id)
                    ->where('user_id', $user->id)
                    ->delete();
                event_participant::where('team_id', $team->id)
                    ->where('user_id', $user->id)
                    ->delete();

                return response()->json([
                    'status' => 200,
                    'message' => 'User removed from the team.'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'User is not a member of the team.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'User or team not found.'
            ]);
        }
    }









    // public function getUserTeams(Request $request)
    // {
    //     $userEmail = $request->input('user_email');

    //     // Retrieve the user
    //     $user = User::where('email', $userEmail)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'User not found'
    //         ]);
    //     }

    //     $teams = Team::select(
    //         'teams.team_name',
    //         'teams.unique_id as team_unique_id',
    //         'users.name as organizer_name',
    //         'users.email as organizer_email'
    //     )
    //         ->join('user_roles', function ($join) {
    //             $join->on('teams.id', '=', 'user_roles.team_id')
    //                 ->where('user_roles.role_id', '=', 3);
    //         })
    //         ->join('users', 'teams.organizer_id', '=', 'users.id')
    //         ->leftJoin('team_members', 'teams.id', '=', 'team_members.team_id')
    //         ->where('user_roles.user_id', $user->id)
    //         ->groupBy('teams.team_name', 'teams.unique_id', 'users.name', 'users.email')
    //         ->addSelect(DB::raw('COUNT(team_members.id) as number_of_members'))
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'teams' => $teams
    //     ]);
    // }




    // public function getMyTeams(Request $request)
    // {
    //     $userEmail = $request->input('user_email');

    //     // Retrieve the user
    //     $user = User::where('email', $userEmail)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'User not found'
    //         ]);
    //     }

    //     $teams = Team::select(
    //         'teams.team_name',
    //         'teams.unique_id as team_unique_id',
    //         'users.name as organizer_name',
    //         'users.email as organizer_email'
    //     )
    //         ->join('user_roles', function ($join) {
    //             $join->on('teams.id', '=', 'user_roles.team_id')
    //                 ->where('user_roles.role_id', '=', 1);
    //         })
    //         ->join('users', 'teams.organizer_id', '=', 'users.id')
    //         ->leftJoin('team_members', 'teams.id', '=', 'team_members.team_id')
    //         ->where('user_roles.user_id', $user->id)
    //         ->groupBy('teams.team_name', 'teams.unique_id', 'users.name', 'users.email')
    //         ->addSelect(DB::raw('COUNT(team_members.id) as number_of_members'))
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'teams' => $teams
    //     ]);
    // }


    public function getAllUserTeams(Request $request)
    {
        $userEmail = $request->input('user_email');

        // Retrieve the user
        $user = User::where('email', $userEmail)->first();

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }

        $teams = Team::select(
            'teams.team_name',
            'teams.unique_id as team_unique_id',
            'users.name as organizer_name',
            'users.email as organizer_email'
        )
            ->join('user_roles', 'teams.id', '=', 'user_roles.team_id')
            ->join('users', 'teams.organizer_id', '=', 'users.id')
            ->leftJoin('team_members', 'teams.id', '=', 'team_members.team_id')
            ->leftJoin('events', 'events.team_id', '=', 'teams.id')
            ->where('user_roles.user_id', $user->id)
            ->groupBy('teams.team_name', 'teams.unique_id', 'users.name', 'users.email')
            ->selectRaw('COUNT(DISTINCT team_members.id) as number_of_members, COUNT(DISTINCT events.id) as number_of_events')
            ->get();

        return response()->json([
            'status' => 200,
            'teams' => $teams
        ]);
    }





    public function getTeamDetails(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');

        $teamDetails = DB::table('teams')
            ->select(
                'teams.team_name as team_name',
                'teams.unique_id as team_unique_id',
                'users.name as organizer_name',
                'users.email as organizer_email',
                DB::raw('COUNT(DISTINCT events.id) as number_of_events'),
                DB::raw('COUNT(DISTINCT team_members.id) as number_of_members')
            )

            ->join('users', 'teams.organizer_id', '=', 'users.id')
            ->leftJoin('events', 'teams.id', '=', 'events.team_id')
            ->leftJoin('team_members', 'teams.id', '=', 'team_members.team_id')
            ->where('teams.unique_id', $teamUniqueId)
            ->groupBy('teams.id', 'users.id')
            ->first();

        if (!$teamDetails) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Team details retrieved successfully.',
            'team_details' => $teamDetails
        ]);
    }




    // public function updateTeamAnnouncements(Request $request)
    // {
    //     $teamUniqueId = $request->input('team_unique_id');
    //     $announcements = $request->input('announcements');

    //     // Find the team by unique ID
    //     $team = Team::where('unique_id', $teamUniqueId)->first();

    //     if (!$team) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'Team not found.'
    //         ]);
    //     }

    //     // Update the team's announcements
    //     $team->announcements = $announcements;
    //     $team->save();

    //     return response()->json([
    //         'status' => 200,
    //         'message' => 'Team announcements updated successfully.',
    //         'announcements' => $team->announcements // Optionally, you can return the updated team
    //     ]);
    // }

    public function createAnnouncement(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');
        $message = $request->input('message');

        // Find the team by unique ID
        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Create a new announcement
        $announcement = new announcements();
        $announcement->message = $message;
        $announcement->team_id = $team->id;
        $announcement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Announcement created successfully'
        ]);
    }

    public function getAnnouncementsInTeam(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');

        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Fetch announcements by team_id
        $announcements = announcements::where('team_id', $team->id)->get();

        return response()->json([
            'status' => 200,
            'announcements' => $announcements
        ]);
    }

    public function deleteAnnouncement(Request $request)
    {
        $teamUniqueId = $request->input('team_unique_id');
        $messageId = $request->input('message_id');


        $team = Team::where('unique_id', $teamUniqueId)->first();

        if (!$team) {
            return response()->json([
                'status' => 404,
                'message' => 'Team not found.'
            ]);
        }

        // Find the announcement by ID and team_id
        $announcement = announcements::where('id', $messageId)
            ->where('team_id', $team->id)
            ->first();

        if (!$announcement) {
            return response()->json([
                'status' => 404,
                'message' => 'Announcement not found for the team'
            ]);
        }

        $announcement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Announcement deleted successfully'
        ]);
    }
}
