import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Copy from "../assets/copy";
import TeamAdmin from "../pages/TeamAdmin";
import Users from "../pages/Users";

export default function TeamDetM({ totalEvents, myEvents }) {
  const { totalE } = totalEvents;
  const { myE } = myEvents;
  const { teamId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [teamDet, setteamDet] = useState([]);
  const [err, setErr] = useState();
  const [errState, setErrState] = useState();
  const [password, setPassword] = useState("");

  function RemoveMember() {
    const requestData = {
      email: auth.user.email,
      unique_id: teamId,
    };
    if (!password) {
      setErr("Enter your password to leave team");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (password !== auth.user.password) {
      setErr("Wrong password");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .delete("http://localhost:8000/api/removeUserFromTeam", {
          data: requestData,
        })
        .then((response) => {
          if (response.data.status === 200) {
            console.log(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            navigate("/dash");
            //   getTeamMembers();
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
  }
  function getTeamDetails() {
    axios
      .post("http://localhost:8000/api/getTeamDetails", {
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setteamDet(response.data.team_details);
          console.log(response.data.team_details);
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
    getTeamDetails();
  }, []);
  return (
    <>
      {/* <Sidebar /> */}
      <Toast err={err} errState={errState} />
      {/* <div className="container mx-auto max-w-screen-xl flex flex-col gap-y-10  my-10"> */}
      <div
        className="flex flex-col rounded-2xl shadow w-full"
        style={{ backgroundColor: "#2f2f2f" }}
        // style={{ backgroundColor: "#111111" }}
      >
        <div
          className="flex flex-col rounded-2xl shadow gap-x-10 px-10 py-5"
          style={{ backgroundColor: "#111111" }}
        >
          <div
            className="flex flex-row items-center   justify-between "
            // style={{ backgroundColor: "#111111" }}
          >
            <div className="flex flex-row gap-x-5 items-baseline">
              <h5 className="text-2xl font-medium" style={{ color: "#c39601" }}>
                {/* Hoor ka Event */}
                {teamDet.team_name}
              </h5>
              <p
                className="font-light text-sm flex items-center "
                style={{ color: "#FAFAFA" }}
              >
                {teamDet.team_unique_id}
                <span
                  className=" text-base font-light ml-2 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(teamDet.team_unique_id);
                    setErr("coppied to clipboard");
                    setErrState(false);
                    setTimeout(() => {
                      setErr("");
                      setErrState(false);
                    }, 3000);
                  }}
                >
                  <Copy />
                </span>
              </p>
            </div>
            <div className="flex flex-row space-x-5">
              <div>
                <input
                  type="password"
                  // name="new-pass"
                  // id="new-pass"
                  className="sm:text-sm rounded-lg   p-2 "
                  style={{ backgroundColor: "#2f2f2f", color: "#F6F6F6" }}
                  placeholder="Enter Password to leave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className=" py-1 px-4 rounded-2xl text-red-700"
                style={{
                  transition: "border-bottom 1ms",
                }}
                onClick={() => RemoveMember()}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = "1px solid #C39601";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = "none";
                }}
              >
                Leave team
              </button>
            </div>
          </div>
        </div>
        <nav className="md:mx-auto md:mr-auto flex flex-wrap text-base py-5 gap-x-10">
          <Link
            to={`/teams/${teamId}`}
            // onClick={() => setSelectedTab("events")}
            className="text-white  flex items-center"
            style={{
              borderBottom: "none",
              transition: "border-bottom 1ms",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "none";
            }}
          >
            {totalEvents} All Events
          </Link>
          <Link
            to={`/teams/${teamId}/myEvents`}
            // onClick={() => setSelectedTab("members")}
            className="text-white  flex items-center"
            style={{
              borderBottom: "none",
              transition: "border-bottom 1ms",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "none";
            }}
          >
            {myEvents} My Events
          </Link>
        </nav>
      </div>
    </>
  );
}
