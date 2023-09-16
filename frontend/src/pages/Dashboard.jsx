import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // const auth = useAuth();

  const [teamName, setteamName] = useState("");
  const [teamID, setteamID] = useState("");
  const [joinTeamID, setjoinTeamID] = useState("");
  // const [err, setErr] = useState("");
  // const [errState, setErrState] = useState();

  const handleCreateTeam = (e) => {
    e.preventDefault();
    // console.log(auth.user);
    console.log("teamName:", teamName);
    console.log("teamID:", teamID);

    if (!teamName) {
      setErr("Enter a team name");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!teamID) {
      setErr("Enter a team ID");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .post("http://localhost:8000/api/createTeam", {
          unique_id: teamID,
          team_name: teamName,
          organizerEmail: auth.user.email,
        })
        .then((response) => {
          if (response.data.status === 201) {
            // setErr(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
            getMyTeams();
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

  const handeJoin = (e) => {
    e.preventDefault();
    // console.log(auth.user);
    console.log("teamID:", teamID);

    if (!joinTeamID) {
      setErr("Enter a team ID");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .post("http://localhost:8000/api/addUserToTeam", {
          unique_id: joinTeamID,
          email: auth.user.email,
        })
        .then((response) => {
          if (response.data.status === 201) {
            // setErr(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
            getUserTeams();
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

  const auth = useAuth();
  const [teams, setTeams] = useState([]);
  const [MyTeams, setMyTeams] = useState([]);

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  function getMyTeams() {
    axios
      .post("http://localhost:8000/api/getMyTeams", {
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setMyTeams(response.data.teams);
          // console.log(response.data.teams);
          // console.log(teams
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

  function getUserTeams() {
    axios
      .post("http://localhost:8000/api/getUserTeams", {
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setTeams(response.data.teams);
          console.log(response.data.teams);
          // console.log(teams);
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
    getUserTeams();
    getMyTeams();
  }, []);

  const [Links, setLinks] = useState([
    { title: "Teams", to: "/dash" },
    { title: "Test", to: "/about_us" },
  ]);
  return (
    <>
      <Sidebar Links={Links} />
      <div className="container mx-auto max-w-screen-xl flex flex-row gap-x-10  justify-center items-start my-10">
        <Toast err={err} errState={errState} />
        <div className="flex flex-col w-full">
          {teams.length > 0 && (
            <div>
              <h1
                className="text-lg md:text-xl mt-3"
                style={{ color: "#2f2f2f" }}
              >
                All Teams
              </h1>
              <hr />

              <div className="mt-4 flex flex-row flex-wrap gap-y-4">
                <div
                  className="flex flex-col items-start rounded-2xl shadow  p-5 w-full  gap-y-2 "
                  style={{ backgroundColor: "#2f2f2f" }}
                >
                  {teams.map((team) => (
                    <Link
                      key={team.team_unique_id}
                      to={`/teams/${team.team_unique_id}`}
                      className="flex flex-row gap-x-10  w-full pb-2"
                      style={{ borderBottom: "0.5px solid grey" }}
                    >
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg"
                        style={{
                          backgroundColor: "#f6f6f6",
                        }}
                      >
                        <span
                          className="text-xl font-medium text-clip overflow-clip"
                          style={{ color: "#C39601" }}
                        >
                          {team.team_unique_id.slice(0, 4)}...
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <h5
                          className="text-xl font-medium flex items-center"
                          style={{ color: "#C39601" }}
                        >
                          <span className=" text-base font-light mr-10">
                            Team Name:
                          </span>
                          {team.team_name}
                        </h5>

                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-8">
                            Owner Name:
                          </span>
                          {team.organizer_email}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-4">
                            Total members:
                          </span>
                          &nbsp;{team.number_of_members}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* my teams */}
          {MyTeams.length > 0 && (
            <div className="mt-10">
              <h1
                className="text-lg md:text-xl mt-3"
                style={{ color: "#2f2f2f" }}
              >
                My Teams
              </h1>
              <hr />

              <div className="mt-4 flex flex-row flex-wrap gap-y-4">
                <div
                  className="flex flex-col items-start rounded-2xl shadow  p-5 w-full  gap-y-2 "
                  style={{ backgroundColor: "#2f2f2f" }}
                >
                  {MyTeams.map((team) => (
                    <Link
                      key={team.team_unique_id}
                      to={`/teams/${team.team_unique_id}/admin`}
                      className="flex flex-row gap-x-10  w-full pb-2"
                      style={{ borderBottom: "0.5px solid grey" }}
                    >
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg"
                        style={{
                          backgroundColor: "#f6f6f6",
                        }}
                      >
                        <span
                          className="text-xl font-medium text-clip overflow-clip"
                          style={{ color: "#C39601" }}
                        >
                          {team.team_unique_id.slice(0, 4)}...
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <h5
                          className="text-xl font-medium flex items-center"
                          style={{ color: "#C39601" }}
                        >
                          <span className=" text-base font-light mr-10">
                            Team Name:
                          </span>
                          {team.team_name}
                        </h5>

                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-8">
                            Owner Name:
                          </span>
                          {team.organizer_email}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-4">
                            Total members:
                          </span>
                          &nbsp;{team.number_of_members}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <JoinCreateTeam /> */}
        <JoinCreateTeam getMyTeams={getMyTeams} getUserTeams={getUserTeams} />
      </div>
    </>
  );
}
