import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import help from "../assets/help.json";
// import NavBar from "../common/NavBar";
// import Footer from "../common/Footer";
import { useAuth } from "../utils/Auth";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || "/dash";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const handleSignIn = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "") {
      setErr("Enter a valid Email");
      setErrState(true);
    } else if (password == "") {
      setErr("Enter a valid Password");
      setErrState(true);
    } else if (email != "" && password != "") {
      setErr("Success");
      setErrState(false);
      auth.login(email);
      navigate(redirectPath, { replace: true });
    } else {
      // navigate("/dash");
      // setTimeout(() => {
      //   navigate("/dash");
      // }, 2000);
    }
  };

  return (
    <>
      {/* <NavBar /> */}
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
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      placeholder="name@company.com"
                      // required
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
                    <p
                      id="error"
                      // style={errState ? { color: '#F6F6F6' } : { color: '#cc0000' }}
                      // className='text-sm font-light text-red-700 pt-2'>
                      // className={errState ? ' text-red-700 ' : ' text-green-700 '}
                      className={`text-sm font-light pt-2 ${
                        errState ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {err}
                    </p>
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
                    className="py-2 px-4 rounded-full w-full"
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
