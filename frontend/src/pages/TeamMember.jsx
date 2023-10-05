import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Date from "../assets/date";
import Location from "../assets/Location";
import Email from "../assets/Email";
import Hours from "../assets/Hours";

export default function TeamAdmin() {
  const { teamId } = useParams();
  const auth = useAuth();

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const [events, setEvents] = useState([]);
  const [Links, setLinks] = useState([
    {
      title: "Teams",
      to: "/dash",
      sub: [
        {
          title: "All Events",
          to: `/teams/${teamId}`,
          active: true,
        },
        {
          title: "My Events",
          to: `/teams/${teamId}/myEvents`,
        },
      ],
    },
  ]);
  function addEventParticipant(event_title) {
    axios
      .post("http://localhost:8000/api/addEventParticipant", {
        unique_id: teamId,
        event_title: event_title,
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 201) {
          setErr(response.data.message);
          setErrState(false);
          // setEvents(response.data.events);
          // console.log(response.data.events);
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
  function getEvents() {
    axios
      .post("http://localhost:8000/api/getEventsInTeam", {
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setEvents(response.data.events);
          console.log(response.data.events);
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
    getEvents();
    // console.log(teamId);
  }, []);
  return (
    <>
      <Sidebar Links={Links} />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-row gap-x-10  justify-center items-start my-10">
        <div className="flex flex-col w-full gap-y-10">
          {/* <h1>Team member Page for Team ID: {teamId}</h1> */}

          {events && events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.EventTitle}
                className="flex flex-col rounded-2xl shadow w-full  "
                style={{ backgroundColor: "#2f2f2f" }}
              >
                <div
                  className="flex flex-row h-20 rounded-2xl shadow items-center space-x-10 px-10  justify-between"
                  style={{ backgroundColor: "#111111" }}
                >
                  <div className="flex flex-row space-x-5">
                    <h5
                      className="text-2xl font-medium"
                      style={{ color: "#FAFAFA" }}
                    >
                      {/* Hoor ka Event */}
                      {event.title}
                    </h5>
                  </div>
                  <div className="flex flex-row space-x-5">
                    <button
                      className="py-1 px-4 rounded-2xl"
                      style={{
                        color: "#C39601",
                        transition: "1ms",
                        border: "1px solid #C39601",
                      }}
                      onClick={() => addEventParticipant(event.title)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#C39601";
                        e.target.style.color = "#111111";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "initial";
                        e.target.style.color = "#C39601";
                      }}
                    >
                      {/* {showTable ? "Hide Details" : "See Details"} */}
                      {/* {showTable === event.title
                        ? "Hide Details"
                        : "See Details"} */}
                      Participate
                    </button>
                  </div>
                </div>

                <div className="flex flex-col px-10 py-5 text-justify">
                  <p
                    className="font-light text-base"
                    style={{ color: "#FAFAFA" }}
                  >
                    {/* i don't know the description . don't mind.. wait why should I?
                  yes phir bhi this is the description */}
                    {event.comments}
                  </p>
                  <div className="flex flex-row pt-5 w-full justify-between ">
                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Date />
                      </span>
                      {/* 18-04-2023 */}
                      {event.date}
                    </p>
                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Location />
                      </span>
                      {/* Mazhar Ul Islam School | Islamabad */}
                      {event.organization_name} | {event.location}
                    </p>

                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Email />
                      </span>
                      {/* coordinator@gmail.com */}
                      {event.coordinator_email}
                    </p>
                    <p
                      className="font-light text-sm flex items-center"
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Hours />
                      </span>
                      {/* 10 */}
                      {event.credit_hours}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </>
  );
}
