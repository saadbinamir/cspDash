import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import help from "../assets/help.json";
import axios from "axios";

// import NavBar from "../common/NavBar";
// import Footer from "../common/Footer";

export default function CreateAcc() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  const handleCreateAcc = (e) => {
    e.preventDefault();

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("CPassword:", Cpassword);

    if (name == "") {
      setErr("Enter a valid Name");
      setErrState(true);
    } else if (email === "") {
      setErr("Enter a valid Email");
      setErrState(true);
    } else if (phone === "") {
      setErr("Enter a valid Phone #");
      setErrState(true);
    } else if (password == "") {
      setErr("Enter a valid Password");
      setErrState(true);
    } else if (Cpassword != password) {
      setErr("Passwords do not match");
      setErrState(true);
    } else {
      // setErr("Success");
      // setErrState(false);

      axios
        .post("http://localhost:8000/api/signup", {
          name: name,
          email: email,
          phone: phone,
          password: password,
        })
        .then((response) => {
          if (response.data.status === 201) {
            // setErr(response.data.message);
            setErr(
              <p>
                Account created sucessfully, please
                <Link
                  to={"/login"}
                  className="mx-1 underline"
                  // style={{ color: "#C39601" }}
                >
                  Sign In
                </Link>
                to continue.
              </p>
            );
            setErrState(false);

            // auth.login(response.data.user);
            // navigate(redirectPath, { replace: true });
          } else {
            setErr(response.data.message);
            setErrState(true);
          }
        });
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="flex h-screen" style={{ backgroundColor: "#F6F6F6" }}>
        <div className="w-1/2">
          <div className="flex flex-col items-center justify-center px-6  mx-auto md:h-screen lg:py-0 ">
            <div
              className="w-full rounded-3xl shadow md:mt-0 sm:max-w-md xl:p-0 border"
              style={{ backgroundColor: "#2F2F2F" }}
            >
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                  className="text-xl leading-tight tracking-tight  md:text-2xl "
                  style={{ color: "#C39601" }}
                >
                  Create Account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleCreateAcc}
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium "
                      style={{ color: "#F6F6F6" }}
                    >
                      Name
                    </label>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      placeholder="John Doe"
                      // required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
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
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium "
                      style={{ color: "#F6F6F6" }}
                    >
                      Phone #
                    </label>
                    <input
                      type="phone"
                      name="phone"
                      id="phone"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      placeholder="0300-1234567"
                      // required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  <div>
                    <label
                      htmlFor="Cpassword"
                      className="block mb-2 text-sm font-medium"
                      style={{ color: "#F6F6F6" }}
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="Cpassword"
                      id="Cpassword"
                      placeholder="••••••••"
                      className="sm:text-sm rounded-lg  block w-full p-2.5 "
                      style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                      // required
                      value={Cpassword}
                      onChange={(e) => setCPassword(e.target.value)}
                    />
                    <p
                      id="error"
                      className={`text-sm font-light pt-2 ${
                        errState ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {err}
                    </p>
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
                    Create Account
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?
                    <Link
                      to={"/login"}
                      className="mx-2 hover:underline"
                      style={{ color: "#C39601" }}
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div style={{ marginTop: "-140px" }}>
            <Lottie animationData={help} />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
