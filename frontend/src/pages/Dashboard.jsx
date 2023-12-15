import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default function Dashboard() {
  const auth = useAuth();
  const [teamName, setteamName] = useState("");
  const [teamID, setteamID] = useState("");
  const [joinTeamID, setjoinTeamID] = useState("");

  const [teams, setTeams] = useState([]);
  const [MyTeams, setMyTeams] = useState([]);

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();
  const [progress, setProgress] = useState(0);

  // const getTeams = useCallback(
  //   (forceFetch = false) => {
  //     console.log("Memoized function recreated");

  //     const cacheKey = `cachedTeams_${auth.user.email}`;
  //     const cachedTeams = localStorage.getItem(cacheKey);

  //     if (!forceFetch && cachedTeams) {
  //       const parsedTeams = JSON.parse(cachedTeams);
  //       setTeams(parsedTeams.teams);
  //       setMyTeams(parsedTeams.myTeams);
  //       console.log("Data loaded from cache");
  //       console.log(parsedTeams);
  //       return; // Exit early to avoid API call
  //     }

  //     setProgress(50);

  //     axios
  //       .post(`http://${auth.ip}:8000/api/getAllUserTeams`, {
  //         user_email: auth.user.email,
  //       })
  //       .then((response) => {
  //         if (response.data.status === 200) {
  //           const myTeams = [];
  //           const notMyTeams = [];

  //           response.data.teams.forEach((team) => {
  //             if (team.organizer_email === auth.user.email) {
  //               myTeams.push(team);
  //             } else {
  //               notMyTeams.push(team);
  //             }
  //           });

  //           setMyTeams(myTeams);
  //           setTeams(notMyTeams);

  //           // Cache the data in localStorage with user-specific key
  //           const dataToCache = { teams: notMyTeams, myTeams };
  //           localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //           console.log("API called, data cached");
  //         } else {
  //           setErr(response.data.message);
  //           setErrState(true);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //         }

  //         setProgress(100);
  //       });
  //   },
  //   [auth.user.email]
  // );

  const getTeams = useCallback(
    (forceFetch = false) => {
      console.log("Memoized function recreated");

      const cacheKey = `cachedTeams_${auth.user.email}`;
      if (!forceFetch) {
        const cachedTeams = localStorage.getItem(cacheKey);
        if (cachedTeams) {
          const parsedTeams = JSON.parse(cachedTeams);
          setTeams(parsedTeams.teams);
          setMyTeams(parsedTeams.myTeams);
          console.log("Data loaded from cache");
          console.log(parsedTeams);
          // return; // Exit early to avoid API call
        }
      }

      setProgress(50);

      axios
        .post(`http://${auth.ip}:8000/api/getAllUserTeams`, {
          user_email: auth.user.email,
        })
        .then((response) => {
          if (response.data.status === 200) {
            setTeams(response.data.teams);

            const myTeams = [];
            const notMyTeams = [];

            response.data.teams.forEach((team) => {
              if (team.organizer_email === auth.user.email) {
                myTeams.push(team);
              } else {
                notMyTeams.push(team);
              }
            });

            setMyTeams(myTeams);
            setTeams(notMyTeams);

            // Cache the data in localStorage with user-specific key
            const dataToCache = { teams: notMyTeams, myTeams };
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

          setProgress(100);
        });
    },
    [auth.user.email]
  );

  // before caching
  // const getTeams = () => {
  //   setProgress(50);

  //   axios
  //     .post(`http://${auth.ip}:8000/api/getAllUserTeams`, {
  //       user_email: auth.user.email,
  //     })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         setTeams(response.data.teams);

  //         const myTeams = [];
  //         const notMyTeams = [];

  //         response.data.teams.forEach((team) => {
  //           if (team.organizer_email === auth.user.email) {
  //             myTeams.push(team);
  //           } else {
  //             notMyTeams.push(team);
  //           }
  //         });

  //         setMyTeams(myTeams);
  //         setTeams(notMyTeams);
  //       } else {
  //         setErr(response.data.message);
  //         setErrState(true);
  //         setTimeout(() => {
  //           setErr("");
  //           setErrState(false);
  //         }, 3000);
  //       }

  //       setProgress(100);
  //     });
  // };

  useEffect(() => {
    getTeams();
  }, []);
  // useEffect(() => {
  //   getTeams();
  // }, [getTeams]);

  return (
    <>
      <LoadingBar
        color="#C39601"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar />
      <Toast err={err} errState={errState} />
      <div className="container mx-auto max-w-screen-xl flex flex-col md:flex-row gap-x-10  justify-center items-start my-10">
        <div className="flex flex-col md:w-full mx-auto w-11/12">
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
                      className="flex flex-row gap-x-10  w-full pb-2 items-center"
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
                          <span className=" text-base font-light mr-7">
                            Owner:
                          </span>
                          {team.organizer_name}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-2">
                            Members:
                          </span>
                          &nbsp;{team.number_of_members - 1}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-7">
                            Events:
                          </span>
                          &nbsp;{team.number_of_events}
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
                      className="flex flex-row gap-x-10  w-full pb-2  items-center"
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
                          <span className=" text-base font-light mr-7">
                            Owner:
                          </span>
                          {team.organizer_name}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-2">
                            Members:
                          </span>
                          &nbsp;{team.number_of_members - 1}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center">
                          <span className=" text-base font-light mr-7">
                            Events:
                          </span>
                          &nbsp;{team.number_of_events}
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
        <JoinCreateTeam getTeams={getTeams} />
      </div>
    </>
  );
}
