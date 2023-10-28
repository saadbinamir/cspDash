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

export default function TeamDetA() {
  const { teamId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [teamDet, setteamDet] = useState([]);
  const [err, setErr] = useState();
  const [errState, setErrState] = useState();
  const [password, setPassword] = useState("");
  const [announcements, setAnnouncements] = useState("");

  function updateAnnouncements() {
    if (!announcements) {
      setErr("Announcements can not be empty");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        // .post("http://localhost:8000/api/updateTeamAnnouncements", {
        // .post("http://192.168.18.36:8000/api/updateTeamAnnouncements", {
        .post(`http://${auth.ip}:8000/api/updateTeamAnnouncements`, {
          team_unique_id: teamId,
          announcements: announcements,
        })
        .then((response) => {
          if (response.data.status === 200) {
            setAnnouncements(response.data.announcements);
            setErr(response.data.message);
            setErrState(false);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
            // getTeamDetails();
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
  function deleteTeam() {
    if (!password) {
      setErr("Enter your password to delete team");
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
        // .post("http://localhost:8000/api/deleteTeam", {
        // .post("http://192.168.18.36:8000/api/deleteTeam", {
        .post(`http://${auth.ip}:8000/api/deleteTeam`, {
          unique_id: teamId,
          organizerEmail: auth.user.email,
        })
        .then((response) => {
          if (response.data.status === 200) {
            setErr(response.data.message);
            setErrState(true);
            setTimeout(() => {
              setErr("");
              setErrState(false);
            }, 3000);
            navigate("/dash");
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
      // .post("http://localhost:8000/api/getTeamDetails", {
      // .post("http://192.168.18.36:8000/api/getTeamDetails", {
      .post(`http://${auth.ip}:8000/api/getTeamDetails`, {
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setteamDet(response.data.team_details);
          console.log(response.data.team_details);
          setAnnouncements(response.data.team_details.announcements);
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
          className="flex flex-col rounded-2xl shadow gap-x-10 px-10 py-5 space-y-5"
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
                  placeholder="Enter Password to delete"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className=" py-1 px-4 rounded-2xl  text-red-700"
                style={{
                  transition: "border-bottom 1ms",
                }}
                onClick={() => deleteTeam(teamDet.team_unique_id)}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = "1px solid #C39601";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = "none";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <nav className="md:mx-auto md:mr-auto flex flex-wrap text-base py-5 gap-x-10">
          <Link
            to={`/teams/${teamId}/admin`}
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
            <span
              className="px-2 rounded-2xl mr-2  text-black"
              style={{
                backgroundColor: "#C39601",
              }}
            >
              {teamDet.number_of_events}
            </span>
            Events
          </Link>
          <Link
            to={`/teams/${teamId}/admin/users`}
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
            <span
              className="px-2 rounded-2xl mr-2 text-black"
              style={{
                backgroundColor: "#C39601",
              }}
            >
              {teamDet.number_of_members - 1}
            </span>
            Members
          </Link>
        </nav>
      </div>
      {/* {selectedTab === "events" && <TeamAdmin />}
        {selectedTab === "members" && <Users />} */}
      {/* </div> */}
    </>
  );
}
