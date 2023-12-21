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
import TeamDetA from "../common/TeamDetA";
import { CSVLink } from "react-csv";
import LoadingBar from "react-top-loading-bar";

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

  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const [events, setEvents] = useState([]);
  const [participnts, setparticipants] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);

  const [key, setKey] = useState(0);

  const [showTable, setShowTable] = useState(false);
  const [showAttendance, setshowAttendance] = useState(false);

  const [isEdit, setisEdit] = useState(false);

  const [showTodays, setshowTodays] = useState(true);
  const [showupcoming, setshowupcoming] = useState(false);
  const [showpast, setshowpast] = useState(false);

  const [announcements, setannouncements] = useState([]);
  const [mess, setmess] = useState();

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email/Enroll", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Attendance", key: "attendance" },
  ];
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

  const [err, setErr] = useState();
  const [errState, setErrState] = useState();

  const createEvent = (e) => {
    setProgress(50);
    e.preventDefault();
    if (!EventTitle) {
      setErr("Enter Event Title");
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
    }
    // else if (new Date(EventDate) < new Date()) {
    //   setErr("Enter a Valid Date");
    //   setErrState(true);

    //   setTimeout(() => {
    //     setErr("");
    //     setErrState(false);
    //   }, 3000);
    // }
    else {
      axios
        .post(`http://${auth.ip}:8000/api/createEvent`, {
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

            setEventTitle("");
            setEventDate("");
            setlocation("");
            setorganizationName("");
            setCredithours("");
            setCoordinatorEmail("");
            setcomments("");
            // Update the number_of_members in the cached team data
            const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
            const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);

            if (!isEdit) {
              if (cachedTeamDetails) {
                const parsedTeamDetails = JSON.parse(cachedTeamDetails);
                parsedTeamDetails.team_details.number_of_events += 1;

                // Update the cache with the modified data
                localStorage.setItem(
                  cacheKeyDetails,
                  JSON.stringify(parsedTeamDetails)
                );

                console.log("Number of members updated in cache");
              }
            }

            setKey(key + 1);
            getEvents(true);
            setisEdit(false);
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
  };
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
      .post(`http://${auth.ip}:8000/api/getEventsInTeam`, {
        team_unique_id: teamId,
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
  //     .post(`http://${auth.ip}:8000/api/getEventsInTeam`, {
  //       team_unique_id: teamId,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setEvents(response.data.events);
  //         console.log(response.data.events);

  // const todayEvents = [];
  // const upcomingEvents = [];
  // const pastEvents = [];

  // response.data.events.forEach((event) => {
  //   if (
  //     new Date(event.date).setHours(0, 0, 0, 0) <
  //     new Date().setHours(0, 0, 0, 0)
  //   ) {
  //     pastEvents.push(event);
  //   } else if (
  //     new Date(event.date).setHours(0, 0, 0, 0) >
  //     new Date().setHours(0, 0, 0, 0)
  //   ) {
  //     upcomingEvents.push(event);
  //   } else {
  //     todayEvents.push(event);
  //   }
  // });

  // setTodaysEvents(todayEvents);
  // setUpcomingEvents(upcomingEvents);
  // setPastEvents(pastEvents);
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
    // setProgress(50);

    // Check if the data is cached in localStorage
    const cacheKey = `cachedAnnouncements_${teamId}`;
    const cachedAnnouncements = localStorage.getItem(cacheKey);

    if (!forceFetch && cachedAnnouncements) {
      const parsedAnnouncements = JSON.parse(cachedAnnouncements);
      setannouncements(parsedAnnouncements.announcements);
      console.log("Data loaded from cache");
      setProgress(100);
      // return;
    }

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
      });
    // .finally(() => {
    //   setProgress(100);
    // });
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
  //         setmess("");
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
  function createAnnouncement(mess) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/createAnnouncement`, {
        team_unique_id: teamId,
        message: mess,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // setannouncements(response.data.announcements);
          getAnnouncementsInTeam(true);
          setmess("");
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
  function deleteannouncement(messid) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/deleteAnnouncement`, {
        team_unique_id: teamId,
        message_id: messid,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // setannouncements(response.data.announcements);
          getAnnouncementsInTeam(true);
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

          // Filter participants with attendance_status = false and extract their emails
          const absent = response.data.participants
            .filter((participant) => participant.attendance_status === false)
            .map((participant) => participant.email);

          // Now, absentStudents contains the emails of absent students
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
          getEventParticipants(event_title);
          // setParticipnts(response.data.participants);
          // console.log(response.data.participants);
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

  function deleteEvent(eventTitle) {
    setProgress(50);
    axios
      .post(`http://${auth.ip}:8000/api/deleteEvent`, {
        event_title: eventTitle,
        team_unique_id: teamId,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setErr(response.data.message);
          setErrState(false);
          setTimeout(() => {
            setErr("");
            setErrState(false);
          }, 3000);
          setEvents(response.data.events);
          // Update the number_of_members in the cached team data
          const cacheKeyDetails = `cachedTeamDetails_${teamId}`;
          const cachedTeamDetails = localStorage.getItem(cacheKeyDetails);

          if (cachedTeamDetails) {
            const parsedTeamDetails = JSON.parse(cachedTeamDetails);
            parsedTeamDetails.team_details.number_of_events -= 1;

            // Update the cache with the modified data
            localStorage.setItem(
              cacheKeyDetails,
              JSON.stringify(parsedTeamDetails)
            );

            console.log("Number of members updated in cache");
          }
          getEvents(true);
          setKey(key + 1);
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

  useEffect(() => {
    // document.body.style.backgroundColor = "#1e1e1e";
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
        <TeamDetA key={key} />

        <div className=" flex md:flex-row flex-col-reverse gap-x-10  justify-center items-start gap-y-10  ">
          <div className="flex flex-col md:w-8/12 gap-y-5 mx-auto w-11/12 ">
            <div
              className="cursor-pointer"
              onClick={() => setshowTodays(!showTodays)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg text-white ">
                  Today's events
                  {/* {todaysEvents.length > 0 && (
                    <span
                      className="px-2 rounded-2xl ml-2 text-black"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {todaysEvents.length}
                    </span>
                  )} */}
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
                      className="flex flex-col rounded-2xl shadow w-full"
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
                                type="submit"
                                className=" text-slate-200 hover:underline"
                                style={{
                                  transition: "border-bottom 1ms",
                                }}
                                onClick={() => {
                                  setisEdit(true);
                                  setEventTitle(event.title);
                                  setEventDate(event.date);
                                  setlocation(event.location);
                                  setorganizationName(event.organization_name);
                                  setCredithours(event.credit_hours);
                                  setCoordinatorEmail(event.coordinator_email);
                                  setcomments(event.comments);
                                }}
                              >
                                Edit
                              </button>
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
                              <button
                                type="submit"
                                className="text-slate-100 hover:underline"
                                style={{
                                  transition: "border-bottom 1ms",
                                }}
                                onClick={() => {
                                  // editEvent(event.title);
                                  setisEdit(true);
                                  setEventTitle(event.title);
                                  setEventDate(event.date);
                                  setlocation(event.location);
                                  setorganizationName(event.organization_name);
                                  setCredithours(event.credit_hours);
                                  setCoordinatorEmail(event.coordinator_email);
                                  setcomments(event.comments);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="submit"
                                className="text-red-700 hover:underline"
                                style={{
                                  transition: "border-bottom 1ms",
                                }}
                                onClick={() => deleteEvent(event.title)}
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
                                {showTable === event.title
                                  ? "Hide Details"
                                  : "See Details"}
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
                                        {participant.email.split("@")[0]}
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
                                        {participnt.email.split("@")[0]}
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
                                              ? "text-red-700"
                                              : "text-green-700"
                                          }
                                          disabled
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
                  <p className="text-center dark:text-white">
                    No events for today
                  </p>
                )}
              </>
            )}

            <div
              className="cursor-pointer"
              onClick={() => setshowupcoming(!showupcoming)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg  mt-3 text-white">
                  {/* {upcomingEvents.length > 0 && (
                    <span
                      className="px-2 rounded-2xl mr-2 text-black"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {upcomingEvents.length}
                    </span>
                  )} */}
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
                    className={` ${showupcoming ? "rotate-180" : ""}`}
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
                      className="flex flex-col rounded-2xl shadow w-full"
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
                          {new Date(event.date).setHours(0, 0, 0, 0) >
                            new Date().setHours(0, 0, 0, 0) && (
                            <button
                              type="submit"
                              className="text-slate-100 hover:underline"
                              style={{
                                transition: "border-bottom 1ms",
                              }}
                              onClick={() => {
                                // editEvent(event.title);
                                setisEdit(true);
                                setEventTitle(event.title);
                                setEventDate(event.date);
                                setlocation(event.location);
                                setorganizationName(event.organization_name);
                                setCredithours(event.credit_hours);
                                setCoordinatorEmail(event.coordinator_email);
                                setcomments(event.comments);
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            type="submit"
                            className="  text-red-700 hover:underline"
                            style={{
                              transition: "border-bottom 1ms",
                            }}
                            onClick={() => deleteEvent(event.title)}
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
                                      Actions
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
                                        {participnt.email.split("@")[0]}
                                      </td>
                                      <td className="px-2 py-2">
                                        {participnt.phone}
                                      </td>

                                      <td className="px-2 py-2">
                                        <button
                                          onClick={() =>
                                            removeEventParticipant(
                                              participnt.email,
                                              event.title
                                            )
                                          }
                                          className={
                                            new Date(event.date).setHours(
                                              0,
                                              0,
                                              0,
                                              0
                                            ) < new Date().setHours(0, 0, 0, 0)
                                              ? absentStudents.includes(
                                                  participnt.email
                                                )
                                                ? "text-red-700 hover:underline"
                                                : "text-green-700 hover:underline"
                                              : "text-red-700 hover:underline"
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
                                          {new Date(event.date).setHours(
                                            0,
                                            0,
                                            0,
                                            0
                                          ) < new Date().setHours(0, 0, 0, 0)
                                            ? absentStudents.includes(
                                                participnt.email
                                              )
                                              ? "Absent"
                                              : "Present"
                                            : "Remove"}
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
                  <p className="text-center dark:text-white">
                    No upcoming events
                  </p>
                )}
              </>
            )}
            <div
              className="cursor-pointer"
              onClick={() => setshowpast(!showpast)}
            >
              <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-lg  mt-3 text-white">
                  {/* {pastEvents.length > 0 && (
                    <span
                      className="px-2 rounded-2xl mr-2 text-black"
                      style={{
                        backgroundColor: "#C39601",
                      }}
                    >
                      {pastEvents.length}
                    </span>
                  )} */}
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
                    className={` ${showpast ? "rotate-180" : ""}`}
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
                      className="flex flex-col rounded-2xl shadow w-full"
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
                          <button
                            type="submit"
                            className="  text-red-700 hover:underline"
                            style={{
                              transition: "border-bottom 1ms",
                            }}
                            onClick={() => deleteEvent(event.title)}
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
                                      Email/Enroll
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
                                    <>
                                      <tr
                                        key={participnt.id}
                                        className={`border-b dark:border-gray-700 `}
                                        style={{ backgroundColor: "#2f2f2f" }}
                                      >
                                        <td className="px-2 py-2">
                                          {index + 1}
                                        </td>
                                        <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                          {participnt.name}
                                        </td>
                                        <td className="px-2 py-2">
                                          {participnt.email.split("@")[0]}
                                        </td>
                                        <td className="px-2 py-2">
                                          {participnt.phone}
                                        </td>

                                        <td className="px-2 py-2">
                                          <button
                                            className={
                                              absentStudents.includes(
                                                participnt.email
                                              )
                                                ? "text-red-700 hover:underline"
                                                : "text-green-700 hover:underline"
                                            }
                                            disabled
                                          >
                                            {absentStudents.includes(
                                              participnt.email
                                            )
                                              ? "Absent"
                                              : "Present"}
                                          </button>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {/* <CSVLink
                              // data={participnts}
                              data={participnts.map((participnt) => ({
                                name: participnt.name,
                                email: participnt.email,
                                phone: `'${participnt.phone}`,
                                attendance: absentStudents.includes(
                                  participnt.email
                                )
                                  ? "Absent"
                                  : "Present",
                              }))}
                              headers={headers}
                              filename={`${event.title} | ${event.date}.csv`}
                              config={{
                                bom: true,
                              }}
                            > */}
                            <CSVLink
                              data={[
                                [
                                  "Event Title",
                                  "Event Date",
                                  "Organization and Location",
                                  "Coordinator Email",
                                  "Credit Hours",
                                ],
                                [
                                  event.title,
                                  new Date(event.date).toLocaleDateString(),
                                  event.organization_name +
                                    " | " +
                                    event.location,
                                  event.coordinator_email,
                                  event.credit_hours,
                                ],
                                [],
                                ["Name", "Email", "Phone", "Attendance"],
                                ...participnts.map((participnt) => [
                                  participnt.name,
                                  participnt.email,
                                  `'${participnt.phone}`,
                                  absentStudents.includes(participnt.email)
                                    ? "Absent"
                                    : "Present",
                                ]),
                              ]}
                              filename={`${event.title} | ${event.date}.csv`}
                            >
                              <button
                                type="submit"
                                className="py-1 px-4 rounded-2xl mt-5 float-right"
                                style={{
                                  color: "#C39601",
                                  transition: "1ms",
                                  border: "1px solid #C39601",
                                }}
                                // onClick={() => toggleTable(event.title)}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#C39601";
                                  e.target.style.color = "#111111";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "initial";
                                  e.target.style.color = "#C39601";
                                }}
                              >
                                Export
                              </button>
                            </CSVLink>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center dark:text-white">No past events</p>
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
                className=" max-h-36 rounded-lg overflow-y-auto "
                style={{ backgroundColor: "#111111" }}
              >
                {announcements.map((announce) => (
                  <p
                    key={announce.id}
                    className="text-sm text-white w-full px-3 py-1 rounded-lg flex items-center justify-between "
                    style={{ borderBottom: "0.5px solid #C39601" }}
                  >
                    {announce.message}
                    <span
                      className="text-sm px-2 rounded-2xl text-black cursor-pointer"
                      style={{
                        backgroundColor: "maroon",
                      }}
                      onClick={() => deleteannouncement(announce.id)}
                    >
                      X
                    </span>
                  </p>
                ))}
              </div>
              <div className="flex flex-row ">
                <input
                  className="sm:text-sm rounded-lg w-full px-3 "
                  style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                  placeholder="Message"
                  value={mess}
                  onChange={(e) => setmess(e.target.value)}
                />
                <button
                  className=" py-1 pl-4 rounded-2xl hover:underline"
                  style={{
                    transition: "border-bottom 1ms",
                    color: "#C39601",
                  }}
                  onClick={() => {
                    {
                      mess
                        ? createAnnouncement(mess)
                        : setErr("Enter a message");
                      setErrState(true);

                      setTimeout(() => {
                        setErr("");
                        setErrState(false);
                      }, 3000);
                    }
                  }}
                >
                  Post
                </button>
              </div>
            </div>

            <div
              className=" space-y-4 rounded-2xl p-5 "
              style={{ backgroundColor: "#2F2F2F" }}
            >
              <h1
                className="text-xl leading-tight tracking-tight  md:text-lg "
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
                        min={new Date().setHours(0, 0, 0, 0)}
                        name="EventDate"
                        id="EventDate"
                        className="sm:text-sm rounded-2xl w-full px-4 py-2"
                        style={{
                          backgroundColor: "#111111",
                          color: "#F6F6F6",
                          colorScheme: "dark",
                        }}
                        value={EventDate}
                        onChange={(e) => {
                          setEventDate(e.target.value);
                          if (
                            new Date(e.target.value).setHours(0, 0, 0, 0) <=
                            new Date().setHours(0, 0, 0, 0)
                          ) {
                            setErr("Enter a Valid Date");
                            setErrState(true);

                            setTimeout(() => {
                              setErr("");
                              setErrState(false);
                            }, 3000);
                          }
                        }}
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
                        min="1"
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
                    {isEdit ? "Update" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
