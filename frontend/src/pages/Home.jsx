import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import help from "../assets/help.json";
// import NavBar from "../common/NavBar";
// import Footer from "../common/Footer";
export default function Home() {
  useEffect(() => {
    document.body.style.backgroundColor = "#1e1e1e";
  }, []);

  return (
    <>
      {/* <NavBar /> */}
      <div>
        <div className="container max-w-screen-xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-yellow-50">
              <span style={{ color: "#C39601" }}>Creating </span> Opportunities,
              <br />
              Igniting <span style={{ color: "#C39601" }}>Hope</span>
            </h1>
            <p className="mb-8 leading-relaxed text-yellow-50">
              Join our mission to make a difference in the lives of those who
              need it most.
            </p>
            <div className="flex justify-center">
              <Link
                to={"/create_acc"}
                className=" py-2 px-4 rounded-2xl "
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
                Join the community
              </Link>
            </div>
          </div>
          <div style={{ marginTop: "-120px", marginRight: "-50px" }}>
            <Lottie animationData={help} />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
