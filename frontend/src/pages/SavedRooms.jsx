import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bookmark,
  Search,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import RoomCard from "../components/RoomCard";

const SavedRooms = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [message, setMessage] =
    useState("");

  /* =========================================================
     FETCH SAVED ROOMS
  ========================================================= */

  const fetchSavedRooms = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem(
          "plutoToken"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setRooms(
        response.data.rooms || []
      );
    } catch (error) {
      console.error(
        "Fetch saved rooms error:",
        error
      );

      setMessage(
        error.response?.data
          ?.message ||
          "Unable to load saved rooms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRooms();
  }, []);

  /* =========================================================
     REMOVE UNSAVED ROOM FROM CURRENT LIST
  ========================================================= */

  const handleUnsave = (roomId) => {
    setRooms((currentRooms) =>
      currentRooms.filter(
        (room) =>
          room._id !== roomId
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#DDDCD3] bg-[#F5F3EA]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#C96B45]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#747872]">
                  Your collection
                </span>
              </div>

              <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] text-[#173F2B] md:text-5xl">
                Saved rooms.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#747872]">
                Keep the rooms you like in
                one place and come back to
                them whenever you are ready.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/find-rooms"
                )
              }
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-3
                border
                border-[#173F2B]
                bg-[#173F2B]
                px-5
                py-3
                text-[11px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                transition-all
                hover:bg-[#24563D]
              "
            >
              <Search size={15} />

              Find more rooms

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden border border-[#DDDCD3] bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-[#E9E8E0]" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse bg-[#E9E8E0]" />

                    <div className="h-3 w-1/2 animate-pulse bg-[#E9E8E0]" />

                    <div className="h-px bg-[#ECEBE4]" />

                    <div className="h-7 w-1/3 animate-pulse bg-[#E9E8E0]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}

        {!loading && message && (
          <div className="border border-[#E1C7BC] bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F4E7E1] text-[#C96B45]">
              <Bookmark
                size={21}
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#173F2B]">
              Something went wrong
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#747872]">
              {message}
            </p>

            <button
              type="button"
              onClick={fetchSavedRooms}
              className="
                mt-6
                border
                border-[#173F2B]
                bg-[#173F2B]
                px-5
                py-2.5
                text-[10px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                transition-colors
                hover:bg-[#24563D]
              "
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !message &&
          rooms.length === 0 && (
            <div className="border border-[#DDDCD3] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#D8D8CE] bg-[#F7F6F0] text-[#55745F]">
                <Bookmark
                  size={27}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-[-0.02em] text-[#173F2B]">
                Nothing saved yet.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#747872]">
                Browse available rooms and
                bookmark the ones that feel
                right. They will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/find-rooms"
                  )
                }
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  border
                  border-[#173F2B]
                  px-5
                  py-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-[#173F2B]
                  transition-all
                  hover:bg-[#173F2B]
                  hover:text-white
                "
              >
                Explore rooms

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          )}

        {/* Saved Rooms */}

        {!loading &&
          !message &&
          rooms.length > 0 && (
            <>
              <div className="mb-7 flex items-center justify-between border-b border-[#DDDCD3] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#979A93]">
                    Saved collection
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#173F2B]">
                    {rooms.length}{" "}
                    {rooms.length === 1
                      ? "room"
                      : "rooms"}{" "}
                    saved
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[#55745F]">
                  <Bookmark
                    size={15}
                    fill="currentColor"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    Your picks
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map(
                  (room) => (
                    <RoomCard
                      key={room._id}
                      room={{
                        ...room,
                        isSaved: true,
                      }}
                      onUnsave={
                        handleUnsave
                      }
                    />
                  )
                )}
              </div>
            </>
          )}
      </main>
    </div>
  );
};

export default SavedRooms;