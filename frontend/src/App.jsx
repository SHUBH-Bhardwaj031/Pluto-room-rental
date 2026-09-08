import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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
import AdminReports from "./pages/AdminReports";

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

        <Navbar />

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
              ADMIN
          ================================================= */}

          <Route
            path="/admin/reports"
            element={<AdminReports />}
          />

          {/* =================================================
              PROTECTED ROUTES
          ================================================= */}

          <Route element={<ProtectedRoute />}>

            {/* -----------------------------------------------
                ROOM DETAILS

                Main/new URL:
                /rooms/view-details/:id

                Backward-compatible URL:
                /rooms/:id

                Both render the same RoomDetails page.
            ------------------------------------------------ */}

            <Route
              path="/rooms/view-details/:id"
              element={<RoomDetails />}
            />

            <Route
              path="/rooms/:id"
              element={<RoomDetails />}
            />

            {/* -----------------------------------------------
                ADD ROOM
            ------------------------------------------------ */}

            <Route
              path="/add-room"
              element={<AddRoom />}
            />

            {/* -----------------------------------------------
                MY POSTS
            ------------------------------------------------ */}

            <Route
              path="/my-posts"
              element={<MyPosts />}
            />

            {/* -----------------------------------------------
                SAVED ROOMS
            ------------------------------------------------ */}

            <Route
              path="/saved-rooms"
              element={<SavedRooms />}
            />

            {/* -----------------------------------------------
                NOTIFICATIONS
            ------------------------------------------------ */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            {/* -----------------------------------------------
                PROFILE
            ------------------------------------------------ */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* -----------------------------------------------
                EDIT ROOM
            ------------------------------------------------ */}

            <Route
              path="/edit-room/:id"
              element={<EditRoom />}
            />

          </Route>

        </Routes>

        <Footer />

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;