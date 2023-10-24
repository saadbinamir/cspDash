import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import { useParams } from "react-router-dom";
import Dat from "../assets/date";
import Location from "../assets/Location";
import Email from "../assets/Email";
import Hours from "../assets/Hours";
import TeamDetM from "../common/TeamDetM";

export default function CoordinatorEvents() {
  const { teamId } = useParams();
  const auth = useAuth();

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const [events, setEvents] = useState([]);

  const [absentStudents, setAbsentStudents] = useState([]);

  const [showTable, setShowTable] = useState(false);
  const [participants, setparticipants] = useState([]);

  function toggleTable(eventTitle) {
    setShowTable((prevShowTable) =>
      prevShowTable === eventTitle ? null : eventTitle
    );
    getEventParticipants(eventTitle);
  }

  function getEventParticipants(event_title) {
    axios
      .post("http://localhost:8000/api/getEventParticipants", {
        team_unique_id: teamId,
        event_title: event_title,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setparticipants(response.data.participants);
          console.log(response.data.participants);

          // Filter participants with attendance_status = false and extract their emails
          const absent = response.data.participants
            .filter((participant) => participant.attendance_status === false)
            .map((participant) => participant.email);

          // Now, absentStudents contains the emails of absent students
          setAbsentStudents(absent);

          console.log("prev Absent Students:", absentStudents);
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

  function saveAttendance(eventTitle) {
    console.log("sending Absent Students:", absentStudents);
    axios
      .post("http://localhost:8000/api/markAttendance", {
        event_title: eventTitle,
        user_email: absentStudents,
        team_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setErr(response.data.message);
          setErrState(false);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
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
      .post("http://localhost:8000/api/getCoordinatorEvent", {
        team_unique_id: teamId,
        user_email: auth.user.email,
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
      <Sidebar />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-col gap-y-10  my-10 mt-10">
        <TeamDetM />
        <div className="flex flex-col w-full gap-y-5">
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
                    {new Date(event.date).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0) && (
                      <button
                        className="text-green-700 hover:underline"
                        onClick={() => saveAttendance(event.title)}
                      >
                        Save
                      </button>
                    )}
                    {/* <button
                      className="text-green-700 hover:underline"
                      onClick={() => saveAttendance(event.title)}
                    >
                      Save
                    </button> */}
                    <button
                      className="py-1 px-4 rounded-2xl"
                      style={{
                        color: "#C39601",
                        transition: "1ms",
                        border: "1px solid #C39601",
                      }}
                      onClick={() => toggleTable(event.title)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#C39601";
                        e.target.style.color = "#111111";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "initial";
                        e.target.style.color = "#C39601";
                      }}
                      // disabled={
                      //   new Date(event.date).setHours(0, 0, 0, 0) <
                      //   new Date().setHours(0, 0, 0, 0)
                      // }
                    >
                      {new Date(event.date).setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "Mark Attendance"
                        : "See Details"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col px-10 py-5 text-justify">
                  <p
                    className="font-light text-base"
                    style={{ color: "#FAFAFA" }}
                  >
                    {event.comments}
                  </p>
                  <div className="flex flex-row pt-5 w-full justify-between ">
                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Dat />
                      </span>
                      {event.date}
                    </p>
                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Location />
                      </span>
                      {event.organization_name} | {event.location}
                    </p>

                    <p
                      className="font-light text-sm flex items-center "
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Email />
                      </span>
                      {event.coordinator_email}
                    </p>
                    <p
                      className="font-light text-sm flex items-center"
                      style={{ color: "#FAFAFA" }}
                    >
                      <span className=" text-base font-light mr-2">
                        <Hours />
                      </span>
                      {event.credit_hours}
                    </p>
                  </div>
                  {showTable === event.title && (
                    <>
                      <hr className="mt-5" />
                      <div>
                        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
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
                              <th scope="col" className="px-2 py-3 ">
                                Present / Absent
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.map((participant, index) => (
                              <tr
                                key={participant.id}
                                className={`border-b dark:border-gray-700 `}
                                style={{ backgroundColor: "#2f2f2f" }}
                              >
                                <td className="px-2 py-2">{index + 1}</td>
                                <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {participant.name}
                                </td>
                                <td className="px-2 py-2">
                                  {participant.email}
                                </td>
                                <td className="px-2 py-2">
                                  {participant.phone}
                                </td>

                                <td className="px-2 py-2">
                                  <button
                                    onClick={() => {
                                      const email = participant.email;
                                      if (absentStudents.includes(email)) {
                                        setAbsentStudents(
                                          absentStudents.filter(
                                            (student) => student !== email
                                          )
                                        );
                                      } else {
                                        setAbsentStudents([
                                          ...absentStudents,
                                          email,
                                        ]);
                                      }

                                      console.log(absentStudents);
                                    }}
                                    className={
                                      absentStudents.includes(participant.email)
                                        ? "text-red-700 hover:underline"
                                        : "text-green-700 hover:underline"
                                    }
                                    disabled={
                                      new Date(event.date).setHours(
                                        0,
                                        0,
                                        0,
                                        0
                                      ) < new Date().setHours(0, 0, 0, 0)
                                    }
                                  >
                                    {absentStudents.includes(participant.email)
                                      ? "Absent"
                                      : "Present"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
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
