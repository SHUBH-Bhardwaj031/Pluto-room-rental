import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddRoom from "./pages/AddRoom";
import FindRooms from "./pages/FindRooms";
import RoomDetails from "./pages/RoomDetails";
import MyPosts from "./pages/MyPosts";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SavedRooms from "./pages/SavedRooms";
import ProtectedRoute from "./components/ProtectedRoute";
import EditRoom from "./pages/EditRoom";

/* =====================================================
   GLOBAL PAGE LOADER
===================================================== */

const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">

        {/* Spinner */}
        <div className="w-12 h-12 border-2 border-zinc-800 border-t-indigo-500 border-r-purple-500 rounded-full animate-spin" />

        {/* Loading Text */}
        <p className="text-sm text-zinc-500">
          Loading Pluto...
        </p>

      </div>
    </div>
  );
};

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* Global Page Transition Loader */}
        <PageLoader />

        <MainLayout>
          <Routes>

            {/* =================================================
                PUBLIC ROUTES
            ================================================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/find-rooms"
              element={<FindRooms />}
            />

            <Route
              path="/rooms/:id"
              element={<RoomDetails />}
            />

            {/* =================================================
                AUTHENTICATION
            ================================================= */}

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
        </MainLayout>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;