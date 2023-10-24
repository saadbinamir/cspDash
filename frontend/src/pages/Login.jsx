import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import help from "../assets/help.json";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || "/dash";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const handleSignIn = async (e) => {
    e.preventDefault();

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
        .post("http://localhost:8000/api/login", {
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
          }
        });
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <Toast err={err} errState={errState} />
      <div className="flex h-screen" style={{ backgroundColor: "#F6F6F6" }}>
        <div className="w-1/2">
          <div
            className="flex flex-col items-center justify-center px-6  mx-auto md:h-screen lg:py-0"
            style={{ marginTop: "-50px" }}
          >
            <div
              className="w-full rounded-3xl shadow md:mt-0 sm:max-w-md xl:p-0 border"
              style={{ backgroundColor: "#2F2F2F" }}
            >
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
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
                      required
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
        <div className="w-1/2">
          <Lottie animationData={help} style={{ marginTop: "-140px" }} />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
