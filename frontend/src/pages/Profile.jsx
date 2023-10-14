import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import axios from "axios";
import Toast from "../common/Toast";

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
      setErr("enter a valid password");
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
        .post("http://localhost:8000/api/updateProfile", {
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
  const [Links, setLinks] = useState([{ title: "Teams", to: "/dash" }]);
  return (
    <>
      <Sidebar Links={Links} />

      <div className="container mx-auto  max-w-screen-xl flex justify-center items-center mb-10">
        <Toast err={err} errState={errState} />
        <form
          onSubmit={handleUpdate}
          className="w-full rounded-2xl p-5 mt-10"
          style={{ backgroundColor: "#2f2f2f" }}
        >
          <div className="border-b border-gray-400 pb-12">
            <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <h2
                className="block mb-2 text-sm font-medium "
                style={{ color: "#F6F6F6" }}
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
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-400 pb-12">
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
      </div>
    </>
  );
}
