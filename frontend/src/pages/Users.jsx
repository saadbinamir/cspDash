import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Users() {
  const { teamId } = useParams();
  const auth = useAuth();
  const [members, setmembers] = useState([]);
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();
  const [Links, setLinks] = useState([
    {
      title: "Teams",
      to: "/dash",
      sub: [
        {
          title: "Events",
          to: `/teams/${teamId}/admin`,
        },
        {
          title: "Users",
          to: `/teams/${teamId}/admin/users`,
          active: true,
        },
      ],
    },
    {
      title: "Test",
      to: "/about_us",
    },
  ]);

  function getTeamMembers() {
    axios
      .post("http://localhost:8000/api/getTeamMembers", {
        unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setmembers(response.data.members);
          console.log(response.data.members);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
        }
      });
  }

  function RemoveMember(userEmail) {
    const requestData = {
      email: userEmail,
      unique_id: teamId,
    };

    axios
      .delete("http://localhost:8000/api/removeUserFromTeam", {
        data: requestData,
      })
      .then((response) => {
        if (response.data.status === 200) {
          console.log(response.data.message);
          setErr(response.data.message);
          setErrState(false);
          getTeamMembers();
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Log the error for debugging
      });
  }

  useEffect(() => {
    getTeamMembers();
  }, []);
  return (
    <>
      <Sidebar Links={Links} />
      <div className="container mx-auto max-w-screen-xl flex flex-row gap-x-10  justify-center items-start my-10">
        <Toast err={err} errState={errState} />
        <div className="flex flex-col w-full">
          <h1>Users for team: {teamId}</h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b border-opacity-50"
                style={{ backgroundColor: "#2f2f2f" }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr
                    key={index}
                    className={`border-b dark:border-gray-700 `}
                    style={{ backgroundColor: "#2f2f2f" }}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {member.team_member_name}
                    </td>
                    <td className="px-6 py-4">{member.team_member_email}</td>
                    <td className="px-6 py-4">{member.team_member_phone}</td>
                    <td className="px-6 py-4">{member.team_member_address}</td>
                    <td className="px-6 py-4">{member.team_member_role}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => RemoveMember(member.team_member_email)}
                        className="text-yellow-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
