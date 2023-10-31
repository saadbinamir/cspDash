import { React, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./utils/Auth";
import PrivateRoute from "./utils/PrivateRoute";

import Nav from "./common/NavBar";

import Footer from "./common/Footer";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUS from "./pages/AboutUS";
import Login from "./pages/Login";
import CreateAcc from "./pages/CreateAcc";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";

import Profile from "./pages/Profile";

import TeamAdmin from "./pages/TeamAdmin";
import TeamMember from "./pages/TeamMember";
import Users from "./pages/Users";
import MyEvents from "./pages/MyEvents";
import CoordinatorEvents from "./pages/CoordinatorEvents";

export default function App() {
  useEffect(() => {
    document.body.style.backgroundColor = "#1e1e1e";
  }, []);
  return (
    <AuthProvider>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={
            <>
              <Nav />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/about_us"
          element={
            <>
              <Nav />
              <AboutUS />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact_us"
          element={
            <>
              <Nav />
              <ContactUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Nav />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/Create_acc"
          element={
            <>
              <Nav />
              <CreateAcc />
              <Footer />
            </>
          }
        />
        {/* Private Routes */}
        <Route
          path="/dash"
          element={
            <>
              <PrivateRoute location={useLocation()}>
                <Dashboard />
              </PrivateRoute>
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId/admin"
          element={
            <PrivateRoute>
              <TeamAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <PrivateRoute>
              <TeamMember />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId/admin/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId/myEvents"
          element={
            <PrivateRoute>
              <MyEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId/coordinatorEvents"
          element={
            <PrivateRoute>
              <CoordinatorEvents />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
