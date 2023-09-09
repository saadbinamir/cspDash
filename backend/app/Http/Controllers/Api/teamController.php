<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\User;
use App\Models\user_roles;
use App\Models\team_members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

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
            ], 404);
        }

        // Delete associated user roles and team members
        user_roles::where('team_id', $team->id)->delete();
        team_members::where('team_id', $team->id)->delete();

        // Delete the team itself
        $team->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Team deleted successfully',
        ], 200);
    }



    public function addUserToTeam(Request $request)
    {
        $email = $request->input('email');
        $unique_id = $request->input('unique_id');

        $user = User::where('email', $email)->first();
        $team = Team::where('unique_id', $unique_id)->first();

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
                'user_teams' => $teams
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

                return response()->json([
                    'status' => 200,
                    'message' => 'User removed from the team.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'User is not a member of the team.'
                ], 400);
            }
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'User or team not found.'
            ], 404);
        }
    }
}
