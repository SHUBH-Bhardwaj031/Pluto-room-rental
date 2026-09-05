import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Search,
  Plus,
  Bookmark,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-indigo-600
                flex
                items-center
                justify-center
                shadow-lg
                shadow-indigo-600/20
              "
            >
              <Home
                size={21}
                strokeWidth={2.3}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block leading-tight">

              <div className="text-lg font-bold text-white">
                Pluto
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                Find Your Space
              </div>

            </div>
          </Link>

          {/* ================================================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================================= */}

          <nav className="hidden lg:flex items-center gap-1">

            {/* HOME */}

            <Link
              to="/"
              className={`
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                text-sm
                transition-all
                ${
                  isActive("/")
                    ? "text-white bg-zinc-900"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/70"
                }
              `}
            >
              <Home size={16} />
              Home
            </Link>

            {/* FIND ROOMS */}

            <Link
              to="/find-rooms"
              className={`
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                text-sm
                transition-all
                ${
                  isActive("/find-rooms")
                    ? "text-white bg-zinc-900"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/70"
                }
              `}
            >
              <Search size={16} />
              Find Rooms
            </Link>

            {/* ADD ROOM */}

            <Link
              to="/add-room"
              className="
                ml-2
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-500
                text-white
                text-sm
                font-semibold
                transition-all
                shadow-lg
                shadow-indigo-600/10
              "
            >
              <Plus size={17} />
              Add Room
            </Link>

          </nav>

          {/* ================================================= */}
          {/* DESKTOP RIGHT ACTIONS */}
          {/* ================================================= */}

          <div className="hidden lg:flex items-center gap-2">

            {/* NOTIFICATIONS */}

            <Link
              to="/notifications"
              title="Notifications"
              className={`
                w-10
                h-10
                rounded-xl
                border
                flex
                items-center
                justify-center
                transition-all
                ${
                  isActive("/notifications")
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
                }
              `}
            >
              <Bell size={17} />
            </Link>

            {/* SAVED */}

            <Link
              to="/saved-rooms"
              title="Saved Rooms"
              className={`
                w-10
                h-10
                rounded-xl
                border
                flex
                items-center
                justify-center
                transition-all
                ${
                  isActive("/saved-rooms")
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
                }
              `}
            >
              <Bookmark size={17} />
            </Link>

            {/* PROFILE */}

            <Link
              to="/profile"
              className={`
                ml-1
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                border
                transition-all
                ${
                  isActive("/profile")
                    ? "bg-zinc-900 border-zinc-700"
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                }
              `}
            >

              <div
                className="
                  w-7
                  h-7
                  rounded-lg
                  bg-indigo-600
                  flex
                  items-center
                  justify-center
                "
              >
                <User size={14} />
              </div>

              <span className="text-sm text-zinc-300 max-w-[100px] truncate">
                {user?.name || "Profile"}
              </span>

            </Link>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="
                ml-1
                w-10
                h-10
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950
                text-zinc-500
                flex
                items-center
                justify-center
                hover:text-red-400
                hover:border-red-500/20
                hover:bg-red-500/5
                transition-all
              "
            >
              <LogOut size={17} />
            </button>

          </div>

          {/* ================================================= */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              lg:hidden
              w-10
              h-10
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              text-zinc-400
              flex
              items-center
              justify-center
              hover:text-white
              transition-all
            "
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      <AnimatePresence>

        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="lg:hidden overflow-hidden border-t border-zinc-900"
          >

            <div className="px-4 py-4 space-y-2">

              {/* HOME */}

              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  ${
                    isActive("/")
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <Home size={18} />
                Home
              </Link>

              {/* FIND ROOMS */}

              <Link
                to="/find-rooms"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  ${
                    isActive("/find-rooms")
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <Search size={18} />
                Find Rooms
              </Link>

              {/* ADD ROOM */}

              <Link
                to="/add-room"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-500
                  text-white
                  text-sm
                  font-semibold
                "
              >
                <Plus size={18} />
                Add Room
              </Link>

              <div className="h-px bg-zinc-900 my-3" />

              {/* NOTIFICATIONS */}

              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  ${
                    isActive("/notifications")
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <Bell size={18} />
                Notifications
              </Link>

              {/* SAVED ROOMS */}

              <Link
                to="/saved-rooms"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  ${
                    isActive("/saved-rooms")
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <Bookmark size={18} />
                Saved Rooms
              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  ${
                    isActive("/profile")
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <User size={18} />
                Profile
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  text-red-400
                  hover:bg-red-500/10
                  text-left
                "
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </header>
  );
};

export default Navbar;