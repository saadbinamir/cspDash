<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\team_members;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\user_credit_hour;
use Illuminate\Support\Facades\DB;


class teamMembersControllers extends Controller
{
    public function membersList()
    {
        $members = team_members::all();

        if ($members->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $members
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
    public function getTeamMembers(Request $request)
    {
        $teamUniqueId = $request->input('unique_id');

        // Retrieve team members and their relevant information
        $members = User::select('users.id', 'users.name as team_member_name', 'users.email as team_member_email', 'roles.name as team_member_role', 'users.phone as team_member_phone', 'users.address as team_member_address')
            ->join('team_members', 'users.id', '=', 'team_members.user_id')
            ->join('teams', 'team_members.team_id', '=', 'teams.id')
            ->join('user_roles', function ($join) {
                $join->on('users.id', '=', 'user_roles.user_id')
                    ->on('teams.id', '=', 'user_roles.team_id');
            })
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('teams.unique_id', $teamUniqueId)
            ->where('users.id', '<>', function ($query) use ($teamUniqueId) {
                $query->select('organizer_id')
                    ->from('teams')
                    ->where('unique_id', $teamUniqueId);
            })
            ->get();

        // Initialize variables to store total credit hours
        $totalCreditHoursTeam = 0;
        $totalCreditHoursOverall = 0;

        // Iterate through team members to calculate credit hours
        foreach ($members as $member) {
            // Retrieve credit hours for each member in the team
            // $creditHoursTeam = user_credit_hour::where('user_id', $member->id)
            //     ->where('team_id', $member->team_id)
            //     ->sum('credit_hours');


            $creditHoursTeam =
                DB::table('user_credit_hours')
                ->select(DB::raw('SUM(credit_hours) as total_credit_hours'))
                ->where('user_id', $member->id)
                ->groupBy('user_id', 'team_id')
                ->value('total_credit_hours');

            // Retrieve total credit hours for each member overall
            $creditHoursOverall = user_credit_hour::where('user_id', $member->id)
                ->sum('credit_hours');

            // Increment total credit hours for the team and overall
            $totalCreditHoursTeam += $creditHoursTeam;
            $totalCreditHoursOverall += $creditHoursOverall;

            // Add credit hours to member data
            $member->total_credit_hours = $creditHoursOverall;
            $member->team_credit_hours = $creditHoursTeam;
        }

        // Return response with total credit hours and member information
        return response()->json([
            'status' => 200,
            'total_credit_hours_team' => $totalCreditHoursTeam,
            'total_credit_hours_overall' => $totalCreditHoursOverall,
            'members' => $members,
        ]);
    }

    // public function getTeamMembers(Request $request)
    // {
    //     $teamUniqueId = $request->input('unique_id');

    //     // Retrieve team members and their relevant information
    //     $members = User::select('users.id', 'users.name as team_member_name', 'users.email as team_member_email', 'roles.name as team_member_role', 'users.phone as team_member_phone', 'users.address as team_member_address')
    //         ->join('team_members', 'users.id', '=', 'team_members.user_id')
    //         ->join('teams', 'team_members.team_id', '=', 'teams.id')
    //         ->join('user_roles', function ($join) {
    //             $join->on('users.id', '=', 'user_roles.user_id')
    //                 ->on('teams.id', '=', 'user_roles.team_id');
    //         })
    //         ->join('roles', 'user_roles.role_id', '=', 'roles.id')
    //         ->where('teams.unique_id', $teamUniqueId)
    //         ->where('users.id', '<>', function ($query) use ($teamUniqueId) {
    //             $query->select('organizer_id')
    //                 ->from('teams')
    //                 ->where('unique_id', $teamUniqueId);
    //         })
    //         ->get();

    //     // Initialize variables to store total credit hours
    //     $totalCreditHoursTeam = 0;
    //     $totalCreditHoursOverall = 0;

    //     // Iterate through team members to calculate credit hours
    //     foreach ($members as $member) {
    //         // Retrieve credit hours for each member in the team
    //         $creditHoursTeam = user_credit_hour::where('user_id', $member->id)
    //             ->where('team_id', $member->team_id)  // Use the correct team ID
    //             ->sum('credit_hours');

    //         // Retrieve total credit hours for each member overall
    //         $creditHoursOverall = user_credit_hour::where('user_id', $member->id)
    //             ->sum('credit_hours');

    //         // Increment total credit hours for the team and overall
    //         $totalCreditHoursTeam += $creditHoursTeam;
    //         $totalCreditHoursOverall += $creditHoursOverall;

    //         // Add credit hours to member data
    //         $member->total_credit_hours = $creditHoursOverall;
    //         $member->team_credit_hours = $creditHoursTeam;
    //     }

    //     // Return response with total credit hours and member information
    //     return response()->json([
    //         'status' => 200,
    //         'total_credit_hours_team' => $totalCreditHoursTeam,
    //         'total_credit_hours_overall' => $totalCreditHoursOverall,
    //         'members' => $members,
    //     ]);
    // }




    // public function getTeamMembers(Request $request)
    // {
    //     $teamUniqueId = $request->input('unique_id');

    //     $members = User::select('users.name as team_member_name', 'users.email as team_member_email', 'roles.name as team_member_role', 'users.phone as team_member_phone', 'users.address as team_member_address')
    //         ->join('team_members', 'users.id', '=', 'team_members.user_id')
    //         ->join('teams', 'team_members.team_id', '=', 'teams.id')
    //         ->join('user_roles', function ($join) {
    //             $join->on('users.id', '=', 'user_roles.user_id')
    //                 ->on('teams.id', '=', 'user_roles.team_id');
    //         })
    //         ->join('roles', 'user_roles.role_id', '=', 'roles.id')
    //         ->where('teams.unique_id', $teamUniqueId)
    //         ->where('users.id', '<>', function ($query) use ($teamUniqueId) {
    //             $query->select('organizer_id')
    //                 ->from('teams')
    //                 ->where('unique_id', $teamUniqueId);
    //         })
    //         ->get();

    //     return response()->json([
    //         'status' => 200,
    //         'members' => $members,
    //     ]);
    // }
}
