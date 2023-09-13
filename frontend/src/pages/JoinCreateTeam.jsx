import React, { useState } from "react";
import { useAuth } from "../utils/Auth";
import axios from "axios";
import Toast from "../common/Toast";
// import { getMyTeams, getUserTeams } from "./Dashboard";

export default function JoinCreateTeam({ getMyTeams, getUserTeams }) {
  const auth = useAuth();

  const [teamName, setteamName] = useState("");
  const [teamID, setteamID] = useState("");
  const [joinTeamID, setjoinTeamID] = useState("");
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

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
  return (
    <>
      <Toast err={err} errState={errState} />

      <div className="w-80  sm:p-5 md:mt-0 sm:max-w-md xl:p-0  fixed top-40 right-5 space-y-5">
        <div
          className=" space-y-4 rounded-2xl p-5 "
          style={{ backgroundColor: "#2F2F2F" }}
        >
          <h1
            className="text-xl leading-tight tracking-tight  md:text-2xl "
            style={{ color: "#C39601" }}
          >
            Join a team using code
          </h1>
          <form className="space-y-4 md:space-y-2" onSubmit={handeJoin}>
            <div>
              <label
                htmlFor="teamID"
                className="block mb-2 text-sm font-medium mt-2"
                style={{ color: "#F6F6F6" }}
              >
                Team unique ID
              </label>
              <input
                type="text"
                name="teamID"
                id="teamID"
                className="sm:text-sm rounded-2xl w-full px-4 py-2"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="myTeam"
                value={joinTeamID}
                onChange={(e) => setjoinTeamID(e.target.value)}
              />
            </div>
            {/* <div>
                  <p
                    id="error"
                    className={`text-sm font-light pt-2 ${
                      errState ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {err}
                  </p>
                </div> */}
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
                Join team
              </button>
            </div>
          </form>
        </div>
        <div
          className=" space-y-4   rounded-2xl p-5 "
          style={{ backgroundColor: "#2F2F2F" }}
        >
          <h1
            className="text-xl leading-tight tracking-tight  md:text-2xl "
            style={{ color: "#C39601" }}
          >
            Create a new team
          </h1>
          <form className="space-y-4 md:space-y-2" onSubmit={handleCreateTeam}>
            <div>
              <label
                htmlFor="teamName"
                className="block mb-2 text-sm font-medium "
                style={{ color: "#F6F6F6" }}
              >
                Team name
              </label>
              <input
                type="text"
                name="teamName"
                id="teamName"
                className="sm:text-sm rounded-2xl w-full px-4 py-2"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="My Team"
                value={teamName}
                onChange={(e) => setteamName(e.target.value)}
              />
              <label
                htmlFor="teamID"
                className="block mb-2 text-sm font-medium mt-2"
                style={{ color: "#F6F6F6" }}
              >
                Team unique ID
              </label>
              <input
                type="text"
                name="teamID"
                id="teamID"
                className="sm:text-sm rounded-2xl w-full px-4 py-2"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="myTeam"
                value={teamID}
                onChange={(e) => setteamID(e.target.value)}
              />
            </div>
            {/* <div>
                  <p
                    id="error"
                    className={`text-sm font-light pt-2 ${
                      errState ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {err}
                  </p>
                </div> */}
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
                Create team
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
