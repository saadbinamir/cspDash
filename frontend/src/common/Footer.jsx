import React from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="shadow-lg " style={{ backgroundColor: "#2F2F2F" }}>
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to={"/"}
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 z-50"
          >
            <img src={Logo} className="w-10" alt="Logo" />
            <span className="ml-3 text-xl" style={{ color: "#C39601" }}>
              CSP Dashboard
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <Link
              to={"/about_us"}
              className="mr-5"
              style={{ transition: "1ms" }}
              onMouseEnter={(e) => {
                e.target.style.borderBottom = "1px solid #C39601";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottom = "0px";
              }}
            >
              About Us
            </Link>
            <Link
              to={"/contact_us"}
              style={{ transition: "1ms" }}
              onMouseEnter={(e) => {
                e.target.style.borderBottom = "1px solid #C39601";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottom = "0px";
              }}
            >
              Contact Us
            </Link>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023 cspDash™. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
