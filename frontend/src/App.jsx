import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

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
import EditRoom from "./pages/EditRoom";


function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        {/* =========================
            UNIVERSAL PAGE LOADER
        ========================== */}

        <Loader />

        {/* =========================
            MAIN LAYOUT
        ========================== */}

        <MainLayout>

          <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/find-rooms"
              element={<FindRooms />}
            />

            <Route
              path="/rooms/view-details"
              element={<RoomDetails />}
            />

            {/* =========================
                AUTHENTICATION
            ========================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            {/* =========================
                PROTECTED ROUTES
            ========================== */}

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