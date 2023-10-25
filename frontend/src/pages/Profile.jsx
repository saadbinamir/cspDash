import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import axios from "axios";
import Toast from "../common/Toast";
import { Link } from "react-router-dom";

export default function Profile() {
  const auth = useAuth();

  const [email, setEmail] = useState(auth.user.email);
  const [name, setName] = useState(auth.user.name);
  const [phone, setPhone] = useState(auth.user.phone);
  const [address, setAddress] = useState(auth.user.address);
  const [password, setPassword] = useState("");
  const [newPass, setnewPass] = useState("");
  const [confirmNewPass, setconfirmNewPass] = useState("");

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState("");
  const [events, setEvents] = useState([]);
  const [creditHRS, setcreditHRS] = useState(0);

  const handleUpdate = (e) => {
    e.preventDefault();
    // console.log(auth.user);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("New Password:", newPass);
    console.log("CPassword:", confirmNewPass);

    if (!password) {
      setErr("Enter your password");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (password != auth.user.password) {
      setErr("Incorrect Password");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else if (newPass != confirmNewPass) {
      setErr("The Passwords do not match");
      setErrState(true);

      setTimeout(() => {
        setErr("");
        setErrState(false);
      }, 3000);
    } else {
      axios
        // .post("http://localhost:8000/api/updateProfile", {
        // .post("http://192.168.18.36:8000/api/updateProfile", {
        .post(`http://${auth.ip}:8000/api/updateProfile`, {
          name: name,
          email: email,
          phone: phone,
          address: address,
          newPass: newPass ? newPass : password,
        })
        .then((response) => {
          if (response.data.status === 200) {
            setErr(response.data.message);
            setErrState(false);
            auth.user = response.data.user;
            auth.user.password = password;
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
  };

  function getEvents() {
    axios
      // .post("http://localhost:8000/api/getEventsForUser", {
      // .post("http://192.168.18.36:8000/api/getEventsForUser", {
      .post(`http://${auth.ip}:8000/api/getEventsForUser`, {
        user_email: auth.user.email,
      })
      .then((response) => {
        if (response.data.status === 200) {
          const events = response.data.events;
          // Filter events where attendance_status is true
          const attendedEvents = events.filter(
            (event) => event.attendance_status === true
          );

          // Calculate the sum of credit hours for attended events
          const sumOfCreditHours = attendedEvents.reduce(
            (sum, event) => sum + parseFloat(event.event_credit_hours),
            0
          );
          setcreditHRS(sumOfCreditHours);
          setEvents(events);
          console.log(events);
          console.log(creditHRS);
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
  }, []);

  return (
    <>
      <Sidebar />
      <Toast err={err} errState={errState} />

      <div className="container mx-auto  max-w-screen-xl flex-col justify-center items-center space-y-10 my-10">
        <form
          onSubmit={handleUpdate}
          className="w-full rounded-2xl p-5 "
          style={{ backgroundColor: "#2f2f2f" }}
        >
          <div className="border-b border-gray-400 pb-5">
            <div className=" grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-6">
              <h2
                className="block mb-2 text-sm font-medium "
                style={{ color: "#C39601" }}
              >
                Personal Information
              </h2>

              <div className="sm:col-span-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium "
                  style={{ color: "#F6F6F6" }}
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    value={auth.user.email}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium "
                  style={{ color: "#F6F6F6" }}
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium "
                  style={{ color: "#F6F6F6" }}
                >
                  Phone #
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="given-name"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium "
                  style={{ color: "#F6F6F6" }}
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    autoComplete="street-address"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-6 border-b border-gray-400 pb-5">
            <div className="sm:col-span-3">
              <label
                htmlFor="new-pass"
                className="block mb-2 text-sm font-medium "
                style={{ color: "#F6F6F6" }}
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="new-pass"
                  id="new-pass"
                  autoComplete="given-name"
                  className="sm:text-sm rounded-lg  block w-full p-2.5 "
                  style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                  value={newPass}
                  onChange={(e) => setnewPass(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="confirm-new-pass"
                className="block mb-2 text-sm font-medium "
                style={{ color: "#F6F6F6" }}
              >
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirm-new-pass"
                  id="confirm-new-pass"
                  autoComplete="given-name"
                  className="sm:text-sm rounded-lg  block w-full p-2.5 "
                  style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                  value={confirmNewPass}
                  onChange={(e) => setconfirmNewPass(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6 ">
            <div>
              <input
                type="password"
                // name="new-pass"
                // id="new-pass"
                // autoComplete="given-name"
                className="sm:text-sm rounded-lg  block w-full p-2.5 "
                style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                placeholder="Enter your Password "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-2xl "
              style={{
                color: "#C39601",
                transition: "background-color 1ms, color 1ms, border 1ms",
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
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </form>
        <div
          className="w-full rounded-2xl p-5 flex flex-col space-y-5"
          style={{ backgroundColor: "#2f2f2f" }}
        >
          <h2
            className="block text-base font-medium "
            style={{ color: "#C39601" }}
          >
            My Events
          </h2>

          <table className="w-full text-sm text-center text-gray-400 rounded-2xl overflow-hidden">
            <thead
              className="text-xs uppercase text-gray-400 border-b border-opacity-50"
              style={{ backgroundColor: "#2f2f2f" }}
            >
              <tr>
                <th scope="col" className="px-2 py-3">
                  Sr.
                </th>
                <th scope="col" className="px-2 py-3">
                  Team Name
                </th>
                <th scope="col" className="px-2 py-3">
                  Event Title
                </th>
                <th scope="col" className="px-2 py-3">
                  Organization | Location
                </th>
                <th scope="col" className="px-2 py-3">
                  Date
                </th>
                <th scope="col" className="px-2 py-3">
                  Attendance
                </th>
                <th scope="col" className="px-2 py-3">
                  Credits
                </th>
                <th scope="col" className="px-2 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event.event_title}
                  className={`border-b dark:border-gray-700 `}
                  style={{ backgroundColor: "#2f2f2f" }}
                >
                  <td className="px-2 py-4 ">{index + 1}</td>
                  <td className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {event.team_name}
                  </td>
                  <td className="px-2 py-4 ">{event.event_title}</td>
                  <td className="px-2 py-4">
                    {event.event_organization} | {event.event_location}
                  </td>
                  <td className="px-2 py-4">{event.event_date}</td>
                  <td
                    className={
                      event.attendance_status
                        ? "text-green-700 px-2 py-4"
                        : "text-red-700 px-2 py-4"
                    }
                  >
                    {event.attendance_status ? "Present" : "Abesnt"}
                  </td>
                  <td className="px-2 py-4">
                    {event.attendance_status ? event.event_credit_hours : 0}
                  </td>

                  <td className="px-2 py-4">
                    <Link
                      to={`/teams/${event.team_unique_id}/myEvents`}
                      className="text-yellow-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row justify-end">
            <h2
              className="block text-base font-medium "
              style={{ color: "#C39601" }}
            >
              Total Credit Hours : {creditHRS}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
