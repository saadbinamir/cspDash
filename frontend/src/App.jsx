import { React } from "react";
import { Routes, Route } from "react-router-dom";
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
import Users from "./pages/Users";
import Post from "./pages/Post";
import Insights from "./pages/Insights";

export default function App() {
  return (
    // <Routes>

    <AuthProvider>
      {/* <Nav /> */}
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about_us" element={<AboutUS />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Create_acc" element={<CreateAcc />} />
        {/* Private Routes */}

        {/* <Route path="/dash" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/post" element={<Post />} />
        <Route path="/insights" element={<Insights />} /> */}

        <Route
          path="/dash"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/post"
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <Footer /> */}
    </AuthProvider>
  );
}
