<?php

namespace App\Http\Controllers\Api;

use App\Models\Team;
use App\Models\User;
use App\Models\team_members;
use Illuminate\Http\Request;
use App\Models\user_credit_hour;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;


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






    function getTeamMembers(Request $request)
    {
        $teamUniqueId = $request->input('unique_id');
        $organizerIdSubquery = Team::select('organizer_id')->where('unique_id', $teamUniqueId);

        $members = User::select(
            'users.name as team_member_name',
            'users.email as team_member_email',
            'roles.name as team_member_role',
            'users.phone as team_member_phone',
            'users.address as team_member_address',
            DB::raw('(SELECT SUM(credit_hours) FROM user_credit_hours WHERE user_id = users.id AND team_id = team_members.team_id) AS team_credit_hours'),
            DB::raw('(SELECT SUM(credit_hours) FROM user_credit_hours WHERE user_id = users.id) AS total_credit_hours')
        )
            ->join('team_members', 'users.id', '=', 'team_members.user_id')
            ->join('teams', 'team_members.team_id', '=', 'teams.id')
            ->join('user_roles', function ($join) {
                $join->on('users.id', '=', 'user_roles.user_id')
                    ->on('teams.id', '=', 'user_roles.team_id');
            })
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('teams.unique_id', $teamUniqueId)
            ->where('users.id', '<>', $organizerIdSubquery)
            ->get();

        $totalCreditHoursTeam = $members->sum('team_credit_hours');
        $totalCreditHoursOverall = $members->sum('total_credit_hours');

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
