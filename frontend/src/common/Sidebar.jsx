import { React } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utils/Auth";
export default function Sidebar() {
  const navigate = useNavigate();
  const auth = useAuth();

  // const handleLogout = () => {
  //   auth.logout();
  //   navigate("/");
  // };

  const handleLogout = async () => {
    await auth.logout(); // Assuming auth.logout() is asynchronous
    navigate("/");
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <>
      <nav
        className="fixed top-0 z-50 w-full border-gray-200 border-b"
        style={{ backgroundColor: "#2F2F2F" }}
      >
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <Link
              to={"/"}
              className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 z-50"
            >
              <img src={Logo} className="w-10" alt="Logo" />
              <span className="ml-3 text-xl" style={{ color: "#C39601" }}>
                CSP Dashboard
              </span>
            </Link>
            <div className="relative">
              <button
                id="dropdownInformationButton"
                type="button"
                className="py-2 px-5 rounded-full z-50 "
                style={{
                  color: "#C39601",
                  transition: "1ms",
                  border: "2px solid #C39601",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#C39601";
                  e.target.style.color = "#111111";
                  toggleDropdown();
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "initial";
                  e.target.style.color = "#C39601";
                  // toggleDropdown();
                }}
              >
                Saad Bin Amir
              </button>
              {/* Dropdown menu */}
              {dropdownVisible && (
                <div
                  onMouseLeave={(e) => {
                    toggleDropdown();
                  }}
                  id="dropdownInformation"
                  className="absolute right-0 mt-5 z-10   rounded-lg shadow w-44"
                  style={{ backgroundColor: "#2F2F2F" }}
                >
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium truncate">{auth.user}</div>
                    {/* <div className="font-medium truncate">
                      saad.amir28@gmail.com
                    </div> */}
                  </div>
                  <Link
                    to={"/dash"}
                    className=" flex items-center p-2 text-sm px-4 py-2"
                    style={{ color: "#F6F6F6", transition: "1ms" }}
                    onMouseEnter={(e) => {
                      e.target.style.borderLeft = "5px solid #C39601";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderLeft = "0px";
                    }}
                  >
                    Profile
                  </Link>
                  <Link
                    to={"/dash"}
                    className=" flex items-center p-2 text-sm px-4 py-2"
                    style={{ color: "#F6F6F6", transition: "1ms" }}
                    onMouseEnter={(e) => {
                      e.target.style.borderLeft = "5px solid #C39601";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderLeft = "0px";
                    }}
                  >
                    Settings
                  </Link>
                  <hr className="opacity-50 mt-2" />

                  <Link
                    // to={"/dash"}
                    onClick={handleLogout}
                    className=" flex items-center p-2 text-sm px-4 my-2"
                    style={{ color: "#F6F6F6", transition: "1ms" }}
                    onMouseEnter={(e) => {
                      e.target.style.borderLeft = "5px solid #C39601";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderLeft = "0px";
                    }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        style={{ backgroundColor: "#2F2F2F" }}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto ">
          <Link
            to={"/dash"}
            className=" flex items-center p-2"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" className="mr-5">
              <path
                d="M8.33333 5V0H15V5H8.33333ZM0 8.33333V0H6.66667V8.33333H0ZM8.33333 15V6.66667H15V15H8.33333ZM0 15V10H6.66667V15H0Z"
                fill="#F6F6F6"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            to={"/users"}
            className=" flex items-center p-2"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            <svg width="15" height="12" viewBox="0 0 15 12" className="mr-5">
              <path
                d="M10.5 9.74998V11.25H0V9.74998C0 9.74998 0 6.74998 5.25 6.74998C10.5 6.74998 10.5 9.74998 10.5 9.74998ZM7.875 2.62498C7.875 2.1058 7.72105 1.59829 7.43261 1.16661C7.14417 0.734928 6.7342 0.398475 6.25454 0.199795C5.77489 0.00111471 5.24709 -0.050869 4.73789 0.0504172C4.22869 0.151703 3.76096 0.40171 3.39384 0.768823C3.02673 1.13594 2.77672 1.60367 2.67544 2.11287C2.57415 2.62207 2.62614 3.14987 2.82482 3.62952C3.0235 4.10918 3.35995 4.51915 3.79163 4.80759C4.22331 5.09602 4.73082 5.24998 5.25 5.24998C5.94619 5.24998 6.61387 4.97342 7.10616 4.48113C7.59844 3.98885 7.875 3.32117 7.875 2.62498ZM10.455 6.74998C10.9161 7.10679 11.2933 7.5603 11.5603 8.07861C11.8272 8.59691 11.9773 9.16742 12 9.74998V11.25H15V9.74998C15 9.74998 15 7.02748 10.455 6.74998ZM9.75 -2.16009e-05C9.23377 -0.00289614 8.72889 0.151445 8.3025 0.442479C8.75808 1.07903 9.00304 1.84219 9.00304 2.62498C9.00304 3.40776 8.75808 4.17093 8.3025 4.80748C8.72889 5.09851 9.23377 5.25285 9.75 5.24998C10.4462 5.24998 11.1139 4.97342 11.6062 4.48113C12.0984 3.98885 12.375 3.32117 12.375 2.62498C12.375 1.92879 12.0984 1.26111 11.6062 0.768823C11.1139 0.27654 10.4462 -2.16009e-05 9.75 -2.16009e-05Z"
                fill="#F6F6F6"
              />
            </svg>
            Users
          </Link>
          <Link
            to={"/post"}
            className=" flex items-center p-2"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" className="mr-5">
              <path
                d="M0 15V0H15V15H0ZM2.5 9.16667H12.5V7.5H2.5V9.16667ZM2.5 11.6667H12.5V10.4167H2.5V11.6667Z"
                fill="#F6F6F6"
              />
            </svg>
            Post
          </Link>
          <Link
            to={"/insights"}
            className=" flex items-center p-2"
            style={{ color: "#F6F6F6", transition: "1ms" }}
            onMouseEnter={(e) => {
              e.target.style.borderBottom = "1px solid #C39601";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottom = "0px";
            }}
          >
            <svg width="15" height="18" viewBox="0 0 15 18" className="mr-5">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7143 4.28571H15V17.1429H0V6.42857H4.28571V0H10.7143V4.28571ZM8.57143 2.14286H6.42857V15H8.57143V2.14286ZM10.7143 6.42857V15H12.8571V6.42857H10.7143ZM4.28571 8.57143V15H2.14286V8.57143H4.28571Z"
                fill="#F6F6F6"
              />
            </svg>
            Insights
          </Link>
        </div>
      </aside>
    </>
  );
}
