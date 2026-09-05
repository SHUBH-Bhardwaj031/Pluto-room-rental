import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Home,
  Plus,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  // ================= FETCH MY POSTS =================

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

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

      setRooms((prev) =>
        prev.filter((room) => room._id !== roomId)
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

  const availableRooms = rooms.filter(
    (room) => room.status === "available"
  ).length;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white py-10 sm:py-14">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Grid */}

        <div
          className="
            absolute inset-0
            opacity-[0.10]
            bg-[linear-gradient(rgba(139,92,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.5)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* Purple glow */}

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

        {/* Right glow */}

        <div
          className="
            absolute
            top-[30%]
            -right-48
            w-[550px]
            h-[550px]
            rounded-full
            bg-purple-600/[0.06]
            blur-[160px]
          "
        />

        {/* Bottom glow */}

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

        {/* ================================================= */}
        {/* PROFILE HEADER */}
        {/* ================================================= */}

        <div className="mb-8">

          <p className="text-indigo-400 text-sm font-medium mb-2">
            Pluto Community
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Profile
          </h1>

          <p className="text-zinc-500 mt-2">
            Manage your Pluto profile and room listings.
          </p>

        </div>

        {/* ================================================= */}
        {/* PROFILE CARD */}
        {/* ================================================= */}

        <div
          className="
            bg-zinc-950/90
            backdrop-blur-xl
            border
            border-zinc-800
            rounded-2xl
            p-6
            md:p-8
            shadow-2xl
            shadow-black/30
            mb-8
          "
        >

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* AVATAR */}

            <div
              className="
                w-20
                h-20
                rounded-2xl
                bg-indigo-600
                flex
                items-center
                justify-center
                shrink-0
                shadow-lg
                shadow-indigo-600/20
              "
            >
              <User size={34} />
            </div>

            {/* USER DETAILS */}

            <div className="flex-1">

              <h2 className="text-2xl font-bold">
                {user?.name || "User"}
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-3">

                {user?.email && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Mail size={15} />
                    {user.email}
                  </div>
                )}

                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Phone size={15} />
                    {user.phone}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">

          {/* TOTAL */}

          <div
            className="
              bg-zinc-950/90
              backdrop-blur-xl
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <span className="text-sm text-zinc-500">
                Total Posts
              </span>

              <Home
                size={18}
                className="text-indigo-400"
              />

            </div>

            <p className="text-3xl font-bold mt-3">
              {rooms.length}
            </p>

          </div>

          {/* AVAILABLE */}

          <div
            className="
              bg-zinc-950/90
              backdrop-blur-xl
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <span className="text-sm text-zinc-500">
                Available
              </span>

              <div className="w-2 h-2 rounded-full bg-emerald-400" />

            </div>

            <p className="text-3xl font-bold mt-3">
              {availableRooms}
            </p>

          </div>

          {/* ADD ROOM */}

          <button
            type="button"
            onClick={() => navigate("/add-room")}
            className="
              col-span-2
              md:col-span-1
              bg-indigo-600
              hover:bg-indigo-500
              rounded-2xl
              p-5
              text-left
              transition-all
              shadow-lg
              shadow-indigo-600/10
            "
          >

            <div className="flex items-center justify-between">

              <span className="font-semibold">
                Add a Room
              </span>

              <Plus size={20} />

            </div>

            <p className="text-sm text-indigo-200 mt-3">
              Share a new space with the community
            </p>

          </button>

        </div>

        {/* ================================================= */}
        {/* MY POSTS HEADER */}
        {/* ================================================= */}

        <div className="flex items-end justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold">
              My Posts
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Manage the rooms you have posted.
            </p>

          </div>

          <span className="text-sm text-zinc-600">
            {rooms.length} listing
            {rooms.length !== 1 ? "s" : ""}
          </span>

        </div>

        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {message}
          </div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (
          <div
            className="
              min-h-[300px]
              bg-zinc-950/90
              border
              border-zinc-800
              rounded-2xl
              flex
              flex-col
              items-center
              justify-center
            "
          >

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

            <p className="text-sm text-zinc-500 mt-4">
              Loading your posts...
            </p>

          </div>
        ) : rooms.length === 0 ? (

          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */

          <div
            className="
              min-h-[350px]
              bg-zinc-950/90
              backdrop-blur-xl
              border
              border-zinc-800
              rounded-2xl
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-zinc-900
                border
                border-zinc-800
                flex
                items-center
                justify-center
              "
            >
              <Home
                size={28}
                className="text-zinc-600"
              />
            </div>

            <h3 className="text-xl font-semibold mt-5">
              No posts yet
            </h3>

            <p className="text-zinc-500 text-sm mt-2 max-w-md">
              You haven't posted any rooms yet.
              Share your first room with the Pluto community.
            </p>

            <button
              type="button"
              onClick={() => navigate("/add-room")}
              className="
                mt-6
                flex
                items-center
                gap-2
                bg-indigo-600
                hover:bg-indigo-500
                px-5
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              <Plus size={17} />
              Post a Room
            </button>

          </div>

        ) : (

          /* ================================================= */
          /* POSTS GRID */
          /* ================================================= */

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

                {/* IMAGE */}

                <div className="relative h-52 bg-zinc-900 overflow-hidden">

                  {room.images?.length > 0 ? (
                    <img
                      src={room.images[0]}
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
                        size={32}
                        className="text-zinc-700"
                      />
                    </div>
                  )}

                  {/* IMAGE OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
                      border
                      border-white/10
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                    "
                  >
                    {room.roomType}
                  </span>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-lg font-semibold truncate">
                      {room.title}
                    </h3>

                    <div className="flex items-center font-bold whitespace-nowrap">

                      <IndianRupee size={14} />

                      {room.rent}

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="flex items-center gap-2 mt-3">

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

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-zinc-800">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/rooms/${room._id}`)
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
                        transition
                        text-sm
                      "
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/edit-room/${room._id}`)
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
                        transition
                        text-sm
                      "
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(room._id)}
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
                        transition
                        text-sm
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
            z-[100]
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

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <AlertTriangle
                size={22}
                className="text-red-400"
              />
            </div>

            <h2 className="text-xl font-semibold">
              Delete this room?
            </h2>

            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              This will permanently remove the room listing
              and its uploaded images. This action cannot be
              undone.
            </p>

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
                  transition
                  text-sm
                  font-medium
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-500
                  text-white
                  transition
                  text-sm
                  font-semibold
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

export default Profile;