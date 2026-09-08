import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  Edit3,
  Eye,
  Home,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
     FETCH USER LISTINGS
  ===================================================== */

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
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
     UPDATE AVAILABILITY
  ===================================================== */

  const handleStatusToggle = async (room) => {
    if (updatingStatusId) return;

    const token =
      localStorage.getItem("plutoToken");

    if (!token) {
      navigate("/login");
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
        "Update listing status error:",
        error
      );

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
        navigate("/login");
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

      setRooms((prev) =>
        prev.filter(
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

  const avatarLetter = (
    user?.name || "U"
  )
    .charAt(0)
    .toUpperCase();

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">

          <div className="animate-pulse">

            <div className="h-3 w-32 bg-[#DDDCD3]" />

            <div className="mt-5 h-10 w-60 bg-[#DDDCD3]" />

            <div className="mt-3 h-4 w-80 bg-[#E5E4DC]" />

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-28 border border-[#DDDCD3] bg-white"
                />
              )
            )}

          </div>

          <div className="mt-10 space-y-4">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse border-b border-[#DDDCD3] bg-[#FAF9F4]"
                />
              )
            )}

          </div>

        </div>

      </main>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-[#D9D8CF] bg-[#FAF9F4]">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="flex min-h-[150px] flex-col gap-8 py-8 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8D2C8] bg-[#E9EFE7] text-sm font-bold text-[#173F2B]">
                  {avatarLetter}
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C96B45]">
                    Your Pluto
                  </p>

                  <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#173F2B] sm:text-4xl">
                    {user?.name ||
                      "Your profile"}
                  </h1>

                </div>

              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">

                {user?.email && (
                  <div className="flex items-center gap-2 text-xs text-[#747872]">
                    <Mail
                      size={14}
                      className="text-[#55745F]"
                    />
                    {user.email}
                  </div>
                )}

                {user?.phone && (
                  <div className="flex items-center gap-2 text-xs text-[#747872]">
                    <Phone
                      size={14}
                      className="text-[#55745F]"
                    />
                    {user.phone}
                  </div>
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/add-room")
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                bg-[#173F2B]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#102F20]
              "
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

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

        {/* =================================================
            STATS
        ================================================= */}

        <section className="border border-[#D9D8CF] bg-white">

          <div className="grid grid-cols-1 divide-y divide-[#D9D8CF] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">

            {/* TOTAL */}

            <div className="px-5 py-6 sm:px-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8C86]">
                Total listings
              </p>

              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                {rooms.length}
              </p>

              <p className="mt-2 text-xs text-[#969992]">
                Rooms you've posted
              </p>

            </div>

            {/* AVAILABLE */}

            <div className="px-5 py-6 sm:px-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8C86]">
                Available
              </p>

              <div className="mt-3 flex items-center gap-2">

                <p className="text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                  {availableRooms}
                </p>

                <CheckCircle2
                  size={16}
                  className="text-[#5B7D62]"
                />

              </div>

              <p className="mt-2 text-xs text-[#969992]">
                Visible to room seekers
              </p>

            </div>

            {/* VIEWS */}

            <div className="px-5 py-6 sm:px-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8C86]">
                Total views
              </p>

              <div className="mt-3 flex items-center gap-2">

                <p className="text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                  {totalViews}
                </p>

                <Eye
                  size={16}
                  className="text-[#C96B45]"
                />

              </div>

              <p className="mt-2 text-xs text-[#969992]">
                Across all your listings
              </p>

            </div>

            {/* UNAVAILABLE */}

            <div className="px-5 py-6 sm:px-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8C86]">
                Unavailable
              </p>

              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                {unavailableRooms}
              </p>

              <p className="mt-2 text-xs text-[#969992]">
                Temporarily hidden
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            LISTINGS
        ================================================= */}

        <section className="mt-12">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C96B45]">
                Published spaces
              </p>

              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#173F2B] sm:text-3xl">
                Your rooms
              </h2>

            </div>

            <span className="text-xs font-medium text-[#747872]">
              {rooms.length}{" "}
              {rooms.length === 1
                ? "listing"
                : "listings"}
            </span>

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              className={`mb-5 flex items-center justify-between gap-4 border px-4 py-3 ${
                messageType === "success"
                  ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D]"
                  : "border-[#E6B9A8] bg-[#FFF3EE] text-[#A44E31]"
              }`}
            >

              <p className="text-sm font-medium">
                {message}
              </p>

              <button
                type="button"
                onClick={() =>
                  setMessage("")
                }
                className="shrink-0 opacity-70 transition hover:opacity-100"
              >
                <X size={16} />
              </button>

            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {rooms.length === 0 ? (

            <div className="border border-[#D9D8CF] bg-[#FAF9F4] px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                <Home size={25} />
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96B45]">
                Nothing here yet
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#173F2B]">
                Share your first room
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#747872]">
                Have a room, flat or PG to share?
                Put it on Pluto and let people
                nearby discover it.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-room")
                }
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  bg-[#173F2B]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[4px_4px_0_#E6B84A]
                  transition
                  hover:bg-[#102F20]
                "
              >
                <Plus size={17} />
                List your first room
              </button>

            </div>

          ) : (

            /* =================================================
               LISTING ROWS
            ================================================= */

            <div className="border-t border-[#D9D8CF]">

              {rooms.map((room) => {

                const isAvailable =
                  room.status ===
                  "available";

                const isUpdating =
                  updatingStatusId ===
                  room._id;

                return (
                  <article
                    key={room._id}
                    className="
                      group
                      grid
                      grid-cols-1
                      gap-5
                      border-b
                      border-[#D9D8CF]
                      py-5
                      transition
                      hover:bg-[#FAF9F4]
                      md:grid-cols-[210px_1fr_auto]
                      md:gap-7
                    "
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/rooms/view-details/${room._id}`
                        )
                      }
                      className="
                        relative
                        h-48
                        w-full
                        overflow-hidden
                        bg-[#E9E8E0]
                        text-left
                        md:h-32
                        md:w-[210px]
                      "
                    >

                      {room.images?.length >
                      0 ? (

                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.035]
                          "
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center">

                          <Home
                            size={28}
                            className="text-[#AAAFA8]"
                          />

                        </div>

                      )}

                      {/* IMAGE STATUS */}

                      <span
                        className={`
                          absolute
                          bottom-3
                          left-3
                          px-2.5
                          py-1.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          ${
                            isAvailable
                              ? "bg-[#FFF3C9] text-[#73530C]"
                              : "bg-[#26372C] text-white"
                          }
                        `}
                      >
                        {isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>

                    </button>

                    {/* =================================================
                        DETAILS
                    ================================================= */}

                    <div className="min-w-0 flex flex-col justify-center">

                      <div className="flex items-start justify-between gap-5">

                        <div className="min-w-0">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/rooms/view-details/${room._id}`
                              )
                            }
                            className="
                              block
                              max-w-full
                              truncate
                              text-left
                              text-lg
                              font-semibold
                              tracking-[-0.025em]
                              text-[#173F2B]
                              transition
                              hover:text-[#C96B45]
                              sm:text-xl
                            "
                          >
                            {room.title}
                          </button>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">

                            <span className="flex items-center gap-1.5 text-xs text-[#747872]">

                              <MapPin
                                size={13}
                                className="text-[#55745F]"
                              />

                              {room.location
                                ?.locality ||
                                "Location"}

                              {room.location
                                ?.city
                                ? `, ${room.location.city}`
                                : ""}

                            </span>

                            <span className="text-xs text-[#969992]">
                              {room.roomType}
                            </span>

                          </div>

                        </div>

                        {/* RENT */}

                        <div className="shrink-0 text-right">

                          <div className="flex items-center justify-end text-[#173F2B]">

                            <IndianRupee
                              size={15}
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

                      {/* META */}

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                        <span className="flex items-center gap-1.5 text-[10px] text-[#8A8C86]">

                          <Eye size={13} />

                          {Number(
                            room.views || 0
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          views

                        </span>

                        <span className="text-[10px] text-[#8A8C86]">
                          {room.amenities
                            ?.length || 0}{" "}
                          amenities
                        </span>

                        {room.createdAt && (
                          <span className="text-[10px] text-[#A0A29B]">
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

                    <div className="flex flex-col justify-center gap-2 border-t border-[#E4E3DB] pt-4 md:min-w-[235px] md:border-t-0 md:pt-0">

                      {/* STATUS TOGGLE */}

                      <button
                        type="button"
                        disabled={
                          isUpdating
                        }
                        onClick={() =>
                          handleStatusToggle(
                            room
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          border
                          px-3
                          py-2.5
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.08em]
                          transition
                          disabled:cursor-wait
                          disabled:opacity-60
                          ${
                            isAvailable
                              ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D] hover:border-[#9EB3A2]"
                              : "border-[#D8D7CE] bg-white text-[#747872] hover:border-[#AEB0A8]"
                          }
                        `}
                      >

                        {isUpdating ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/20 border-t-current" />
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

                      {/* VIEW / EDIT / DELETE */}

                      <div className="grid grid-cols-3 gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/rooms/view-details/${room._id}`
                            )
                          }
                          title="View listing"
                          className="
                            flex
                            h-10
                            items-center
                            justify-center
                            gap-1
                            border
                            border-[#C9C9C0]
                            bg-white
                            text-[#26372C]
                            transition
                            hover:border-[#173F2B]
                            hover:bg-[#E9EFE7]
                          "
                        >
                          <Eye size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-[0.05em]">
                            View
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/edit-room/${room._id}`
                            )
                          }
                          title="Edit listing"
                          className="
                            flex
                            h-10
                            items-center
                            justify-center
                            gap-1
                            border
                            border-[#C9C9C0]
                            bg-white
                            text-[#747872]
                            transition
                            hover:border-[#173F2B]
                            hover:bg-[#E9EFE7]
                            hover:text-[#173F2B]
                          "
                        >
                          <Edit3 size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-[0.05em]">
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteId(
                              room._id
                            )
                          }
                          title="Delete listing"
                          className="
                            flex
                            h-10
                            items-center
                            justify-center
                            gap-1
                            border
                            border-[#E3C6BA]
                            bg-[#FFF9F6]
                            text-[#A85B43]
                            transition
                            hover:border-[#CDA18F]
                            hover:bg-[#F8EDE8]
                          "
                        >
                          <Trash2 size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-[0.05em]">
                            Delete
                          </span>
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <section className="mt-12 border border-[#D9D8CF] bg-[#E9EFE7]">

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between sm:p-8">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C96B45]">
                Keep sharing
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#173F2B] sm:text-2xl">
                Have another space to share?
              </h3>

              <p className="mt-2 text-sm text-[#5F6B62]">
                Add another listing and help
                someone find their next place.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/add-room")
              }
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                bg-[#E6B84A]
                px-5
                py-3
                text-sm
                font-bold
                text-[#173F2B]
                transition
                hover:bg-[#DDAF3F]
              "
            >
              <Plus size={17} />
              Add another room
            </button>

          </div>

        </section>

      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteId && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#102F20]/55
            p-5
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !deleting
            ) {
              setDeleteId(null);
            }
          }}
        >

          <div className="w-full max-w-md border border-[#D9D8CF] bg-[#FAF9F4] shadow-2xl">

            <div className="p-6 sm:p-7">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C96B45]">
                    Remove listing
                  </p>

                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#173F2B]">
                    Delete this room?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteId(null)
                  }
                  disabled={deleting}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-[#747872]
                    transition
                    hover:bg-white
                    hover:text-[#173F2B]
                    disabled:opacity-40
                  "
                >
                  <X size={18} />
                </button>

              </div>

              <div className="mt-5 flex items-start gap-3 border-l-2 border-[#C96B45] bg-[#FFF3EE] px-4 py-3">

                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#A85B43]"
                />

                <p className="text-xs leading-5 text-[#747872]">
                  This will permanently remove
                  the room listing and its uploaded
                  images. This action cannot be
                  undone.
                </p>

              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    setDeleteId(null)
                  }
                  disabled={deleting}
                  className="
                    flex-1
                    border
                    border-[#C9C9C0]
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-[#747872]
                    transition
                    hover:border-[#173F2B]
                    hover:text-[#173F2B]
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      deleteId
                    )
                  }
                  disabled={deleting}
                  className="
                    flex-1
                    bg-[#173F2B]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#C04F2C]
                    disabled:cursor-wait
                    disabled:opacity-50
                  "
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete listing"}
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

export default Profile;