import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import FindRooms from "./pages/FindRooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddRoom from "./pages/AddRoom";
import MyPosts from "./pages/MyPosts";
import SavedRooms from "./pages/SavedRooms";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import EditRoom from "./pages/EditRoom";

import AuthProvider from "./context/AuthContext";

/* =========================================================
   SCROLL TO TOP
========================================================= */

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
};

/* =========================================================
   APP
========================================================= */

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>

        <ScrollToTop />

        <Loader />

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Navbar />

        {/* =================================================
            ROUTES
        ================================================= */}

        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/find-rooms"
            element={<FindRooms />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* =================================================
              PROTECTED ROUTES
          ================================================= */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/rooms/view-details"
              element={<RoomDetails />}
            />

            <Route
              path="/add-room"
              element={<AddRoom />}
            />

            <Route
              path="/my-posts"
              element={<MyPosts />}
            />

            <Route
              path="/saved-rooms"
              element={<SavedRooms />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/edit-room/:id"
              element={<EditRoom />}
            />

          </Route>

        </Routes>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Footer />

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;