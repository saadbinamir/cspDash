import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../utils/Auth";
import Toast from "../common/Toast";
import JoinCreateTeam from "./JoinCreateTeam";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function TeamMember() {
  const { teamId } = useParams();
  const auth = useAuth();

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState();

  return (
    <>
      <Sidebar />
      <div className="p-5 sm:ml-64 ">
        <div className=" pr-4 mt-20 ">
          <Toast err={err} errState={errState} />

          <h1>Team member for Team ID: {teamId}</h1>
        </div>
      </div>
    </>
  );
}
