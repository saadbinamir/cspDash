import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";

export default function Sidebar({ Links }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
    navigate("/");
  };

  return (
    <header
      className="shadow-lg"
      style={{ backgroundColor: "#2F2F2F", zIndex: 100 }}
    >
      <div className="container max-w-screen-xl mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
        <Link
          to={"/"}
          className="flex title-font font-medium items-center mb-4 md:mb-0 z-50"
        >
          <img src={Logo} className="w-10" alt="Logo" />
          <span className="ml-3 text-xl" style={{ color: "#C39601" }}>
            CSP Dashboard
          </span>
        </Link>
        <nav className="p-1 md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center z-50">
          {Links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mr-4 md:mr-8"
              style={{ color: "#F6F6F6", transition: "border-bottom 1ms" }}
              onMouseEnter={(e) => {
                e.target.style.borderBottom = "1px solid #C39601";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottom = "none";
              }}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <Link
          onClick={handleLogout}
          className="mx-4 md:mx-8 py-2 px-4 rounded-2xl z-50"
          style={{ color: "#F6F6F6", transition: "border-bottom 1ms" }}
          onMouseEnter={(e) => {
            e.target.style.borderBottom = "2px solid #C39601";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderBottom = "none";
          }}
        >
          Logout
        </Link>
        <Link
          to={"/profile"}
          className="py-2 px-4 rounded-2xl z-50"
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
        >
          {auth.user.name}
        </Link>
      </div>
    </header>
  );
}
