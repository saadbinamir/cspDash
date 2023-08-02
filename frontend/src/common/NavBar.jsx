import React from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
export default function NavBar() {
  return (
    <header
      className="shadow-lg"
      style={{ backgroundColor: "#2F2F2F", zIndex: 100 }}
    >
      <div className="container max-w-screen-xl mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center ">
        <Link
          to={"/"}
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 z-50"
        >
          <img src={Logo} className="w-10" alt="Logo" />
          <span className="ml-3 text-xl" style={{ color: "#C39601" }}>
            CSP Dashboard
          </span>
        </Link>
        <nav className=" p-11 md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center z-50">
          <Link
            to={"/"}
            className="mr-11"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            Home
          </Link>
          <Link
            to={"/about_us"}
            className="mr-11"
            style={{ color: "#F6F6F6", transition: "1ms" }}
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
            className="mr-11"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            Contact Us
          </Link>
        </nav>

        <Link
          to={"/login"}
          class="mx-11 py-2 px-4 rounded-full z-50"
          style={{ color: "#F6F6F6", transition: "1ms" }}
          onMouseEnter={(e) => {
            e.target.style.borderBottom = "2px solid #C39601";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderBottom = "0px";
          }}
        >
          Login
        </Link>
        <Link
          to={"/create_acc"}
          class=" py-2 px-4 rounded-full z-50"
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
        </Link>
      </div>
    </header>
  );
}
