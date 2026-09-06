import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Plus,
  Bookmark,
  User,
  LogOut,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F3EA]/95 backdrop-blur-md border-b border-[#173F2B]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="h-[76px] flex items-center justify-between">

          {/* =========================
              LOGO
          ========================== */}

          <Link
            to="/"
            className="group flex items-center gap-3 shrink-0"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div
                className="
                  absolute inset-0
                  border border-[#173F2B]
                  rotate-45
                  rounded-[8px]
                  group-hover:rotate-90
                  transition-transform duration-500
                "
              />

              <span className="relative text-[15px] font-semibold text-[#173F2B] tracking-tight">
                P
              </span>
            </div>

            <div className="leading-none">
              <div className="text-[19px] font-semibold tracking-[-0.04em] text-[#171A18]">
                Pluto
              </div>

              <div className="hidden sm:block text-[8px] uppercase tracking-[0.22em] text-[#747872] mt-1">
                Find your space
              </div>
            </div>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}

          <nav className="hidden lg:flex items-center ml-12 mr-auto">

            {/* Home */}

            <Link
              to="/"
              className={`
                relative px-4 py-2
                text-[13px]
                transition-colors
                ${
                  isActive("/")
                    ? "text-[#173F2B] font-medium"
                    : "text-[#747872] hover:text-[#173F2B]"
                }
              `}
            >
              Home

              {isActive("/") && (
                <span className="absolute left-4 right-4 -bottom-[23px] h-[2px] bg-[#E6B84A]" />
              )}
            </Link>

            {/* Find Rooms */}

            <Link
              to="/find-rooms"
              className={`
                relative px-4 py-2
                text-[13px]
                transition-colors
                ${
                  isActive("/find-rooms")
                    ? "text-[#173F2B] font-medium"
                    : "text-[#747872] hover:text-[#173F2B]"
                }
              `}
            >
              Find Rooms

              {isActive("/find-rooms") && (
                <span className="absolute left-4 right-4 -bottom-[23px] h-[2px] bg-[#E6B84A]" />
              )}
            </Link>

            {/* Add Room */}

            <Link
              to="/add-room"
              className={`
                ml-3
                flex items-center gap-2
                px-4 py-2
                text-[13px] font-medium
                border
                transition-all
                ${
                  isActive("/add-room")
                    ? "bg-[#173F2B] text-white border-[#173F2B]"
                    : "border-[#173F2B]/20 text-[#173F2B] hover:bg-[#173F2B] hover:text-white hover:border-[#173F2B]"
                }
              `}
            >
              <Plus size={15} strokeWidth={2} />
              Add Room
            </Link>
          </nav>

          {/* =========================
              DESKTOP RIGHT
          ========================== */}

          <div className="hidden lg:flex items-center">

            {/* Saved */}

            <Link
              to="/saved-rooms"
              title="Saved Rooms"
              className={`
                relative w-10 h-10
                flex items-center justify-center
                transition-colors
                ${
                  isActive("/saved-rooms")
                    ? "text-[#173F2B]"
                    : "text-[#747872] hover:text-[#173F2B]"
                }
              `}
            >
              <Bookmark size={17} strokeWidth={1.8} />

              {isActive("/saved-rooms") && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E6B84A]" />
              )}
            </Link>

            {/* Notifications */}

            <Link
              to="/notifications"
              title="Notifications"
              className={`
                relative w-10 h-10
                flex items-center justify-center
                transition-colors
                ${
                  isActive("/notifications")
                    ? "text-[#173F2B]"
                    : "text-[#747872] hover:text-[#173F2B]"
                }
              `}
            >
              <Bell size={17} strokeWidth={1.8} />

              {isActive("/notifications") && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E6B84A]" />
              )}
            </Link>

            <div className="w-px h-6 bg-[#173F2B]/10 mx-3" />

            {/* Profile */}

            <Link
              to="/profile"
              className={`
                group flex items-center gap-3
                pl-2 pr-2 py-1.5
                transition-all
                ${
                  isActive("/profile")
                    ? "bg-white"
                    : "hover:bg-white/70"
                }
              `}
            >
              <div className="w-7 h-7 rounded-full bg-[#E9EFE7] border border-[#173F2B]/15 flex items-center justify-center">
                <User
                  size={14}
                  strokeWidth={1.8}
                  className="text-[#173F2B]"
                />
              </div>

              <span className="max-w-[110px] truncate text-[13px] text-[#26372C]">
                {user?.name || "Profile"}
              </span>

              <ArrowUpRight
                size={13}
                className="text-[#747872] group-hover:text-[#173F2B] transition-colors"
              />
            </Link>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="
                ml-2
                w-9 h-9
                flex items-center justify-center
                text-[#747872]
                hover:text-[#C96B45]
                transition-colors
              "
            >
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>

          {/* =========================
              MOBILE BUTTON
          ========================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              lg:hidden
              w-10 h-10
              flex items-center justify-center
              border border-[#173F2B]/15
              text-[#173F2B]
              hover:bg-white
              transition
            "
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} strokeWidth={1.7} />
            ) : (
              <Menu size={20} strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="
              lg:hidden
              overflow-hidden
              border-t border-[#173F2B]/10
              bg-[#F5F3EA]
            "
          >
            <div className="px-5 sm:px-8 py-5">

              {/* Intro */}

              <div className="flex items-center justify-between pb-5 mb-2 border-b border-[#173F2B]/10">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#747872]">
                    Navigation
                  </p>

                  <p className="text-sm text-[#26372C] mt-1">
                    Explore Pluto
                  </p>
                </div>

                <div className="text-[10px] text-[#747872] uppercase tracking-widest">
                  Menu
                </div>
              </div>

              {/* Home */}

              <Link
                to="/"
                onClick={closeMobile}
                className={`
                  flex items-center justify-between
                  py-4
                  border-b border-[#173F2B]/10
                  text-sm
                  transition
                  ${
                    isActive("/")
                      ? "text-[#173F2B] font-medium"
                      : "text-[#747872] hover:text-[#173F2B]"
                  }
                `}
              >
                <span>Home</span>

                {isActive("/") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                )}
              </Link>

              {/* Find Rooms */}

              <Link
                to="/find-rooms"
                onClick={closeMobile}
                className={`
                  flex items-center justify-between
                  py-4
                  border-b border-[#173F2B]/10
                  text-sm
                  transition
                  ${
                    isActive("/find-rooms")
                      ? "text-[#173F2B] font-medium"
                      : "text-[#747872] hover:text-[#173F2B]"
                  }
                `}
              >
                <span>Find Rooms</span>

                {isActive("/find-rooms") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                )}
              </Link>

              {/* Add Room */}

              <Link
                to="/add-room"
                onClick={closeMobile}
                className="
                  flex items-center justify-between
                  py-4
                  border-b border-[#173F2B]/10
                  text-sm
                  text-[#26372C]
                  hover:text-[#173F2B]
                  transition
                "
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Room
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-[#747872]"
                />
              </Link>

              <div className="h-4" />

              {/* Account */}

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#747872] mb-1">
                Your Pluto
              </p>

              <Link
                to="/saved-rooms"
                onClick={closeMobile}
                className={`
                  flex items-center justify-between
                  py-3.5
                  text-sm
                  transition
                  ${
                    isActive("/saved-rooms")
                      ? "text-[#173F2B] font-medium"
                      : "text-[#747872] hover:text-[#173F2B]"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Bookmark size={16} strokeWidth={1.7} />
                  Saved Rooms
                </span>

                {isActive("/saved-rooms") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                )}
              </Link>

              <Link
                to="/notifications"
                onClick={closeMobile}
                className={`
                  flex items-center justify-between
                  py-3.5
                  text-sm
                  transition
                  ${
                    isActive("/notifications")
                      ? "text-[#173F2B] font-medium"
                      : "text-[#747872] hover:text-[#173F2B]"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Bell size={16} strokeWidth={1.7} />
                  Notifications
                </span>

                {isActive("/notifications") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                )}
              </Link>

              <Link
                to="/profile"
                onClick={closeMobile}
                className={`
                  flex items-center justify-between
                  py-3.5
                  text-sm
                  transition
                  ${
                    isActive("/profile")
                      ? "text-[#173F2B] font-medium"
                      : "text-[#747872] hover:text-[#173F2B]"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <User size={16} strokeWidth={1.7} />
                  Profile
                </span>

                {isActive("/profile") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                )}
              </Link>

              {/* Logout */}

              <div className="mt-3 pt-3 border-t border-[#173F2B]/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex items-center gap-3
                    py-3.5
                    text-sm
                    text-[#C96B45]
                    hover:text-[#A84F30]
                    transition
                  "
                >
                  <LogOut size={16} strokeWidth={1.7} />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;