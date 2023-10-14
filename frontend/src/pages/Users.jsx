import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TeamDetA from "../common/TeamDetA";

export default function Users() {
  const { teamId } = useParams();
  const auth = useAuth();
  const [addUserEmail, setaddUserEmail] = useState([]);
  const [members, setmembers] = useState([]);
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const [progress, setProgress] = useState();
  const [key, setKey] = useState(0);

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

  const AddMember = (e) => {
    e.preventDefault();
    if (!addUserEmail) {
      setErr("Enter a user email");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .post("http://localhost:8000/api/addUserToTeam", {
          email: addUserEmail,
          unique_id: teamId,
        })
        .then((response) => {
          if (response.data.status === 201) {
            console.log(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            getTeamMembers();

            setKey(key + 1);
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
  };

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

          setKey(key + 1);
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

  useEffect(() => {
    getTeamMembers();
  }, []);
  return (
    <>
      <Sidebar />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-col gap-y-10  py-10">
        {/* <TeamDetA /> */}
        <TeamDetA key={key} />
        <div className=" flex flex-row gap-x-10  justify-center items-start">
          <table className="w-full text-sm text-left  dark:text-gray-400 rounded-2xl overflow-hidden">
            <thead
              className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b border-opacity-50"
              style={{ backgroundColor: "#2f2f2f" }}
            >
              <tr>
                <th scope="col" className="px-2 py-3">
                  Sr.
                </th>
                <th scope="col" className="px-2 py-3">
                  Name
                </th>
                <th scope="col" className="px-2 py-3">
                  Email
                </th>
                <th scope="col" className="px-2 py-3">
                  Phone
                </th>
                <th scope="col" className="px-2 py-3">
                  Address
                </th>
                <th scope="col" className="px-2 py-3">
                  Role
                </th>
                <th scope="col" className="px-2 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr
                  key={member.team_member_email}
                  className={`border-b dark:border-gray-700 `}
                  style={{ backgroundColor: "#2f2f2f" }}
                >
                  <td className="px-2 py-4 ">{index + 1}</td>
                  <td className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.team_member_name}
                  </td>
                  <td className="px-2 py-4">{member.team_member_email}</td>
                  <td className="px-2 py-4">{member.team_member_phone}</td>
                  <td className="px-2 py-4">{member.team_member_address}</td>
                  <td className="px-2 py-4">{member.team_member_role}</td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => RemoveMember(member.team_member_email)}
                      className="text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className=" space-y-4 rounded-2xl p-5 w-96"
            style={{ backgroundColor: "#2F2F2F" }}
          >
            <h1
              className="text-xl leading-tight tracking-tight  md:text-2xl "
              style={{ color: "#C39601" }}
            >
              Add a member to the team
            </h1>
            <form className="space-y-4 md:space-y-2" onSubmit={AddMember}>
              <div>
                <label
                  htmlFor="teamID"
                  className="block mb-2 text-sm font-medium mt-2"
                  style={{ color: "#F6F6F6" }}
                >
                  User Email
                </label>
                <input
                  type="text"
                  name="teamID"
                  id="teamID"
                  className="sm:text-sm rounded-2xl w-full px-4 py-2"
                  style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                  placeholder="user@example.com"
                  value={addUserEmail}
                  onChange={(e) => setaddUserEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="py-1 rounded-2xl w-full mt-2"
                  style={{
                    color: "#C39601",
                    transition: "1ms",
                    border: "2px solid #C39601",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#C39601";
                    e.target.style.color = "#111111";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "initial";
                    e.target.style.color = "#C39601";
                  }}
                >
                  Add member
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
