import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Dat from "../assets/date";
import Location from "../assets/Location";
import Email from "../assets/Email";
import Hours from "../assets/Hours";
import TeamDetM from "../common/TeamDetM";
import LoadingBar from "react-top-loading-bar";

export default function TeamMember() {
  const { teamId } = useParams();
  const auth = useAuth();

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const [events, setEvents] = useState([]);
  const [participnts, setparticipants] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showAttendance, setshowAttendance] = useState(false);

  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showTodays, setshowTodays] = useState(true);
  const [showupcoming, setshowupcoming] = useState(false);
  const [showpast, setshowpast] = useState(false);

  const [announcements, setannouncements] = useState([]);
  const [progress, setProgress] = useState(0);

  function toggleTable(eventTitle) {
    setShowTable((prevShowTable) =>
      prevShowTable === eventTitle ? null : eventTitle
    );
    getEventParticipants(eventTitle);
  }
  function toggleattendance(eventTitle) {
    setshowAttendance((prevShowAttendance) =>
      prevShowAttendance === eventTitle ? null : eventTitle
    );
    getEventParticipants(eventTitle);
  }

  function getEventParticipants(event_title) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/getEventParticipants`, {
        team_unique_id: teamId,
        event_title: event_title,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setparticipants(response.data.participants);
          console.log(response.data.participants);

          const absent = response.data.participants
            .filter((participant) => participant.attendance_status === false)
            .map((participant) => participant.email);

          setAbsentStudents(absent);
          setProgress(100);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setProgress(100);
        }
      });
  }

  function saveAttendance(eventTitle) {
    setProgress(50);
    console.log("sending Absent Students:", absentStudents);
    axios
      .post(`http://${auth.ip}:8000/api/markAttendance`, {
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
          setProgress(100);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setProgress(100);
        }
      });
  }

  function addEventParticipant(event_title) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/addEventParticipant`, {
        unique_id: teamId,
        event_title: event_title,
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 201) {
          setErr(response.data.message);
          setErrState(false);
          getEvents(true);
          setProgress(100);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setProgress(100);
        }
      });
  }
  function removeEventParticipant(email, event_title) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/removeEventParticipant`, {
        unique_id: teamId,
        event_title: event_title,
        user_email: email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setErr(response.data.message);
          setErrState(false);
          getEvents(true);
          setProgress(100);
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setProgress(100);
        }
      });
  }

  function getEvents(forceFetch = false) {
    setProgress(50);

    // Check if the data is cached in localStorage
    const cacheKey = `cachedEvents_${teamId}`;
    const cachedEvents = localStorage.getItem(cacheKey);

    if (!forceFetch && cachedEvents) {
      const parsedEvents = JSON.parse(cachedEvents);
      setEvents(parsedEvents.events);
      console.log("Data loaded from cache");

      // Update the number_of_events dynamically
      const numberOfEvents = parsedEvents.numberOfEvents;
      const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
      const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);
      const parsedTeamDetails = JSON.parse(cachedTeamDetails);
      parsedTeamDetails.team_details.number_of_events = numberOfEvents;

      // Update the cached data with the modified number_of_events
      const dataToCache = {
        events: parsedEvents.events,
        numberOfEvents,
      };
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

      // Render events based on the cached data
      const todayEvents = [];
      const upcomingEvents = [];
      const pastEvents = [];

      parsedEvents.events.forEach((event) => {
        if (
          new Date(event.date).setHours(0, 0, 0, 0) <
          new Date().setHours(0, 0, 0, 0)
        ) {
          pastEvents.push(event);
        } else if (
          new Date(event.date).setHours(0, 0, 0, 0) >
          new Date().setHours(0, 0, 0, 0)
        ) {
          upcomingEvents.push(event);
        } else {
          todayEvents.push(event);
        }
      });

      setTodaysEvents(todayEvents);
      setUpcomingEvents(upcomingEvents);
      setPastEvents(pastEvents);

      // return; // Exit early to avoid rendering from API call response
    }

    // Fetch events from the API if not found in the cache or forceFetch is true
    axios
      .post(`http://${auth.ip}:8000/api/getEventsWithStatus`, {
        team_unique_id: teamId,
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // Your logic to update events based on the API response
          const todayEvents = [];
          const upcomingEvents = [];
          const pastEvents = [];

          response.data.events.forEach((event) => {
            if (
              new Date(event.date).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0)
            ) {
              pastEvents.push(event);
            } else if (
              new Date(event.date).setHours(0, 0, 0, 0) >
              new Date().setHours(0, 0, 0, 0)
            ) {
              upcomingEvents.push(event);
            } else {
              todayEvents.push(event);
            }
          });

          setTodaysEvents(todayEvents);
          setUpcomingEvents(upcomingEvents);
          setPastEvents(pastEvents);

          // Update the number_of_events dynamically
          const numberOfEvents = response.data.events.length;
          const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
          const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);
          const parsedTeamDetails = JSON.parse(cachedTeamDetails);
          parsedTeamDetails.team_details.number_of_events = numberOfEvents;

          // Cache the data in localStorage with team-specific key
          const dataToCache = {
            events: response.data.events,
            numberOfEvents,
          };
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

          console.log("API called, data cached");
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
        }
      })
      .finally(() => {
        setProgress(100);
      });
  }

  // function getEvents() {
  //   setProgress(50);
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getEventsWithStatus`, {
  //       team_unique_id: teamId,
  //       user_email: auth.user.email,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         const todayEvents = [];
  //         const upcomingEvents = [];
  //         const pastEvents = [];

  //         response.data.events.forEach((event) => {
  //           if (
  //             new Date(event.date).setHours(0, 0, 0, 0) <
  //             new Date().setHours(0, 0, 0, 0)
  //           ) {
  //             pastEvents.push(event);
  //           } else if (
  //             new Date(event.date).setHours(0, 0, 0, 0) >
  //             new Date().setHours(0, 0, 0, 0)
  //           ) {
  //             upcomingEvents.push(event);
  //           } else {
  //             todayEvents.push(event);
  //           }
  //         });

  //         setTodaysEvents(todayEvents);
  //         setUpcomingEvents(upcomingEvents);
  //         setPastEvents(pastEvents);
  //         setProgress(100);
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //         setProgress(100);
  //       }
  //     });
  // }
  function getAnnouncementsInTeam(forceFetch = false) {
    setProgress(50);

    // Check if the data is cached in localStorage
    const cacheKey = `cachedAnnouncements_${teamId}`;
    const cachedAnnouncements = localStorage.getItem(cacheKey);

    if (!forceFetch && cachedAnnouncements) {
      const parsedAnnouncements = JSON.parse(cachedAnnouncements);
      setannouncements(parsedAnnouncements.announcements);
      console.log("Data loaded from cache");
      setProgress(100);
      // return; // Exit early to avoid rendering from API call response
    }

    // Fetch announcements from the API if not found in the cache or forceFetch is true
    axios
      .post(`http://${auth.ip}:8000/api/getAnnouncementsInTeam`, {
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // Your logic to update announcements based on the API response
          setannouncements(response.data.announcements);

          // Cache the data in localStorage with team-specific key
          const dataToCache = {
            announcements: response.data.announcements,
          };
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

          console.log("API called, data cached");
        } else {
          setErr(response.data.message);
          setErrState(true);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
        }
      })
      .finally(() => {
        setProgress(100);
      });
  }
  // function getAnnouncementsInTeam() {
  //   setProgress(50);
  //   axios
  //     .post(`http://${auth.ip}:8000/api/getAnnouncementsInTeam`, {
  //       team_unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setannouncements(response.data.announcements);
  //         setProgress(100);
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //         setProgress(100);
  //       }
  //     });
  // }

  function refresh() {
    getEvents(true);
    getAnnouncementsInTeam(true);
  }
  useEffect(() => {
    getEvents();
    getAnnouncementsInTeam();
  }, []);
  return (
    <>
      <LoadingBar
        color="#C39601"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-col gap-y-10 py-10">
        <TeamDetM refresh={refresh} />
        <div className=" flex md:flex-row flex-col-reverse gap-x-10  justify-center items-start gap-y-10  ">
          <div className="flex flex-col md:w-8/12 gap-y-5 mx-auto w-11/12 mb-10">
            <div
              className="cursor-pointer"
              onClick={() => setshowTodays(!showTodays)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg text-white ">
                  {/* <span
                    className="px-2 rounded-2xl mr-2 text-black"
                    style={{
                      backgroundColor: "#C39601",
                    }}
                  >
                    {todaysEvents.length}
                  </span> */}
                  Today's events
                </h1>
                <div className="flex flex-row items-center">
                  {todaysEvents.length > 0 && (
                    <span
                      className="px-2 rounded-full mr-2 text-black text-sm"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {todaysEvents.length}
                    </span>
                  )}
                  <svg
                    className={` ${showTodays ? "rotate-180" : ""}`}
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 2L8 10L0 2L2 0L8 6L14 0L16 2Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <hr className="opacity-50" />
            </div>
            {showTodays && (
              <>
                {todaysEvents && todaysEvents.length > 0 ? (
                  todaysEvents.map((event) => (
                    <div
                      key={event.title}
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
                          {auth.user.email === event.coordinator_email ? (
                            <>
                              <button
                                className="text-green-700 hover:underline"
                                onClick={() => saveAttendance(event.title)}
                              >
                                Save
                              </button>
                              <button
                                className="py-1 px-4 rounded-2xl"
                                style={{
                                  color: "#C39601",
                                  transition: "1ms",
                                  border: "1px solid #C39601",
                                }}
                                onClick={() => toggleattendance(event.title)}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#C39601";
                                  e.target.style.color = "#111111";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "initial";
                                  e.target.style.color = "#C39601";
                                }}
                              >
                                Mark Attendance
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="text-slate-100 cursor-not-allowed">
                                Locked
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col px-10 py-5 text-justify">
                        <p
                          className="font-light text-base"
                          style={{ color: "#FAFAFA" }}
                        >
                          {/* i don't know the description . don't mind.. wait why should I? yes phir bhi this is the description */}
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
                        {showAttendance === event.title && (
                          <>
                            <hr className="mt-5 opacity-50" />
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
                                      Attendance
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {participnts.map((participant, index) => (
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
                                            if (
                                              absentStudents.includes(email)
                                            ) {
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
                                            absentStudents.includes(
                                              participant.email
                                            )
                                              ? "text-red-700 hover:underline"
                                              : "text-green-700 hover:underline"
                                          }
                                        >
                                          {absentStudents.includes(
                                            participant.email
                                          )
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
                  <p className="text-white text-center">No events for today</p>
                )}
              </>
            )}
            <div
              className="cursor-pointer"
              onClick={() => setshowupcoming(!showupcoming)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg text-white ">
                  {/* <span
                    className="px-2 rounded-2xl mr-2 text-black"
                    style={{
                      backgroundColor: "#C39601",
                    }}
                  >
                    {upcomingEvents.length}
                  </span> */}
                  Upcoming events
                </h1>
                <div className="flex flex-row items-center">
                  {upcomingEvents.length > 0 && (
                    <span
                      className="px-2 rounded-full mr-2 text-black text-sm"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {upcomingEvents.length}
                    </span>
                  )}
                  <svg
                    className={` ${showTodays ? "rotate-180" : ""}`}
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 2L8 10L0 2L2 0L8 6L14 0L16 2Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <hr className="opacity-50" />
            </div>
            {showupcoming && (
              <>
                {upcomingEvents && upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.title}
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
                          {auth.user.email === event.coordinator_email ? (
                            <>
                              <button
                                className="py-1 px-4 rounded-2xl"
                                style={{
                                  color: "#C39601",
                                  transition: "1ms",
                                  border: "1px solid #C39601",
                                }}
                                onClick={() => {
                                  event.participated
                                    ? removeEventParticipant(
                                        auth.user.email,
                                        event.title
                                      )
                                    : addEventParticipant(event.title);
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
                                {event.participated ? "Leave" : "Participate"}
                              </button>
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
                              >
                                {showTable === event.title
                                  ? "Hide Details"
                                  : "See Details"}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="py-1 px-4 rounded-2xl"
                                style={{
                                  color: "#C39601",
                                  transition: "1ms",
                                  border: "1px solid #C39601",
                                }}
                                // onClick={() => addEventParticipant(event.title)}
                                onClick={() => {
                                  event.participated
                                    ? removeEventParticipant(
                                        auth.user.email,
                                        event.title
                                      )
                                    : addEventParticipant(event.title);
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
                                {event.participated ? "Leave" : "Participate"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col px-10 py-5 text-justify">
                        <p
                          className="font-light text-base"
                          style={{ color: "#FAFAFA" }}
                        >
                          {/* i don't know the description . don't mind.. wait why should I? yes phir bhi this is the description */}
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
                            <hr className="mt-5 opacity-50" />
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
                                  </tr>
                                </thead>
                                <tbody>
                                  {participnts.map((participnt, index) => (
                                    <tr
                                      key={participnt.id}
                                      className={`border-b dark:border-gray-700 `}
                                      style={{ backgroundColor: "#2f2f2f" }}
                                    >
                                      <td className="px-2 py-2">{index + 1}</td>
                                      <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {participnt.name}
                                      </td>
                                      <td className="px-2 py-2">
                                        {participnt.email}
                                      </td>
                                      <td className="px-2 py-2">
                                        {participnt.phone}
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
                  <p className="text-white text-center">No upcoming events</p>
                )}
              </>
            )}
            <div
              className="cursor-pointer"
              onClick={() => setshowpast(!showpast)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg text-white ">
                  {/* <span
                    className="px-2 rounded-2xl mr-2 text-black"
                    style={{
                      backgroundColor: "#C39601",
                    }}
                  >
                    {pastEvents.length}
                  </span> */}
                  Past events
                </h1>
                <div className="flex flex-row items-center">
                  {pastEvents.length > 0 && (
                    <span
                      className="px-2 rounded-full mr-2 text-black text-sm"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {pastEvents.length}
                    </span>
                  )}
                  <svg
                    className={` ${showTodays ? "rotate-180" : ""}`}
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 2L8 10L0 2L2 0L8 6L14 0L16 2Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <hr className="opacity-50" />
            </div>
            {showpast && (
              <>
                {pastEvents && pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <div
                      key={event.title}
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
                            {event.title}
                          </h5>
                        </div>
                        <div className="flex flex-row space-x-5">
                          {auth.user.email === event.coordinator_email ? (
                            <>
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
                              >
                                {showTable === event.title
                                  ? "Hide Details"
                                  : "See Details"}
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="text-slate-100 cursor-not-allowed">
                                Locked
                              </p>
                            </>
                          )}
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
                            <hr className="mt-5 opacity-50" />
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
                                      Attendance
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {participnts.map((participnt, index) => (
                                    <tr
                                      key={participnt.id}
                                      className={`border-b dark:border-gray-700 `}
                                      style={{ backgroundColor: "#2f2f2f" }}
                                    >
                                      <td className="px-2 py-2">{index + 1}</td>
                                      <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {participnt.name}
                                      </td>
                                      <td className="px-2 py-2">
                                        {participnt.email}
                                      </td>
                                      <td className="px-2 py-2">
                                        {participnt.phone}
                                      </td>

                                      <td className="px-2 py-2">
                                        <p
                                          className={
                                            absentStudents.includes(
                                              participnt.email
                                            )
                                              ? "text-red-700 cursor-default"
                                              : "text-green-700 cursor-default"
                                          }
                                        >
                                          {absentStudents.includes(
                                            participnt.email
                                          )
                                            ? "Absent"
                                            : "Present"}
                                        </p>
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
                  <p className="text-white text-center">No past events</p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col md:w-4/12  gap-y-5 mx-auto w-11/12">
            <div
              className=" space-y-2 rounded-2xl  px-5 py-4"
              style={{ backgroundColor: "#2F2F2F" }}
            >
              <h1
                className="text-lg leading-tight tracking-tight  md:text-lg "
                style={{ color: "#C39601" }}
              >
                Announcements
              </h1>
              <div
                className="  rounded-lg overflow-y-auto "
                style={{ backgroundColor: "#111111" }}
              >
                {announcements
                  .slice()
                  .reverse()
                  .map((announce) => (
                    <p
                      key={announce.id}
                      className="text-sm text-white w-full px-3 py-1 rounded-lg flex items-center justify-between "
                      style={{ borderBottom: "0.5px solid #C39601" }}
                    >
                      {announce.message}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
