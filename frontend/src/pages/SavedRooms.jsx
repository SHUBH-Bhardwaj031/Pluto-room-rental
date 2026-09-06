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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#DDDCD3] bg-[#F5F3EA]">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">

          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Bookmark
                    size={16}
                    fill="currentColor"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96B45]">
                  Your collection
                </span>

              </div>

              <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
                Saved Rooms
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#747872]">
                Keep the spaces you like in one place
                and come back whenever you're ready.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/find-rooms")}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                border
                border-[#173F2B]
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
              Find more rooms
              <ArrowRight size={15} />
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden border border-[#DDDCD3] bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-[#E5E4DC]" />

                <div className="space-y-4 p-5">

                  <div className="h-5 w-3/4 animate-pulse bg-[#E5E4DC]" />

                  <div className="h-3 w-1/2 animate-pulse bg-[#E5E4DC]" />

                  <div className="h-px bg-[#ECEBE4]" />

                  <div className="h-7 w-1/3 animate-pulse bg-[#E5E4DC]" />

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}

        {!loading && message && (
          <div className="border border-[#E3B8A8] bg-[#FFF3EE] px-6 py-8 text-center">

            <p className="text-sm font-medium text-[#A64E32]">
              {message}
            </p>

            <button
              type="button"
              onClick={fetchSavedRooms}
              className="mt-5 border border-[#C96B45] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#A64E32] transition hover:bg-[#C96B45] hover:text-white"
            >
              Try again
            </button>

          </div>
        )}

        {/* Empty */}

        {!loading &&
          !message &&
          rooms.length === 0 && (
            <div className="border border-[#DDDCD3] bg-white px-6 py-24 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#E9EFE7] text-[#55745F]">
                <Bookmark size={26} />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight">
                Your collection is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#747872]">
                When you find a room you like, save it
                and it'll appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/find-rooms")}
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

        {/* Rooms */}

        {!loading &&
          !message &&
          rooms.length > 0 && (
            <>

              <div className="mb-7 flex items-end justify-between border-b border-[#DDDCD3] pb-5">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                    Your saved listings
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#26372C]">
                    {rooms.length}{" "}
                    {rooms.length === 1
                      ? "saved room"
                      : "saved rooms"}
                  </h2>

                </div>

                <div className="hidden items-center gap-2 text-xs font-medium text-[#858A84] sm:flex">
                  <Search size={14} />
                  Saved spaces
                </div>

              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">

                {rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                  />
                ))}

              </div>

            </>
          )}

      </main>

    </div>
  );
};

export default SavedRooms;