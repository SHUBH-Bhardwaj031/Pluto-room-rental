import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowUpRight,
  CheckCircle2,
  Edit3,
  Eye,
  Home,
  IndianRupee,
  MapPin,
  Plus,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

const MyPosts = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("error");

  /* =====================================================
     FETCH MY ROOMS
  ===================================================== */

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        navigate("/login", {
          replace: true,
          state: {
            from: "/my-posts",
          },
        });

        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms(
        Array.isArray(response.data?.rooms)
          ? response.data.rooms
          : []
      );
    } catch (error) {
      console.error(
        "Fetch my posts error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "plutoToken"
        );

        localStorage.removeItem(
          "plutoUser"
        );

        navigate("/login", {
          replace: true,
          state: {
            from: "/my-posts",
          },
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to load your listings."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusToggle = async (room) => {
    if (updatingStatusId) return;

    const token =
      localStorage.getItem("plutoToken");

    if (!token) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/my-posts",
        },
      });

      return;
    }

    const newStatus =
      room.status === "available"
        ? "unavailable"
        : "available";

    try {
      setUpdatingStatusId(room._id);
      setMessage("");

      const roomData = new FormData();

      roomData.append(
        "status",
        newStatus
      );

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/rooms/${room._id}`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRoom =
        response.data?.room;

      setRooms((prevRooms) =>
        prevRooms.map((item) =>
          item._id === room._id
            ? {
                ...item,
                status:
                  updatedRoom?.status ||
                  newStatus,
              }
            : item
        )
      );

      setMessage(
        newStatus === "available"
          ? "Listing is now available."
          : "Listing marked as unavailable."
      );

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Update room status error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "plutoToken"
        );

        localStorage.removeItem(
          "plutoUser"
        );

        navigate("/login", {
          replace: true,
          state: {
            from: "/my-posts",
          },
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update listing status."
      );

      setMessageType("error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (roomId) => {
    if (deleting) return;

    try {
      setDeleting(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        navigate("/login", {
          replace: true,
          state: {
            from: "/my-posts",
          },
        });

        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms((prevRooms) =>
        prevRooms.filter(
          (room) => room._id !== roomId
        )
      );

      setDeleteId(null);

      setMessage(
        "Listing deleted successfully."
      );

      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Delete room error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
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

      setMessage(
        error.response?.data?.message ||
          "Unable to delete this listing."
      );

      setMessageType("error");
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     STATS
  ===================================================== */

  const availableRooms = rooms.filter(
    (room) =>
      room.status === "available"
  ).length;

  const unavailableRooms =
    rooms.length - availableRooms;

  const totalViews = rooms.reduce(
    (total, room) =>
      total +
      (Number(room.views) || 0),
    0
  );

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

        <section className="border-b border-[#DDDCD3] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">

            <div className="animate-pulse">

              <div className="h-3 w-28 bg-[#E2E1D8]" />

              <div className="mt-5 h-10 w-52 bg-[#E2E1D8]" />

              <div className="mt-3 h-4 w-80 max-w-full bg-[#E8E7DF]" />

            </div>

          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">

          <div className="grid gap-4 sm:grid-cols-3">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse border border-[#DDDCD3] bg-white"
                />
              )
            )}

          </div>

          <div className="mt-8 space-y-4">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse border border-[#DDDCD3] bg-white"
                />
              )
            )}

          </div>

        </section>

      </main>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-[#DDDCD3] bg-white">

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <span className="flex h-9 w-9 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                  <Home size={17} />
                </span>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                    Your space
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-[#858982]">
                    Manage your listings
                  </p>

                </div>

              </div>

              <h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171A18] sm:text-5xl">
                My Posts.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#747872] sm:text-base">
                Manage, update and control the rooms
                you've listed on Pluto.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/add-room")
              }
              className="flex w-fit items-center gap-2 bg-[#173F2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102F20]"
            >
              <Plus size={16} />
              Add Room
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div
            className={`mb-7 flex items-center justify-between gap-4 border px-4 py-3 text-xs font-semibold ${
              messageType === "success"
                ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D]"
                : "border-[#E2C7BC] bg-[#F8EDE8] text-[#9A5037]"
            }`}
          >

            <span>{message}</span>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              className="shrink-0 opacity-60 transition hover:opacity-100"
              aria-label="Close message"
            >
              <X size={15} />
            </button>

          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-3">

          <StatCard
            label="Total listings"
            value={rooms.length}
            description="All rooms you've posted"
          />

          <StatCard
            label="Available"
            value={availableRooms}
            description="Currently visible to seekers"
            accent="green"
          />

          <StatCard
            label="Total views"
            value={totalViews}
            description={`${unavailableRooms} unavailable listing${
              unavailableRooms === 1
                ? ""
                : "s"
            }`}
          />

        </div>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mt-10 flex flex-col gap-3 border-b border-[#D8D7CE] pb-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#55745F]">
              Your listings
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-[-0.025em] text-[#171A18]">
              Manage rooms
            </h2>

          </div>

          <span className="text-xs font-semibold text-[#858982]">
            {rooms.length} listing
            {rooms.length === 1
              ? ""
              : "s"}
          </span>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {rooms.length === 0 ? (
          <EmptyState
            onAdd={() =>
              navigate("/add-room")
            }
          />
        ) : (
          <div className="divide-y divide-[#DDDCD3] border-b border-[#DDDCD3]">

            {rooms.map((room) => (
              <RoomRow
                key={room._id}
                room={room}
                updatingStatus={
                  updatingStatusId ===
                  room._id
                }
                onView={() =>
                  navigate(
                    `/rooms/view-details/${room._id}`
                  )
                }
                onEdit={() =>
                  navigate(
                    `/edit-room/${room._id}`
                  )
                }
                onDelete={() =>
                  setDeleteId(room._id)
                }
                onToggleStatus={() =>
                  handleStatusToggle(room)
                }
              />
            ))}

          </div>
        )}

      </section>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171A18]/50 px-5 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleting
            ) {
              setDeleteId(null);
            }
          }}
        >

          <div className="w-full max-w-md border border-[#D8D7CE] bg-white shadow-[0_25px_70px_rgba(23,26,24,0.18)]">

            <div className="flex items-start justify-between border-b border-[#E2E1D9] px-6 py-5">

              <div className="flex items-center gap-3">

                <span className="flex h-10 w-10 items-center justify-center bg-[#F8EDE8] text-[#B44E32]">
                  <AlertTriangle
                    size={19}
                  />
                </span>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A36A58]">
                    Permanent action
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#171A18]">
                    Delete listing?
                  </h3>

                </div>

              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteId(null)
                }
                className="text-[#858982] transition hover:text-[#171A18] disabled:opacity-40"
              >
                <X size={18} />
              </button>

            </div>

            <div className="px-6 py-5">

              <p className="text-sm leading-6 text-[#747872]">
                This will permanently remove the
                room listing and its uploaded images.
                This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    setDeleteId(null)
                  }
                  className="flex-1 border border-[#D0CFC6] bg-white px-5 py-3 text-sm font-bold text-[#747872] transition hover:border-[#A9AAA2] hover:text-[#34483A] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    handleDelete(deleteId)
                  }
                  className="flex flex-1 items-center justify-center gap-2 bg-[#A84D35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#8F402B] disabled:cursor-wait disabled:opacity-60"
                >

                  {deleting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Delete Room
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  label,
  value,
  description,
  accent,
}) => {
  return (
    <div className="border border-[#D8D7CE] bg-white p-5">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#858982]">
            {label}
          </p>

          <p
            className={`mt-3 text-3xl font-bold tracking-[-0.04em] ${
              accent === "green"
                ? "text-[#173F2B]"
                : "text-[#171A18]"
            }`}
          >
            {value}
          </p>

        </div>

        {accent === "green" && (
          <span className="flex h-8 w-8 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
            <CheckCircle2
              size={16}
            />
          </span>
        )}

      </div>

      <p className="mt-2 text-[11px] text-[#969992]">
        {description}
      </p>

    </div>
  );
};

/* =========================================================
   ROOM ROW
========================================================= */

const RoomRow = ({
  room,
  updatingStatus,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isAvailable =
    room.status === "available";

  return (
    <article className="group grid gap-5 py-6 md:grid-cols-[190px_1fr_auto] md:items-center md:gap-7">

      {/* =================================================
          IMAGE
      ================================================= */}

      <button
        type="button"
        onClick={onView}
        className="relative h-48 w-full overflow-hidden bg-[#E9E8E0] text-left md:h-32"
      >

        {room.images?.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-white text-[#55745F]">
                <Home size={22} />
              </div>

              <p className="mt-2 text-[10px] font-semibold text-[#858982]">
                No image
              </p>

            </div>

          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <span
          className={`absolute bottom-3 left-3 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
            isAvailable
              ? "bg-[#E6B84A] text-[#173F2B]"
              : "bg-[#333934] text-white"
          }`}
        >
          {isAvailable
            ? "Available"
            : "Unavailable"}
        </span>

      </button>

      {/* =================================================
          DETAILS
      ================================================= */}

      <div className="min-w-0">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <button
              type="button"
              onClick={onView}
              className="max-w-full text-left"
            >
              <h3 className="truncate text-lg font-bold tracking-[-0.015em] text-[#171A18] transition hover:text-[#173F2B]">
                {room.title}
              </h3>
            </button>

            <div className="mt-2 flex items-center gap-2 text-[#747872]">

              <MapPin
                size={14}
                className="shrink-0 text-[#55745F]"
              />

              <span className="truncate text-xs font-medium">
                {room.location?.locality ||
                  "Location"}

                {room.location?.city
                  ? `, ${room.location.city}`
                  : ""}
              </span>

            </div>

          </div>

          <div className="shrink-0 text-right">

            <div className="flex items-center justify-end text-[#173F2B]">

              <IndianRupee
                size={14}
                strokeWidth={2.5}
              />

              <span className="text-lg font-bold">
                {Number(
                  room.rent || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#969992]">
              / month
            </p>

          </div>

        </div>

        {/* AMENITIES */}

        <div className="mt-4 flex flex-wrap gap-2">

          <span className="border border-[#D8D7CE] bg-[#FAF9F4] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#55745F]">
            {room.roomType}
          </span>

          {room.amenities
            ?.slice(0, 3)
            .map(
              (amenity, index) => (
                <span
                  key={`${amenity}-${index}`}
                  className="border border-[#E2E1D9] bg-white px-2.5 py-1.5 text-[9px] font-medium text-[#858982]"
                >
                  {amenity}
                </span>
              )
            )}

        </div>

        {/* META */}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-[#969992]">

          <span>
            {Number(
              room.views || 0
            ).toLocaleString(
              "en-IN"
            )}{" "}
            views
          </span>

          {room.createdAt && (
            <span>
              Posted{" "}
              {formatDate(
                room.createdAt
              )}
            </span>
          )}

        </div>

      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="flex flex-col gap-2 border-t border-[#E2E1D9] pt-4 md:w-[175px] md:border-t-0 md:pt-0">

        {/* STATUS */}

        <button
          type="button"
          disabled={updatingStatus}
          onClick={onToggleStatus}
          className={`flex w-full items-center justify-center gap-2 border px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] transition disabled:cursor-wait disabled:opacity-60 ${
            isAvailable
              ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D] hover:border-[#9EB3A2]"
              : "border-[#D8D7CE] bg-white text-[#747872] hover:border-[#B7B8B0]"
          }`}
        >

          {updatingStatus ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current/20 border-t-current" />
              Updating...
            </>
          ) : (
            <>
              {isAvailable ? (
                <ToggleRight
                  size={17}
                />
              ) : (
                <ToggleLeft
                  size={17}
                />
              )}

              {isAvailable
                ? "Mark unavailable"
                : "Make available"}
            </>
          )}

        </button>

        {/* VIEW / EDIT */}

        <div className="grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={onView}
            className="flex items-center justify-center gap-1.5 border border-[#D8D7CE] bg-white px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#747872] transition hover:border-[#AEB0A8] hover:text-[#173F2B]"
          >
            <Eye size={14} />
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-1.5 border border-[#D8D7CE] bg-white px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#747872] transition hover:border-[#AEB0A8] hover:text-[#173F2B]"
          >
            <Edit3 size={14} />
            Edit
          </button>

        </div>

        {/* DELETE */}

        <button
          type="button"
          onClick={onDelete}
          className="flex w-full items-center justify-center gap-1.5 border border-[#E2C7BC] bg-[#FFF9F6] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#A85B43] transition hover:border-[#CDA18F] hover:bg-[#F8EDE8]"
        >
          <Trash2 size={14} />
          Delete listing
        </button>

      </div>

    </article>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  onAdd,
}) => {
  return (
    <div className="border-b border-[#D8D7CE] py-16 text-center sm:py-20">

      <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
        <Home size={27} />
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#55745F]">
        No listings yet
      </p>

      <h3 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-[#171A18]">
        Your space is waiting.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#858982]">
        Add your first room and let people looking
        for a place discover it on Pluto.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-7 inline-flex items-center gap-2 bg-[#173F2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102F20]"
      >
        <Plus size={16} />
        List a Room
        <ArrowUpRight size={15} />
      </button>

    </div>
  );
};

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDate = (date) => {
  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "";
  }
};

export default MyPosts;