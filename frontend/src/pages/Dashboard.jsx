import React from "react";

import Sidebar from "../common/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4  mt-14">Dashboard</div>
      </div>
    </>
  );
}
