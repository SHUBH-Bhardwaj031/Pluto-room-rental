import {
  Bell,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
      FETCH NOTIFICATIONS
  ===================================================== */

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "plutoToken"
        );

        localStorage.removeItem(
          "plutoUser"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =====================================================
      MARK SINGLE AS READ
  ===================================================== */

  const markAsRead = async (notification) => {
    if (notification.read) return;

    try {
      const token =
        localStorage.getItem("plutoToken");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notification._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  /* =====================================================
      MARK ALL READ
  ===================================================== */

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      const token =
        localStorage.getItem("plutoToken");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  /* =====================================================
      NOTIFICATION ICON
  ===================================================== */

  const getNotificationIcon = (type) => {
    switch (type) {
      case "report_resolved":
        return (
          <ShieldCheck
            size={19}
            strokeWidth={1.8}
          />
        );

      case "report_dismissed":
        return (
          <XCircle
            size={19}
            strokeWidth={1.8}
          />
        );

      case "listing_takedown":
        return (
          <Ban
            size={19}
            strokeWidth={1.8}
          />
        );

      default:
        return (
          <Bell
            size={19}
            strokeWidth={1.8}
          />
        );
    }
  };

  /* =====================================================
      NOTIFICATION ICON BACKGROUND
  ===================================================== */

  const getIconClass = (type) => {
    switch (type) {
      case "report_resolved":
        return "bg-[#E9EFE7] text-[#356044]";

      case "report_dismissed":
        return "bg-[#F0EFEC] text-[#6C706A]";

      case "listing_takedown":
        return "bg-[#FBEDEA] text-[#A84F30]";

      default:
        return "bg-[#F7F6F0] text-[#55745F]";
    }
  };

  /* =====================================================
      LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EA]">
        <section className="border-b border-[#DDDCD3]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="animate-pulse">
              <div className="h-9 w-9 bg-[#DDDCD3]" />

              <div className="mt-5 h-12 w-72 bg-[#DDDCD3]" />

              <div className="mt-3 h-4 w-96 max-w-full bg-[#DDDCD3]" />
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="border border-[#DDDCD3] bg-white">
            <div className="animate-pulse px-6 py-20">
              <div className="mx-auto h-16 w-16 bg-[#F0EFE8]" />

              <div className="mx-auto mt-6 h-6 w-48 bg-[#F0EFE8]" />

              <div className="mx-auto mt-3 h-4 w-80 max-w-full bg-[#F0EFE8]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#DDDCD3] bg-[#F5F3EA]">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">

          <div className="flex items-end justify-between gap-6">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Bell size={17} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96B45]">
                  Stay updated
                </span>

              </div>

              <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
                Notifications
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#747872]">
                Updates about your rooms, saved
                spaces, reports, and activity on Pluto.
              </p>

            </div>

            {unreadCount > 0 && (
              <div className="hidden sm:flex items-center gap-3">

                <span className="bg-[#C96B45] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                  {unreadCount} new
                </span>

                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="flex h-10 w-10 items-center justify-center border border-[#D9DBD3] bg-white text-[#55745F] transition hover:bg-[#E9EFE7]"
                >
                  <CheckCheck size={18} />
                </button>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:px-10">

        <div className="border border-[#DDDCD3] bg-white">

          {/* TOP */}

          <div className="flex items-center justify-between gap-4 border-b border-[#E7E6DE] px-5 py-4 sm:px-6">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#979A93]">
                Inbox
              </p>

              <p className="mt-1 text-sm font-bold text-[#26372C]">
                {notifications.length === 0
                  ? "No notifications"
                  : `${notifications.length} notification${
                      notifications.length === 1
                        ? ""
                        : "s"
                    }`}
              </p>

            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#55745F] transition hover:text-[#173F2B]"
              >
                Mark all as read
              </button>
            )}

          </div>

          {/* ERROR */}

          {error && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700 sm:px-6">
              {error}
            </div>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {notifications.length > 0 ? (

            <div>

              {notifications.map(
                (notification) => (

                  <button
                    key={notification._id}
                    type="button"
                    onClick={() =>
                      markAsRead(notification)
                    }
                    className={`
                      flex
                      w-full
                      items-start
                      gap-4
                      border-b
                      border-[#E7E6DE]
                      px-5
                      py-5
                      text-left
                      transition
                      last:border-b-0
                      sm:px-6
                      ${
                        notification.read
                          ? "bg-white hover:bg-[#FAF9F4]"
                          : "bg-[#FAFBF7] hover:bg-[#F4F7F0]"
                      }
                    `}
                  >

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        ${getIconClass(
                          notification.type
                        )}
                      `}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                        <div className="flex items-center gap-2">

                          <h3 className="text-sm font-bold text-[#26372C]">
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C96B45]" />
                          )}

                        </div>

                        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0A39D]">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>

                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#747872]">
                        {notification.message}
                      </p>

                      {notification.room && (
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55745F]">
                          {notification.room.title}
                        </p>
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          ) : (

            /* =================================================
                EMPTY
            ================================================= */

            <div className="px-6 py-24 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F7F6F0] text-[#A0A39D]">
                <Bell size={27} />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight">
                Nothing here yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#747872]">
                When there's something important to tell
                you, your notifications will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/find-rooms")
                }
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  bg-[#173F2B]
                  px-5
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition
                  hover:bg-[#24583D]
                "
              >
                Explore rooms
                <ArrowRight size={15} />
              </button>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default Notifications;