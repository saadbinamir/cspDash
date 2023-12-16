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
  const [showPassword, setShowPassword] = useState(false);
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
                    <div className="relative flex flex-row justify-between">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="sm:text-sm rounded-lg block w-full p-2.5"
                        style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <svg
                        width="20"
                        height="14"
                        viewBox="0 0 22 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword && (
                          <path
                            d="M10.83 6L14 9.16V9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6H10.83ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z"
                            fill="white"
                          />
                        )}
                        <path
                          d="M11 5C10.2044 5 9.44129 5.31607 8.87868 5.87868C8.31607 6.44129 8 7.20435 8 8C8 8.79565 8.31607 9.55871 8.87868 10.1213C9.44129 10.6839 10.2044 11 11 11C11.7956 11 12.5587 10.6839 13.1213 10.1213C13.6839 9.55871 14 8.79565 14 8C14 7.20435 13.6839 6.44129 13.1213 5.87868C12.5587 5.31607 11.7956 5 11 5ZM11 13C9.67392 13 8.40215 12.4732 7.46447 11.5355C6.52678 10.5979 6 9.32608 6 8C6 6.67392 6.52678 5.40215 7.46447 4.46447C8.40215 3.52678 9.67392 3 11 3C12.3261 3 13.5979 3.52678 14.5355 4.46447C15.4732 5.40215 16 6.67392 16 8C16 9.32608 15.4732 10.5979 14.5355 11.5355C13.5979 12.4732 12.3261 13 11 13ZM11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5Z"
                          fill="white"
                        />
                      </svg>
         
                    </div>

                    {/* <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      // required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    /> */}
                  </div>
                  {/* <div className="flex items-center justify-between">
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
                  </div> */}
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
