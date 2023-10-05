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

  const [EventTitle, setEventTitle] = useState();
  const [EventDate, setEventDate] = useState();
  const [location, setlocation] = useState();
  const [organizationName, setorganizationName] = useState();
  const [Credithours, setCredithours] = useState();
  const [CoordinatorEmail, setCoordinatorEmail] = useState();
  const [comments, setcomments] = useState();

  const [events, setEvents] = useState([]);
  const [participnts, setParticipnts] = useState([]);

  const [showTable, setShowTable] = useState(false);

  // function toggleTable() {
  //   setShowTable(!showTable);
  // }
  function toggleTable(eventTitle) {
    setShowTable((prevShowTable) =>
      prevShowTable === eventTitle ? null : eventTitle
    );
    getEventParticipants(eventTitle);
  }

  const [err, setErr] = useState();
  const [errState, setErrState] = useState();
  const [Links, setLinks] = useState([
    {
      title: "Teams",
      to: "/dash",
      sub: [
        {
          title: "Events",
          to: `/teams/${teamId}/admin`,
          active: true,
        },
        {
          title: "Users",
          to: `/teams/${teamId}/admin/users`,
        },
      ],
    },
    {},
  ]);

  const createEvent = (e) => {
    e.preventDefault();
    if (!EventTitle) {
      setErr("Enter Event Title");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!EventDate) {
      setErr("Enter Event Date");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!location) {
      setErr("Enter Event Location");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!organizationName) {
      setErr("Enter Organization's name");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!Credithours) {
      setErr("Enter Credit Hours");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!CoordinatorEmail) {
      setErr("Enter Coordinator Email");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (!comments) {
      setErr("Enter Event Comments");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        .post("http://localhost:8000/api/createEvent", {
          title: EventTitle,
          date: EventDate,
          organization_name: organizationName,
          location: location,
          credit_hours: Credithours,
          coordinator_email: CoordinatorEmail,
          team_unique_id: teamId,
          comments: comments,
        })
        .then((response) => {
          if (response.data.status === 201) {
            console.log(response.data.message);
            setErr(response.data.message);
            setErrState(false);
            getEvents();

            setEventTitle("");
            setEventDate("");
            setlocation("");
            setorganizationName("");
            setCredithours("");
            setCoordinatorEmail("");
            setcomments("");
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

  function getEventParticipants(event_title) {
    axios
      .post("http://localhost:8000/api/getEventParticipants", {
        team_unique_id: teamId,
        event_title: event_title,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setParticipnts(response.data.participants);
          console.log(response.data.participants);
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

  function removeEventParticipant(email, event_title) {
    axios
      .post("http://localhost:8000/api/removeEventParticipant", {
        unique_id: teamId,
        event_title: event_title,
        user_email: email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setErr(response.data.message);
          setErrState(false);
          getEventParticipants(event_title);
          // setParticipnts(response.data.participants);
          // console.log(response.data.participants);
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

  function deleteEvent(eventTitle) {
    axios
      .post("http://localhost:8000/api/deleteEvent", {
        event_title: eventTitle,
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setEvents(response.data.events);
          console.log(response.data.events);
          getEvents();
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
        <div className="flex flex-col w-8/12 gap-y-10">
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
                      type="submit"
                      className=" py-1 px-4 rounded-2xl z-50 text-red-700"
                      style={{
                        transition: "border-bottom 1ms",
                      }}
                      onClick={() => deleteEvent(event.title)}
                      onMouseEnter={(e) => {
                        e.target.style.borderBottom = "1px solid #C39601";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderBottom = "none";
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="submit"
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
                    >
                      {/* {showTable ? "Hide Details" : "See Details"} */}
                      {showTable === event.title
                        ? "Hide Details"
                        : "See Details"}
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
                  {showTable === event.title && (
                    <>
                      <hr className="mt-5" />
                      <div>
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
                                actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {participnts.map((participnt) => (
                              <tr
                                key={participnt.id}
                                className={`border-b dark:border-gray-700 `}
                                style={{ backgroundColor: "#2f2f2f" }}
                              >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {participnt.name}
                                </td>
                                <td className="px-6 py-4">
                                  {participnt.email}
                                </td>
                                <td className="px-6 py-4">
                                  {participnt.phone}
                                </td>

                                <td className="px-6 py-4">
                                  <button
                                    onClick={() =>
                                      removeEventParticipant(
                                        participnt.email,
                                        event.title
                                      )
                                    }
                                    className="text-red-700 hover:underline"
                                  >
                                    Remove
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

        <div
          className=" space-y-4 rounded-2xl p-5 w-4/12"
          style={{ backgroundColor: "#2F2F2F" }}
        >
          <h1
            className="text-xl leading-tight tracking-tight  md:text-2xl "
            style={{ color: "#C39601" }}
          >
            Create an event
          </h1>
          <form className="space-y-4 md:space-y-2" onSubmit={createEvent}>
            <div>
              <label
                htmlFor="EventTitle"
                className="block mb-2 text-sm font-medium mt-2"
                style={{ color: "#F6F6F6" }}
              >
                Event Title
              </label>
              <input
                type="text"
                name="EventTitle"
                id="EventTitle"
                className="sm:text-sm rounded-2xl w-full px-4 py-2"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="Anti Littering Drive"
                value={EventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />

              <div className="flex flex-row space-x-2">
                <div className="w-6/12">
                  <label
                    htmlFor="EventDate"
                    className="block mb-2 text-sm font-medium mt-2"
                    style={{ color: "#F6F6F6" }}
                  >
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="EventDate"
                    id="EventDate"
                    className="sm:text-sm rounded-2xl w-full px-4 py-2"
                    style={{
                      backgroundColor: "#111111",
                      color: "#F6F6F6",
                      colorScheme: "dark",
                    }}
                    value={EventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="Credithours"
                    className="block mb-2 text-sm font-medium mt-2"
                    style={{ color: "#F6F6F6" }}
                  >
                    Credit hours
                  </label>
                  <input
                    type="number"
                    name="Credithours"
                    id="Credithours"
                    className="sm:text-sm rounded-2xl w-full px-4 py-2"
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="05"
                    value={Credithours}
                    onChange={(e) => setCredithours(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block mb-2 text-sm font-medium mt-2"
                    style={{ color: "#F6F6F6" }}
                  >
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    id="organizationName"
                    className="sm:text-sm rounded-2xl w-full px-4 py-2"
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="Khalida foundation"
                    value={organizationName}
                    onChange={(e) => setorganizationName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm font-medium mt-2"
                    style={{ color: "#F6F6F6" }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="sm:text-sm rounded-2xl w-full px-4 py-2"
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="E-8 Islamabad"
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
                  />
                </div>
              </div>

              <label
                htmlFor="CoordinatorEmail"
                className="block mb-2 text-sm font-medium mt-2"
                style={{ color: "#F6F6F6" }}
              >
                Coordinator Email
              </label>
              <input
                type="email"
                name="CoordinatorEmail"
                id="CoordinatorEmail"
                className="sm:text-sm rounded-2xl w-full px-4 py-2"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="coordinator@example.com"
                value={CoordinatorEmail}
                onChange={(e) => setCoordinatorEmail(e.target.value)}
              />
              <label
                htmlFor="comments"
                className="block mb-2 text-sm font-medium mt-2"
                style={{ color: "#F6F6F6" }}
              >
                Comments
              </label>
              <textarea
                name="comments"
                id="comments"
                className="sm:text-sm rounded-lg  block w-full p-2.5 resize-none  h-28"
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="Bring your bags with you."
                value={comments}
                onChange={(e) => setcomments(e.target.value)}
              ></textarea>
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
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
