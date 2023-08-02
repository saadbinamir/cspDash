import React from "react";

import Sidebar from "../common/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <div className="p-4  mt-14">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
          </div>
          <div
            className="flex items-center justify-center h-48 mb-4 rounded"
            style={{ backgroundColor: "#2F2F2F" }}
          ></div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
            <div
              className="flex items-center justify-center h-24 rounded"
              style={{ backgroundColor: "#2F2F2F" }}
            ></div>
          </div>
          <div
            className="flex items-center justify-center h-48 mb-4 rounded "
            style={{ backgroundColor: "#2F2F2F" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
