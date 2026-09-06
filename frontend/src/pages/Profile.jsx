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
  Mail,
  MapPin,
  Phone,
  Plus,
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
  const [message, setMessage] = useState("");

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("plutoToken");

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

      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Fetch my posts error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const handleDelete = async (roomId) => {
    try {
      setDeleting(true);

      const token = localStorage.getItem("plutoToken");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms((prev) =>
        prev.filter((room) => room._id !== roomId)
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Delete room error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete this listing."
      );
    } finally {
      setDeleting(false);
    }
  };

  const availableRooms = rooms.filter(
    (room) => room.status === "available"
  ).length;

  const unavailableRooms = rooms.filter(
    (room) => room.status !== "available"
  ).length;

  const totalViews = rooms.reduce(
    (total, room) => total + (Number(room.views) || 0),
    0
  );

  const avatarLetter = (user?.name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="border-b border-[#D9D8CF] bg-[#FAF9F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="min-h-[150px] flex flex-col md:flex-row md:items-end md:justify-between gap-8 py-8">

            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[#C96B45] uppercase mb-3">
                Pluto / Account
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] text-[#173F2B]">
                Your space.
              </h1>

              <p className="mt-3 text-sm text-[#747872] max-w-xl">
                Manage your account and everything you've shared
                with the Pluto community.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/add-room")}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                self-start
                md:self-auto
                bg-[#173F2B]
                text-white
                px-5
                py-3
                text-sm
                font-semibold
                hover:bg-[#102F20]
                transition
                shadow-[4px_4px_0_#E6B84A]
              "
            >
              <Plus size={17} />
              List a room
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">

        {/* =====================================================
            ACCOUNT BLOCK
        ===================================================== */}

        <section className="grid lg:grid-cols-[1fr_360px] border border-[#D9D8CF] bg-[#FAF9F4]">

          {/* LEFT */}

          <div className="p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">

              {/* AVATAR */}

              <div
                className="
                  w-24
                  h-24
                  shrink-0
                  bg-[#173F2B]
                  text-[#F4D77A]
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-semibold
                  border-[6px]
                  border-[#E9EFE7]
                  shadow-[5px_5px_0_#E6B84A]
                "
              >
                {avatarLetter}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#747872] mb-2">
                  Member
                </p>

                <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#173F2B]">
                  {user?.name || "User"}
                </h2>

                <p className="mt-2 text-sm text-[#747872]">
                  Sharing spaces with the Pluto community.
                </p>
              </div>

            </div>

            {/* CONTACT DETAILS */}

            <div className="grid sm:grid-cols-2 gap-3 mt-10">

              {user?.email && (
                <div className="border border-[#D9D8CF] bg-white p-4 flex items-center gap-3">

                  <div className="w-9 h-9 bg-[#E9EFE7] flex items-center justify-center shrink-0">
                    <Mail
                      size={16}
                      className="text-[#173F2B]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#A0A29C]">
                      Email
                    </p>

                    <p className="text-sm font-medium text-[#26372C] truncate mt-1">
                      {user.email}
                    </p>
                  </div>

                </div>
              )}

              {user?.phone && (
                <div className="border border-[#D9D8CF] bg-white p-4 flex items-center gap-3">

                  <div className="w-9 h-9 bg-[#FFF3D3] flex items-center justify-center shrink-0">
                    <Phone
                      size={16}
                      className="text-[#9A7013]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#A0A29C]">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-[#26372C] mt-1">
                      {user.phone}
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* RIGHT — QUICK LINKS */}

          <div className="border-t lg:border-t-0 lg:border-l border-[#D9D8CF] bg-[#173F2B] text-white p-6 sm:p-8">

            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B9C9BC]">
              Quick access
            </p>

            <div className="mt-6 divide-y divide-white/15">

              <button
                type="button"
                onClick={() => navigate("/saved-rooms")}
                className="
                  w-full
                  py-4
                  flex
                  items-center
                  justify-between
                  text-left
                  group
                "
              >
                <span className="flex items-center gap-3">
                  <Bookmark
                    size={17}
                    className="text-[#E6B84A]"
                  />
                  <span className="text-sm font-medium">
                    Saved rooms
                  </span>
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-white/40 group-hover:text-[#E6B84A] transition"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="
                  w-full
                  py-4
                  flex
                  items-center
                  justify-between
                  text-left
                  group
                "
              >
                <span className="flex items-center gap-3">
                  <span className="w-[17px] h-[17px] border border-[#E6B84A] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#E6B84A]" />
                  </span>

                  <span className="text-sm font-medium">
                    Notifications
                  </span>
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-white/40 group-hover:text-[#E6B84A] transition"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/find-rooms")}
                className="
                  w-full
                  py-4
                  flex
                  items-center
                  justify-between
                  text-left
                  group
                "
              >
                <span className="flex items-center gap-3">
                  <Home
                    size={17}
                    className="text-[#E6B84A]"
                  />
                  <span className="text-sm font-medium">
                    Find rooms
                  </span>
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-white/40 group-hover:text-[#E6B84A] transition"
                />
              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between mb-5">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C96B45] mb-2">
                Overview
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#173F2B]">
                Your activity
              </h2>
            </div>

            <p className="hidden sm:block text-xs text-[#8A8C86]">
              Live from your listings
            </p>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-[#D9D8CF]">

            {/* TOTAL */}

            <div className="py-6 sm:py-7 pr-5 sm:pr-7 border-r border-b lg:border-b-0 border-[#D9D8CF]">

              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#8A8C86]">
                Total listings
              </p>

              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                {rooms.length}
              </p>

            </div>

            {/* AVAILABLE */}

            <div className="py-6 sm:py-7 px-5 sm:px-7 lg:border-r border-b lg:border-b-0 border-[#D9D8CF]">

              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#8A8C86]">
                Available
              </p>

              <div className="flex items-center gap-2 mt-3">

                <p className="text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                  {availableRooms}
                </p>

                <CheckCircle2
                  size={16}
                  className="text-[#5B7D62]"
                />

              </div>

            </div>

            {/* VIEWS */}

            <div className="py-6 sm:py-7 pr-5 sm:pr-7 pl-5 sm:pl-7 lg:border-r border-[#D9D8CF]">

              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#8A8C86]">
                Total views
              </p>

              <div className="flex items-center gap-2 mt-3">

                <p className="text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                  {totalViews}
                </p>

                <Eye
                  size={16}
                  className="text-[#C96B45]"
                />

              </div>

            </div>

            {/* UNAVAILABLE */}

            <div className="py-6 sm:py-7 pl-5 sm:pl-7">

              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#8A8C86]">
                Unavailable
              </p>

              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#173F2B]">
                {unavailableRooms}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            LISTINGS
        ===================================================== */}

        <section className="mt-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C96B45] mb-2">
                Published spaces
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#173F2B]">
                Your rooms
              </h2>
            </div>

            <span className="text-xs font-medium text-[#747872]">
              {rooms.length}{" "}
              {rooms.length === 1 ? "listing" : "listings"}
            </span>

          </div>

          {/* ERROR */}

          {message && (
            <div className="mb-5 border border-[#E6B9A8] bg-[#FFF3EE] px-4 py-3 flex items-center justify-between gap-4">

              <p className="text-sm text-[#A44E31]">
                {message}
              </p>

              <button
                type="button"
                onClick={() => setMessage("")}
                className="text-[#A44E31] hover:text-[#71331F]"
              >
                <X size={17} />
              </button>

            </div>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="border-y border-[#D9D8CF] py-20 bg-[#FAF9F4]">

              <div className="flex justify-center items-center gap-3">

                <div
                  className="
                    w-5
                    h-5
                    border-2
                    border-[#D8D9D2]
                    border-t-[#173F2B]
                    rounded-full
                    animate-spin
                  "
                />

                <span className="text-sm text-[#747872]">
                  Loading your listings...
                </span>

              </div>

            </div>

          ) : rooms.length === 0 ? (

            /* EMPTY */

            <div className="border border-[#D9D8CF] bg-[#FAF9F4] py-20 px-6 text-center">

              <div className="w-16 h-16 mx-auto bg-[#E9EFE7] flex items-center justify-center">
                <Home
                  size={24}
                  className="text-[#173F2B]"
                />
              </div>

              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#C96B45] mt-6">
                Nothing here yet
              </p>

              <h3 className="text-2xl font-semibold tracking-[-0.025em] text-[#173F2B] mt-2">
                Share your first room
              </h3>

              <p className="text-sm text-[#747872] max-w-md mx-auto leading-6 mt-3">
                Have a room, flat or PG to share? Put it on Pluto
                and let people nearby discover it.
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-room")}
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  bg-[#173F2B]
                  text-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  hover:bg-[#102F20]
                  transition
                  shadow-[4px_4px_0_#E6B84A]
                "
              >
                <Plus size={17} />
                List your first room
              </button>

            </div>

          ) : (

            <div className="border-t border-[#D9D8CF]">

              {rooms.map((room) => (

                <article
                  key={room._id}
                  className="
                    group
                    grid
                    grid-cols-1
                    md:grid-cols-[210px_1fr_auto]
                    gap-5
                    md:gap-7
                    py-5
                    border-b
                    border-[#D9D8CF]
                    hover:bg-[#FAF9F4]
                    transition
                  "
                >

                  {/* IMAGE */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/rooms/${room._id}`)
                    }
                    className="
                      relative
                      h-48
                      md:h-32
                      w-full
                      md:w-[210px]
                      overflow-hidden
                      bg-[#E9E8E0]
                      text-left
                    "
                  >

                    {room.images?.length > 0 ? (

                      <img
                        src={room.images[0]}
                        alt={room.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-[1.035]
                          transition-transform
                          duration-500
                        "
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">
                        <Home
                          size={28}
                          className="text-[#AAAFA8]"
                        />
                      </div>

                    )}

                    <span
                      className={`
                        absolute
                        left-3
                        bottom-3
                        px-2.5
                        py-1.5
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        font-bold
                        ${
                          room.status === "available"
                            ? "bg-[#FFF3C9] text-[#73530C]"
                            : "bg-[#26372C] text-white"
                        }
                      `}
                    >
                      {room.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </button>

                  {/* DETAILS */}

                  <div className="min-w-0 flex flex-col justify-center">

                    <div className="flex items-start justify-between gap-5">

                      <div className="min-w-0">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/rooms/${room._id}`)
                          }
                          className="
                            block
                            max-w-full
                            text-left
                            text-lg
                            sm:text-xl
                            font-semibold
                            tracking-[-0.025em]
                            text-[#173F2B]
                            truncate
                            hover:text-[#C96B45]
                            transition
                          "
                        >
                          {room.title}
                        </button>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">

                          <span className="flex items-center gap-1.5 text-xs text-[#747872]">
                            <MapPin size={13} />
                            {room.location?.locality},{" "}
                            {room.location?.city}
                          </span>

                          <span className="text-xs text-[#9A9D96]">
                            {room.roomType}
                          </span>

                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-lg sm:text-xl font-semibold text-[#173F2B]">
                          ₹
                          {Number(
                            room.rent || 0
                          ).toLocaleString("en-IN")}
                        </p>

                        <p className="text-[10px] text-[#8A8C86] uppercase tracking-wider mt-1">
                          / month
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-5 mt-5">

                      <span className="flex items-center gap-1.5 text-xs text-[#8A8C86]">
                        <Eye size={13} />
                        {room.views || 0} views
                      </span>

                      {room.amenities?.length > 0 && (
                        <span className="text-xs text-[#8A8C86]">
                          +{room.amenities.length} amenities
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex md:flex-col items-center justify-end md:justify-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/rooms/${room._id}`)
                      }
                      className="
                        h-9
                        px-3
                        inline-flex
                        items-center
                        gap-2
                        border
                        border-[#C9C9C0]
                        bg-white
                        text-xs
                        font-semibold
                        text-[#26372C]
                        hover:border-[#173F2B]
                        hover:bg-[#E9EFE7]
                        transition
                      "
                    >
                      View
                      <ArrowUpRight size={13} />
                    </button>

                    <div className="flex items-center gap-1">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/edit-room/${room._id}`)
                        }
                        title="Edit listing"
                        className="
                          w-9
                          h-9
                          flex
                          items-center
                          justify-center
                          text-[#747872]
                          hover:bg-[#E9EFE7]
                          hover:text-[#173F2B]
                          transition
                        "
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(room._id)}
                        title="Delete listing"
                        className="
                          w-9
                          h-9
                          flex
                          items-center
                          justify-center
                          text-[#747872]
                          hover:bg-[#FFF0EA]
                          hover:text-[#C04F2C]
                          transition
                        "
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <section className="mt-12 border border-[#D9D8CF] bg-[#E9EFE7]">

          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C96B45]">
                Keep sharing
              </p>

              <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[#173F2B] mt-2">
                Have another space to share?
              </h3>

              <p className="text-sm text-[#5F6B62] mt-2">
                Add another listing and help someone find their next place.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/add-room")}
              className="
                shrink-0
                inline-flex
                items-center
                justify-center
                gap-2
                bg-[#E6B84A]
                text-[#173F2B]
                px-5
                py-3
                text-sm
                font-bold
                hover:bg-[#DDAF3F]
                transition
              "
            >
              <Plus size={17} />
              Add another room
            </button>

          </div>

        </section>

      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteId && (

        <div className="fixed inset-0 z-[100] bg-[#102F20]/55 backdrop-blur-sm flex items-center justify-center p-5">

          <div className="w-full max-w-md bg-[#FAF9F4] border border-[#D9D8CF] shadow-2xl">

            <div className="p-6 sm:p-7">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C96B45] mb-2">
                    Remove listing
                  </p>

                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#173F2B]">
                    Delete this room?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    text-[#747872]
                    hover:bg-[#E9EFE7]
                    hover:text-[#173F2B]
                    transition
                  "
                >
                  <X size={18} />
                </button>

              </div>

              <p className="text-sm text-[#747872] leading-6 mt-5">
                This listing and its uploaded images will be permanently
                removed. This action cannot be undone.
              </p>

              <div className="flex gap-3 mt-7">

                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="
                    flex-1
                    h-11
                    border
                    border-[#C9C9C0]
                    bg-white
                    text-sm
                    font-semibold
                    text-[#26372C]
                    hover:border-[#173F2B]
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleting}
                  className="
                    flex-1
                    h-11
                    bg-[#173F2B]
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-[#C04F2C]
                    disabled:opacity-50
                    transition
                  "
                >
                  {deleting ? "Deleting..." : "Delete listing"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
};

export default Profile;