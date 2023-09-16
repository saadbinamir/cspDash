import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";

export default function Dashboard() {
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

  return (
    <>
      <Sidebar />
      <div className="p-5 sm:ml-64 ">
        <div className=" pr-4 mt-20 ">
          <Toast err={err} errState={errState} />
          {/* <JoinCreateTeam /> */}
          <JoinCreateTeam getMyTeams={getMyTeams} getUserTeams={getUserTeams} />

          {teams.length > 0 && (
            <div className="md:w-9/12 sm:w-full ">
              <h1
                className="text-lg  md:text-xl mt-3"
                style={{ color: "#2f2f2f" }}
              >
                All Teams
              </h1>
              <hr />

              <div className="mt-8 flex flex-row flex-wrap gap-5">
                {teams.map((team) => (
                  <Link
                    to={`/teams/${team.team_unique_id}`}
                    className="flex flex-col items-center rounded-2xl shadow md:flex-row md:w-3/12 sm:w-full space-x-5 p-5 flex-grow"
                    style={{ backgroundColor: "#2f2f2f" }}
                    key={team.team_unique_id}
                  >
                    <div
                      className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg "
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

                    <div className="flex flex-col ">
                      <h5
                        className="text-xl font-medium "
                        style={{ color: "#C39601" }}
                      >
                        {team.team_name}
                      </h5>

                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        @ {team.organizer_email}
                      </p>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        # &nbsp;{team.number_of_members}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* my teams */}
          {MyTeams.length > 0 && (
            <div className="md:w-9/12 sm:w-full mt-10">
              <h1
                className="text-lg  md:text-xl mt-3"
                style={{ color: "#2f2f2f" }}
              >
                My Teams
              </h1>
              <hr />

              <div className="mt-8 flex flex-row flex-wrap gap-5">
                {MyTeams.map((team) => (
                  <Link
                    to={`/teams/${team.team_unique_id}/admin`}
                    className="flex flex-col items-center rounded-2xl shadow md:flex-row md:w-3/12 sm:w-full space-x-5 p-5 flex-grow"
                    style={{ backgroundColor: "#2f2f2f" }}
                    key={team.team_unique_id}
                  >
                    <div
                      className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg "
                      style={{
                        backgroundColor: "#f6f6f6",
                      }}
                    >
                      <span
                        className="text-xl font-medium text-clip overflow-clip"
                        style={{ color: "#C39601" }}
                      >
                        {team.team_unique_id.slice(0, 5)}...
                      </span>
                    </div>

                    <div className="flex flex-col ">
                      <h5
                        className="text-xl font-medium "
                        style={{ color: "#C39601" }}
                      >
                        {team.team_name}
                      </h5>

                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        @ {team.organizer_email}
                      </p>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        # &nbsp;{team.number_of_members}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
