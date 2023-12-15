import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import help from "../assets/help.json";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import LoadingBar from "react-top-loading-bar";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || "/dash";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();
  const [progress, setProgress] = useState(0);

  // const handleSignIn = async (e) => {
  //   e.preventDefault();
  //   setProgress(50);
  //   console.log("Email:", email);
  //   console.log("Password:", password);

  //   if (email === "") {
  //     setErr("Enter a valid Email");
  //     setErrState(true);
  //   } else if (password === "") {
  //     setErr("Enter a valid Password");
  //     setErrState(true);
  //   } else {
  //     axios
  //       .post(`http://${auth.ip}:8000/api/login`, {
  //         email: email,
  //         password: password,
  //       })
  //       .then((response) => {
  //         if (response.data.status === 200) {
  //           setErr(response.data.message);
  //           setErrState(false);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //           setProgress(100);

  //           response.data.user.password = password;
  //           auth.login(response.data.user);

  //           // Fetch user teams and other relevant data after successful login
  //           axios
  //             .post(`http://${auth.ip}:8000/api/getAllUserTeams`, {
  //               user_email: email,
  //             })
  //             .then((teamResponse) => {
  //               if (teamResponse.data.status === 200) {
  //                 const myTeams = [];
  //                 const notMyTeams = [];

  //                 teamResponse.data.teams.forEach((team) => {
  //                   if (team.organizer_email === email) {
  //                     myTeams.push(team);
  //                   } else {
  //                     notMyTeams.push(team);
  //                   }
  //                 });

  //                 // Cache the data in localStorage with user-specific key
  //                 const cacheKey = `cachedTeams_${email}`;
  //                 const dataToCache = { teams: notMyTeams, myTeams };
  //                 localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //                 console.log("User teams cached after login");

  //                 // Now, navigate to the dashboard after caching
  //                 navigate(redirectPath, { replace: true });
  //               }
  //             });
  //         } else {
  //           setErr(response.data.message);
  //           setErrState(true);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //           setProgress(100);
  //         }
  //       });
  //   }
  // };

  // const handleSignIn = async (e) => {
  //   e.preventDefault();
  //   setProgress(50);
  //   console.log("Email:", email);
  //   console.log("Password:", password);

  //   if (email === "") {
  //     setErr("Enter a valid Email");
  //     setErrState(true);
  //   } else if (password === "") {
  //     setErr("Enter a valid Password");
  //     setErrState(true);
  //   } else {
  //     axios
  //       .post(`http://${auth.ip}:8000/api/login`, {
  //         email: email,
  //         password: password,
  //       })
  //       .then((response) => {
  //         if (response.data.status === 200) {
  //           setErr(response.data.message);
  //           setErrState(false);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //           setProgress(100);

  //           // Fetch user teams and other relevant data after successful login
  //           axios
  //             .post(`http://${auth.ip}:8000/api/getAllUserTeams`, {
  //               user_email: email,
  //             })
  //             .then((teamResponse) => {
  //               if (teamResponse.data.status === 200) {
  //                 const myTeams = [];
  //                 const notMyTeams = [];

  //                 teamResponse.data.teams.forEach((team) => {
  //                   if (team.organizer_email === email) {
  //                     myTeams.push(team);
  //                   } else {
  //                     notMyTeams.push(team);
  //                   }
  //                 });

  //                 // Cache the data in localStorage with user-specific key
  //                 const cacheKey = `cachedTeams_${email}`;
  //                 const dataToCache = { teams: notMyTeams, myTeams };
  //                 localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

  //                 console.log("User teams cached after login");
  //               }
  //             });

  //           response.data.user.password = password;
  //           auth.login(response.data.user);
  //           navigate(redirectPath, { replace: true });
  //         } else {
  //           setErr(response.data.message);
  //           setErrState(true);
  //           setTimeout(() => {
  //             setErr("");
  //             setErrState(false);
  //           }, 3000);
  //           setProgress(100);
  //         }
  //       });
  //   }
  // };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setProgress(50);
    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "") {
      setErr("Enter a valid Email");
      setErrState(true);
    } else if (password == "") {
      setErr("Enter a valid Password");
      setErrState(true);
    } else {
      axios
        // .post("http://localhost:8000/api/login", {
        // .post("http://192.168.18.36:8000/api/login", {
        .post(`http://${auth.ip}:8000/api/login`, {
          email: email,
          password: password,
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
            response.data.user.password = password;
            auth.login(response.data.user);
            navigate(redirectPath, { replace: true });
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

  return (
    <>
      {/* <NavBar /> */}
      <LoadingBar
        color="#C39601"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Toast err={err} errState={errState} />
      <div className="md:flex  md:max-w-screen-xl mx-auto">
        <div className="md:w-1/2">
          <div className="flex flex-col items-center justify-center px-5  mx-auto my-32">
            <div
              className="w-full rounded-2xl shadow md:mt-0 "
              style={{ backgroundColor: "#2F2F2F" }}
            >
              <div className="p-6 space-y-4 md:space-y-6 ">
                <h1
                  className="text-xl leading-tight tracking-tight  md:text-2xl "
                  style={{ color: "#C39601" }}
                >
                  Sign In
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSignIn}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium "
                      style={{ color: "#F6F6F6" }}
                    >
                      Email / Enrollment
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      placeholder="name@company.com | 01-123456-001"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium"
                      style={{ color: "#F6F6F6" }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      // required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4"
                          // required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-400"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:underline "
                      style={{ color: "#C39601" }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-2xl w-full"
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
                    Sign In
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account yet?{" "}
                    <Link
                      to={"/create_acc"}
                      className="mx-2 hover:underline"
                      style={{ color: "#C39601" }}
                    >
                      Create now
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 md:block hidden ">
          <Lottie animationData={help} style={{ marginTop: "-80px" }} />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
