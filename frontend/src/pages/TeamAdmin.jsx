import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function TeamAdmin() {
  const { teamId } = useParams();
  const auth = useAuth();

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();
  const [Links, setLinks] = useState([
    {
      title: "Teams",
      to: "/dash",
      sub: [
        {
          title: "Events",
          to: `/teams/${teamId}/admin`,
          active: true,
        },
        {
          title: "Users",
          to: `/teams/${teamId}/admin/users`,
        },
      ],
    },
    {
      title: "Test",
      to: "/about_us",
    },
  ]);

  return (
    <>
      <Sidebar Links={Links} />
      <div className="container mx-auto max-w-screen-xl flex flex-row gap-x-10  justify-center items-start my-10">
        {/* <Toast err={err} errState={errState} /> */}
        <div className="flex flex-col w-full">
          <h1>Team Admin Page for Team ID: {teamId}</h1>
        </div>
        {/* <JoinCreateTeam /> */}
      </div>
    </>
  );
}
