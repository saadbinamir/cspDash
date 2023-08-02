import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from './common/NavBar';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUS from './pages/AboutUS';
import Login from './pages/Login';
import CreateAcc from './pages/CreateAcc';

export default function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about_us" element={<AboutUS />} />
          <Route path="/contact_us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Create_acc" element={<CreateAcc />} />
        </Routes>
      </Router >
    </>
  );
}
