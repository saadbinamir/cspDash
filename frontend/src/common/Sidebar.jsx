import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
    navigate("/");
  };

  return (
    <>
      {/* <div className=" h-0.5 w-full  dark:bg-neutral-800">
        <div className="h-1 bg-yellow-600" style={{ width: "75%" }}></div>
      </div> */}
      <header
        className="shadow-lg"
        style={{ backgroundColor: "#2F2F2F", zIndex: 100 }}
      >
        <div className="container max-w-screen-xl mx-auto flex flex-wrap p-5 flex-row items-center justify-between">
          <div className="flex flex-row">
            <Link
              to={"/"}
              className="flex title-font font-medium items-center mb-4 md:mb-0 z-50"
            >
              <img src={Logo} className="w-10" alt="Logo" />
              <span
                className="ml-3 text-xl md:block hidden"
                style={{ color: "#C39601" }}
              >
                CSP Dashboard
              </span>
            </Link>

            <nav className="md:mr-auto flex flex-wrap items-center text-base justify-center gap-x-10 pl-4 border-l border-gray-400 ml-4">
              <Link
                to={"/dash"}
                className={"text-white"}
                style={{
                  transition: "border-bottom 1ms",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = "1px solid #C39601";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = "none";
                }}
              >
                {/* {link.title} */}
                Teams
              </Link>
            </nav>
          </div>

          <div>
            <Link
              onClick={handleLogout}
              className=" md:mr-8 py-2 px-4 rounded-2xl z-50"
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
        </div>
      </header>
    </>
  );
}
