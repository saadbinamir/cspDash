import React, { useState } from "react";
import { Link } from "react-router-dom";
// import NavBar from "../common/NavBar";
// import Footer from "../common/Footer";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [err, setErr] = useState("");
  const [errState, setErrState] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    if (name === "") {
      setErr("Enter a valid Name");
      setErrState(true);
    } else if (email === "") {
      setErr("Enter a valid Email");
      setErrState(true);
    } else if (message == "") {
      setErr("Enter a message");
      message;
      setErrState(true);
    } else if (name != "" && email != "" && message != "") {
      setErr("Sent");
      setErrState(false);
    }
  };

  // React.useEffect(() => {
  //     document.documentElement.style.overflow = 'hidden';
  //     document.body.style.overflow = 'hidden';
  //     return () => {
  //         document.documentElement.style.overflow = 'auto';
  //         document.body.style.overflow = 'auto';
  //     };
  // }, []);

  return (
    <>
      {/* <NavBar /> */}
      <section
        className="text-gray-600 body-font relative"
        style={{ backgroundColor: "#f6f6f6" }}
      >
        <div className="container max-w-screen-xl px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div
            className="lg:w-2/3 md:w-1/2  rounded-3xl overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative"
            style={{ backgroundColor: "#2F2F2F" }}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.743209466858!2d73.02624967567041!3d33.71559303543163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbef8c137888d%3A0xc3ccfd031ad14ba6!2sBahria%20University%20-%20Islamabad%20Campus!5e0!3m2!1sen!2s!4v1686554178425!5m2!1sen!2s"
              style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
            ></iframe>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  ADDRESS
                </h2>
                <p className="mt-1">
                  Shangrilla Rd, E-8/1 E 8/1 E-8, Islamabad, Islamabad Capital
                  Territory
                </p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  EMAIL
                </h2>
                <a
                  href="mailto:saad.amir28@gmail.com"
                  className="text-indigo-500 leading-relaxed"
                >
                  saad.amir28@gmail.com
                </a>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed">+92 309 0188 840</p>
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-3xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0"
            style={{ backgroundColor: "#2F2F2F" }}
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                className="text-xl leading-tight tracking-tight md:text-2xl"
                style={{ color: "#C39601" }}
              >
                Feedback
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium "
                    style={{ color: "#F6F6F6" }}
                  >
                    Name
                  </label>
                  <input
                    type="name"
                    name="name"
                    id="name"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="John Doe"
                    // required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium "
                    style={{ color: "#F6F6F6" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 "
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="name@company.com"
                    // required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium "
                    style={{ color: "#F6F6F6" }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    className="sm:text-sm rounded-lg  block w-full p-2.5 resize-none  h-44"
                    style={{ backgroundColor: "#111111", color: "#F6F6F6" }}
                    placeholder="Type your message here"
                    // required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <p
                    id="error"
                    // style={errState ? { color: '#F6F6F6' } : { color: '#cc0000' }}
                    // className='text-sm font-light text-red-700 pt-2'>
                    // className={errState ? ' text-red-700 ' : ' text-green-700 '}
                    className={`text-sm font-light pt-2 ${
                      errState ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {err}
                  </p>
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-full w-full"
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
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}
