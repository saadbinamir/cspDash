import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./common/NavBar";
import Footer from "./common/Footer";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUS from "./pages/AboutUS";
import Login from "./pages/Login";
import CreateAcc from "./pages/CreateAcc";

import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <Router>
        {/* <Nav /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about_us" element={<AboutUS />} />
          <Route path="/contact_us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Create_acc" element={<CreateAcc />} />
          <Route path="/dash" element={<Dashboard />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import Nav from "./common/NavBar";
// import Footer from "./common/Footer";
// import Home from "./pages/Home";
// import ContactUs from "./pages/ContactUs";
// import AboutUS from "./pages/AboutUS";
// import Login from "./pages/Login";
// import CreateAcc from "./pages/CreateAcc";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// function AppContent() {
//   const location = useLocation();

//   const showNavbarFooter = location.pathname !== "/dash";
//   const noNavFooter = location.pathname == "/dash";

//   return (
//     <>
//       {showNavbarFooter && <Nav />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about_us" element={<AboutUS />} />
//         <Route path="/contact_us" element={<ContactUs />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/Create_acc" element={<CreateAcc />} />
//         <Route path="/dash" element={<Dashboard />} />
//       </Routes>
//       {showNavbarFooter && <Footer />}
//     </>
//   );
// }

// export default App;
