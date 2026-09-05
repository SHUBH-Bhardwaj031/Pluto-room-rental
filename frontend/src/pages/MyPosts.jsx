import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit3,
  Trash2,
  MapPin,
  IndianRupee,
  Plus,
  Eye,
  Home,
  AlertTriangle,
} from "lucide-react";

const MyPosts = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  // ================= FETCH MY ROOMS =================

  const fetchMyRooms = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("plutoToken");

      if (!token) {
        setMessage("Please login first");
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
          "Unable to load your posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  // ================= DELETE =================

  const handleDelete = async (roomId) => {
    try {
      const token = localStorage.getItem("plutoToken");

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
    } catch (error) {
      console.error("Delete room error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete room"
      );

      setDeleteId(null);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white flex items-center justify-center">

        {/* BACKGROUND */}

        <div className="absolute inset-0 pointer-events-none">

          {/* Grid */}
          <div
            className="
              absolute inset-0
              opacity-[0.10]
              bg-[linear-gradient(rgba(139,92,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.5)_1px,transparent_1px)]
              bg-[size:55px_55px]
            "
          />

          {/* Glow */}
          <div
            className="
              absolute
              -top-40
              -left-40
              w-[500px]
              h-[500px]
              rounded-full
              bg-indigo-600/10
              blur-[140px]
            "
          />

          <div
            className="
              absolute
              top-[30%]
              -right-40
              w-[500px]
              h-[500px]
              rounded-full
              bg-purple-600/[0.07]
              blur-[150px]
            "
          />

        </div>

        {/* LOADING */}

        <div className="relative z-10 flex flex-col items-center gap-4">

          <div
            className="
              w-10
              h-10
              border-2
              border-zinc-800
              border-t-indigo-500
              rounded-full
              animate-spin
            "
          />

          <p className="text-sm text-zinc-500">
            Loading your posts...
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white py-10 sm:py-14">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* GRID */}

        <div
          className="
            absolute inset-0
            opacity-[0.10]
            bg-[linear-gradient(rgba(139,92,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.5)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* TOP LEFT GLOW */}

        <div
          className="
            absolute
            -top-48
            -left-40
            w-[550px]
            h-[550px]
            rounded-full
            bg-indigo-600/[0.08]
            blur-[150px]
          "
        />

        {/* RIGHT GLOW */}

        <div
          className="
            absolute
            top-[25%]
            -right-48
            w-[550px]
            h-[550px]
            rounded-full
            bg-purple-600/[0.06]
            blur-[160px]
          "
        />

        {/* BOTTOM GLOW */}

        <div
          className="
            absolute
            -bottom-48
            left-[30%]
            w-[500px]
            h-[500px]
            rounded-full
            bg-fuchsia-600/[0.035]
            blur-[150px]
          "
        />

      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Home
                  size={19}
                  className="text-indigo-400"
                />
              </div>

              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">
                Your Space
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              My Posts
            </h1>

            <p className="text-zinc-500 mt-2 max-w-xl">
              Manage the rooms you have posted on Pluto.
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
              bg-indigo-600
              hover:bg-indigo-500
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              text-sm
              transition-all
              shadow-lg
              shadow-indigo-600/10
            "
          >
            <Plus size={17} />
            Add New Room
          </button>

        </div>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {message}
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {rooms.length === 0 ? (
          <div
            className="
              min-h-[420px]
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-950/90
              backdrop-blur-xl
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
              shadow-2xl
              shadow-black/30
            "
          >

            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">

              <Home
                size={27}
                className="text-zinc-600"
              />

            </div>

            <h2 className="text-xl font-semibold">
              You haven't posted any rooms yet
            </h2>

            <p className="text-zinc-500 text-sm mt-2 max-w-md">
              Share a room with the Pluto community and
              help someone find their next space.
            </p>

            <button
              type="button"
              onClick={() => navigate("/add-room")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                bg-indigo-600
                hover:bg-indigo-500
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                text-sm
                transition-all
              "
            >
              <Plus size={17} />
              Post a Room
            </button>

          </div>
        ) : (
          <>

            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <div className="flex flex-wrap items-center gap-3 mb-6">

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-zinc-950/90
                  border
                  border-zinc-800
                  backdrop-blur-xl
                "
              >

                <span className="text-zinc-500 text-sm">
                  Total Posts
                </span>

                <span className="text-white font-semibold ml-2">
                  {rooms.length}
                </span>

              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-zinc-950/90
                  border
                  border-zinc-800
                  backdrop-blur-xl
                "
              >

                <span className="text-zinc-500 text-sm">
                  Available
                </span>

                <span className="text-emerald-400 font-semibold ml-2">
                  {
                    rooms.filter(
                      (room) =>
                        room.status === "available"
                    ).length
                  }
                </span>

              </div>

            </div>

            {/* ================================================= */}
            {/* ROOM GRID */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="
                    group
                    bg-zinc-950/95
                    backdrop-blur-xl
                    border
                    border-zinc-800
                    rounded-2xl
                    overflow-hidden
                    hover:border-zinc-700
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    shadow-xl
                    shadow-black/20
                  "
                >

                  {/* ================= IMAGE ================= */}

                  <div className="relative h-56 bg-zinc-900 overflow-hidden">

                    {room.images?.length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${room.images[0]}`}
                        alt={room.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-105
                          transition-transform
                          duration-500
                        "
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">

                        <Home
                          size={30}
                          className="text-zinc-700"
                        />

                      </div>
                    )}

                    {/* IMAGE OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* STATUS */}

                    <span
                      className={`
                        absolute
                        top-3
                        right-3
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-medium
                        backdrop-blur-md
                        border
                        ${
                          room.status === "available"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/15 text-red-400 border-red-500/20"
                        }
                      `}
                    >
                      {room.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    {/* ROOM TYPE */}

                    <span
                      className="
                        absolute
                        bottom-3
                        left-3
                        bg-black/75
                        backdrop-blur-md
                        text-white
                        text-xs
                        font-medium
                        px-3
                        py-1.5
                        rounded-full
                        border
                        border-white/10
                      "
                    >
                      {room.roomType}
                    </span>

                  </div>

                  {/* ================= CONTENT ================= */}

                  <div className="p-5">

                    {/* TITLE + RENT */}

                    <div className="flex items-start justify-between gap-4">

                      <h3 className="text-lg font-semibold text-white truncate">
                        {room.title}
                      </h3>

                      <div className="flex items-center text-white font-bold whitespace-nowrap">

                        <IndianRupee size={14} />

                        <span>
                          {room.rent}
                        </span>

                      </div>

                    </div>

                    {/* LOCATION */}

                    <div className="flex items-center gap-2 mt-3 min-w-0">

                      <MapPin
                        size={15}
                        className="text-zinc-600 shrink-0"
                      />

                      <span className="text-sm text-zinc-500 truncate">
                        {room.location?.locality},{" "}
                        {room.location?.city}
                      </span>

                    </div>

                    {/* AMENITIES */}

                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">

                        {room.amenities
                          .slice(0, 3)
                          .map((amenity, index) => (
                            <span
                              key={index}
                              className="
                                text-xs
                                text-zinc-400
                                bg-zinc-900
                                border
                                border-zinc-800
                                px-2.5
                                py-1
                                rounded-md
                              "
                            >
                              {amenity}
                            </span>
                          ))}

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-5 pt-4 border-t border-zinc-800 grid grid-cols-3 gap-2">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/rooms/${room._id}`
                          )
                        }
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1.5
                          py-2.5
                          rounded-xl
                          bg-zinc-900
                          border
                          border-zinc-800
                          text-zinc-400
                          hover:text-white
                          hover:border-zinc-700
                          transition-all
                          text-sm
                          font-medium
                        "
                      >
                        <Eye size={15} />
                        View
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/edit-room/${room._id}`
                          )
                        }
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1.5
                          py-2.5
                          rounded-xl
                          bg-indigo-500/10
                          border
                          border-indigo-500/20
                          text-indigo-400
                          hover:bg-indigo-500/15
                          hover:border-indigo-500/30
                          transition-all
                          text-sm
                          font-medium
                        "
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteId(room._id)
                        }
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1.5
                          py-2.5
                          rounded-xl
                          bg-red-500/10
                          border
                          border-red-500/20
                          text-red-400
                          hover:bg-red-500/15
                          hover:border-red-500/30
                          transition-all
                          text-sm
                          font-medium
                        "
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </>
        )}

      </div>

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {deleteId && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            px-4
            bg-black/75
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-zinc-950
              border
              border-zinc-800
              rounded-2xl
              p-6
              shadow-2xl
            "
          >

            {/* ICON */}

            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">

              <AlertTriangle
                size={22}
                className="text-red-400"
              />

            </div>

            {/* TITLE */}

            <h2 className="text-xl font-semibold text-white">
              Delete this room?
            </h2>

            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              This will permanently remove the room
              listing and its uploaded images. This action
              cannot be undone.
            </p>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-zinc-900
                  border
                  border-zinc-800
                  text-zinc-300
                  hover:text-white
                  hover:border-zinc-700
                  font-medium
                  text-sm
                  transition-all
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(deleteId)
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-500
                  text-white
                  font-semibold
                  text-sm
                  transition-all
                "
              >
                Delete Room
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default MyPosts;