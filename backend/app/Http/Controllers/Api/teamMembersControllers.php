<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\team_members;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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

        $members = User::select('users.name as team_member_name', 'users.email as team_member_email', 'roles.name as team_member_role', 'users.phone as team_member_phone', 'users.address as team_member_address')
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

        return response()->json([
            'status' => 200,
            'members' => $members,
        ]);
    }
}
