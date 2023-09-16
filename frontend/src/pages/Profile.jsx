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
        <form onSubmit={handleUpdate} className="w-full ">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>

              <div className="sm:col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                    className="py-2 px-4 rounded-2xl border w-full"
                    value={auth.user.email}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="py-2 px-4 rounded-2xl border w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone #
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="given-name"
                    className="py-2 px-4 rounded-2xl border w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    autoComplete="street-address"
                    className="py-2 px-4 rounded-2xl border w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
            <div className="sm:col-span-3">
              <label
                htmlFor="new-pass"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="new-pass"
                  id="new-pass"
                  autoComplete="given-name"
                  className="py-2 px-4 rounded-2xl border w-full"
                  value={newPass}
                  onChange={(e) => setnewPass(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="new-pass"
                className=" text-sm font-medium leading-6 text-gray-900"
              >
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="new-pass"
                  id="new-pass"
                  autoComplete="given-name"
                  className="py-2 px-4 rounded-2xl border w-full"
                  value={confirmNewPass}
                  onChange={(e) => setconfirmNewPass(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* <p
              id="error"
              className={`text-sm font-light pt-2 ${
                errState ? "text-red-700" : "text-green-700"
              }`}
            >
              {err}
            </p> */}
          <div className="mt-6 flex items-center justify-end gap-x-6 ">
            <div>
              <input
                type="password"
                name="new-pass"
                id="new-pass"
                autoComplete="given-name"
                className="py-2 px-4 rounded-2xl border"
                placeholder="Enter your Password "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-2xl "
              style={{
                color: "#2F2F2F",
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
