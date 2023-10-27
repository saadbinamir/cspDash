import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [teamName, setteamName] = useState("");
  const [teamID, setteamID] = useState("");
  const [joinTeamID, setjoinTeamID] = useState("");

  const auth = useAuth();
  const [teams, setTeams] = useState([]);
  const [MyTeams, setMyTeams] = useState([]);

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  function getMyTeams() {
    axios
      // .post("http://localhost:8000/api/getMyTeams", {
      // .post("http://192.168.18.36:8000/api/getMyTeams", {
      .post(`http://${auth.ip}:8000/api/getMyTeams`, {
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
      // .post("http://localhost:8000/api/getUserTeams", {
      // .post("http://192.168.18.36:8000/api/getUserTeams", {
      .post(`http://${auth.ip}:8000/api/getUserTeams`, {
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
    document.body.style.backgroundColor = "#1e1e1e";
    getUserTeams();
    getMyTeams();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="container mx-auto max-w-screen-xl flex flex-row gap-x-10  justify-center items-start my-10">
        <Toast err={err} errState={errState} />
        <div className="flex flex-col w-full">
          <div>
            <h1
              className="text-lg md:text-xl mt-3"
              style={{ color: "#f6f6f6" }}
            >
              All Teams
              <hr />
            </h1>

            <div className="mt-4 flex flex-row flex-wrap gap-y-4">
              <div
                className="flex flex-col items-start rounded-2xl shadow  p-5 w-full  gap-y-2 "
                style={{ backgroundColor: "#2f2f2f" }}
              >
                {teams.length > 0 ? (
                  teams.map((team) => (
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
                            Team:
                          </span>
                          {team.team_name}
                        </h5>

                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-8">
                            Owner:
                          </span>
                          {team.organizer_email}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-2">
                            Members:
                          </span>
                          &nbsp;{team.number_of_members - 1}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-white font-light text-sm">
                    No Teams available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* my teams */}

          <div className="mt-10">
            <h1
              className="text-lg md:text-xl mt-3"
              style={{ color: "#f6f6f6" }}
            >
              My Teams
              <hr />
            </h1>

            <div className="mt-4 flex flex-row flex-wrap gap-y-4">
              <div
                className="flex flex-col items-start rounded-2xl shadow  p-5 w-full  gap-y-2 "
                style={{ backgroundColor: "#2f2f2f" }}
              >
                {MyTeams.length > 0 ? (
                  MyTeams.map((team) => (
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
                            Team:
                          </span>
                          {team.team_name}
                        </h5>

                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-8">
                            Owner:
                          </span>
                          {team.organizer_email}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-2">
                            Members:
                          </span>
                          &nbsp;{team.number_of_members - 1}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-white font-light text-sm">
                    No Teams available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <JoinCreateTeam /> */}
        <JoinCreateTeam getMyTeams={getMyTeams} getUserTeams={getUserTeams} />
      </div>
    </div>
  );
}
