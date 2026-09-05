import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bookmark,
  MapPin,
  Search,
} from "lucide-react";

import RoomCard from "../components/RoomCard";

const SavedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* =====================================================
     FETCH SAVED ROOMS
  ===================================================== */

  const fetchSavedRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error(
        "Fetch saved rooms error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load saved rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRooms();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Grid */}

        <div
          className="
            absolute inset-0
            opacity-[0.11]
            bg-[linear-gradient(rgba(139,92,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.5)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* Purple glow */}

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

        {/* Right glow */}

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

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 px-4 py-10">

        <div className="max-w-7xl mx-auto">

          {/* Header */}

          <div className="mb-10">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bookmark
                  size={16}
                  className="text-indigo-400"
                  fill="currentColor"
                />
              </div>

              <span className="text-sm font-medium text-indigo-400">
                Your Collection
              </span>

            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Saved Rooms
            </h1>

            <p className="text-zinc-500 mt-3 max-w-2xl">
              Keep track of the rooms you are interested
              in and come back to them anytime.
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />

              <p className="text-zinc-500 text-sm mt-4">
                Loading saved rooms...
              </p>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && message && (
            <div className="border border-red-900/50 bg-red-950/20 rounded-2xl p-6 text-center">

              <p className="text-red-400 text-sm">
                {message}
              </p>

            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !message &&
            rooms.length === 0 && (
              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl py-24 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">

                  <Bookmark
                    size={26}
                    className="text-zinc-600"
                  />

                </div>

                <h2 className="text-xl font-semibold mt-5">
                  No saved rooms yet
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  Save rooms you like and they will
                  appear here.
                </p>

              </div>
            )}

          {/* =================================================
              SAVED ROOMS
          ================================================= */}

          {!loading &&
            !message &&
            rooms.length > 0 && (
              <>

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h2 className="text-lg font-semibold">
                      Your Saved Listings
                    </h2>

                    <p className="text-sm text-zinc-600 mt-1">
                      {rooms.length} saved{" "}
                      {rooms.length === 1
                        ? "room"
                        : "rooms"}
                    </p>

                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">
                    <Search size={14} />
                    Your saved spaces
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

                  {rooms.map((room) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                    />
                  ))}

                </div>

              </>
            )}

        </div>
      </div>
    </div>
  );
};

export default SavedRooms;