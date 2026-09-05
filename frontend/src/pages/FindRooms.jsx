import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  SlidersHorizontal,
  Search,
} from "lucide-react";

import RoomCard from "../components/RoomCard";

const FindRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    city: "",
    locality: "",
    roomType: "",
    minRent: "",
    maxRent: "",
  });

  // ================= FETCH ROOMS =================

  const fetchRooms = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setMessage("");

      const params = {};

      if (currentFilters.city.trim()) {
        params.city = currentFilters.city.trim();
      }

      if (currentFilters.locality.trim()) {
        params.locality = currentFilters.locality.trim();
      }

      if (currentFilters.roomType) {
        params.roomType = currentFilters.roomType;
      }

      if (currentFilters.minRent) {
        params.minRent = currentFilters.minRent;
      }

      if (currentFilters.maxRent) {
        params.maxRent = currentFilters.maxRent;
      }

      const response = await axios.get(
        "${import.meta.env.VITE_API_URL}/api/rooms",
        { params }
      );

      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Fetch rooms error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchRooms();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SEARCH =================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(filters);
  };

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    const emptyFilters = {
      city: "",
      locality: "",
      roomType: "",
      minRent: "",
      maxRent: "",
    };

    setFilters(emptyFilters);
    fetchRooms(emptyFilters);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      
      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

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

        {/* Bottom glow */}
        <div
          className="
            absolute
            -bottom-40
            left-[35%]
            w-[450px]
            h-[450px]
            rounded-full
            bg-fuchsia-600/[0.035]
            blur-[140px]
          "
        />

      </div>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10 px-4 py-10">

        <div className="max-w-7xl mx-auto">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-10">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Search
                  size={16}
                  className="text-indigo-400"
                />
              </div>

              <span className="text-sm font-medium text-indigo-400">
                Pluto Community
              </span>

            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Find your next space.
            </h1>

            <p className="text-zinc-500 mt-3 max-w-2xl">
              Discover rooms shared by people in your community,
              explore their locations and get directions instantly.
            </p>

          </div>

          {/* ================================================= */}
          {/* FILTER BOX */}
          {/* ================================================= */}

          <form
            onSubmit={handleSearch}
            className="
              relative
              bg-zinc-950/90
              backdrop-blur-xl
              border border-zinc-800
              rounded-2xl
              p-5 md:p-6
              mb-10
              shadow-2xl
              shadow-black/30
            "
          >

            <div className="flex items-center gap-2 mb-5">

              <SlidersHorizontal
                size={18}
                className="text-zinc-400"
              />

              <span className="text-sm font-semibold text-zinc-300">
                Search & Filters
              </span>

            </div>

            {/* FILTER INPUTS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">

              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="City"
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/30
                "
              />

              <input
                type="text"
                name="locality"
                value={filters.locality}
                onChange={handleChange}
                placeholder="Locality"
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/30
                "
              />

              <select
                name="roomType"
                value={filters.roomType}
                onChange={handleChange}
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/30
                "
              >
                <option value="">
                  All Room Types
                </option>

                <option value="Single">
                  Single
                </option>

                <option value="Shared">
                  Shared
                </option>

                <option value="1 BHK">
                  1 BHK
                </option>

                <option value="2 BHK">
                  2 BHK
                </option>

                <option value="PG">
                  PG
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              <input
                type="number"
                name="minRent"
                value={filters.minRent}
                onChange={handleChange}
                placeholder="Min Rent"
                min="0"
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/30
                "
              />

              <input
                type="number"
                name="maxRent"
                value={filters.maxRent}
                onChange={handleChange}
                placeholder="Max Rent"
                min="0"
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/30
                "
              />

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 mt-5">

              <button
                type="submit"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-indigo-600
                  hover:bg-indigo-500
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition
                  shadow-lg
                  shadow-indigo-600/10
                "
              >
                <Search size={17} />
                Search Rooms
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  bg-zinc-900
                  hover:bg-zinc-800
                  border border-zinc-800
                  px-6 py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition
                "
              >
                Clear Filters
              </button>

            </div>

          </form>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />

              <p className="text-zinc-500 text-sm mt-4">
                Finding available rooms...
              </p>

            </div>
          )}

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {!loading && message && (
            <div className="border border-red-900/50 bg-red-950/20 rounded-2xl p-6 text-center">

              <p className="text-red-400 text-sm">
                {message}
              </p>

            </div>
          )}

          {/* ================================================= */}
          {/* NO ROOMS */}
          {/* ================================================= */}

          {!loading &&
            !message &&
            rooms.length === 0 && (
              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl py-24 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">

                  <MapPin
                    size={24}
                    className="text-zinc-600"
                  />

                </div>

                <h2 className="text-xl font-semibold mt-5">
                  No rooms found
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  Try changing your location or budget filters.
                </p>

              </div>
            )}

          {/* ================================================= */}
          {/* ROOM RESULTS */}
          {/* ================================================= */}

          {!loading && rooms.length > 0 && (
            <>

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-lg font-semibold">
                    Available Rooms
                  </h2>

                  <p className="text-sm text-zinc-600 mt-1">
                    {rooms.length} listing
                    {rooms.length !== 1 ? "s" : ""} available
                  </p>

                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">

                  <MapPin size={14} />

                  Explore room locations

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

export default FindRooms;