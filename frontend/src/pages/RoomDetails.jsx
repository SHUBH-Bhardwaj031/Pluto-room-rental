import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Phone,
  MessageCircle,
  Navigation,
  Home,
} from "lucide-react";

import MapView from "../components/MapView";

const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const roomId = location.state?.roomId;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================================================
  // SCROLL TO TOP
  // =========================================================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // FETCH ROOM
  // =========================================================

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setMessage(
          "Room information is missing. Please open the room from the listings."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`
        );

        setRoom(response.data.room);
      } catch (error) {
        console.error("Fetch room error:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load room details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EA]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="animate-pulse">

            <div className="mb-8 h-5 w-28 bg-[#E1E2D9]" />

            <div className="h-[320px] bg-[#E5E4DC] md:h-[520px]" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="h-9 w-3/4 bg-[#E1E2D9]" />
                <div className="mt-4 h-5 w-1/3 bg-[#E1E2D9]" />
                <div className="mt-8 h-32 bg-[#E1E2D9]" />
              </div>

              <div className="h-64 bg-[#E1E2D9]" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (message || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EA] px-5">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
            <Home size={28} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-[#171A18]">
            Room not found
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#747872]">
            {message ||
              "This room may no longer be available."}
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
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#24583D]
            "
          >
            <ArrowLeft size={16} />
            Back to rooms
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // COORDINATES
  // =========================================================

  const coordinates =
    room.location?.coordinates?.coordinates;

  const hasCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2;

  let latitude = null;
  let longitude = null;

  if (hasCoordinates) {
    longitude = Number(coordinates[0]);
    latitude = Number(coordinates[1]);
  }

  // =========================================================
  // DIRECTIONS
  // =========================================================

  const handleDirections = () => {
    if (!hasCoordinates) return;

    const googleMapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}`;

    window.open(
      googleMapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const handleWhatsApp = () => {
    const whatsappNumber =
      room.contact?.whatsapp ||
      room.contact?.phone;

    if (!whatsappNumber) return;

    const cleanNumber = whatsappNumber.replace(
      /\D/g,
      ""
    );

    const whatsappUrl =
      `https://wa.me/${cleanNumber}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // CALL
  // =========================================================

  const handleCall = () => {
    if (!room.contact?.phone) return;

    window.location.href =
      `tel:${room.contact.phone}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="border-b border-[#DDDCD3] bg-[#F5F3EA]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[#55745F]
              transition
              hover:text-[#173F2B]
            "
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#989B94]">
            Pluto listing
          </span>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* ===================================================
            IMAGE
        =================================================== */}

        <div className="relative overflow-hidden border border-[#DDDCD3] bg-[#E9E8E0]">

          <div className="relative h-[300px] sm:h-[400px] md:h-[520px]">

            {room.images?.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center bg-white text-[#55745F]">
                    <Home size={30} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#7E827B]">
                    No image available
                  </p>

                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />

            {/* Status */}

            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">

              <span className="bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#26372C]">
                {room.roomType}
              </span>

              {room.status === "available" ? (
                <span className="flex items-center gap-2 bg-[#E6B84A] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#173F2B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#173F2B]" />
                  Available
                </span>
              ) : (
                <span className="bg-[#333934] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  Unavailable
                </span>
              )}

            </div>

          </div>
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_350px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="min-w-0">

            {/* Title */}

            <div>
              <h1 className="text-3xl font-bold tracking-[-0.025em] text-[#171A18] sm:text-4xl lg:text-5xl">
                {room.title}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-[#747872]">

                <MapPin
                  size={18}
                  className="shrink-0 text-[#55745F]"
                />

                <span className="text-sm font-medium">
                  {room.location?.locality ||
                    "Location"}

                  {room.location?.city
                    ? `, ${room.location.city}`
                    : ""}
                </span>

              </div>
            </div>

            {/* Rent */}

            <div className="mt-8 border-y border-[#DDDCD3] py-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                Monthly rent
              </p>

              <div className="mt-1 flex items-center text-[#173F2B]">

                <IndianRupee
                  size={24}
                  strokeWidth={2.5}
                />

                <span className="text-3xl font-bold">
                  {Number(
                    room.rent || 0
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            {/* Description */}

            <section className="mt-9">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                About this space
              </p>

              <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[#4F5951]">
                {room.description}
              </p>

            </section>

            {/* Amenities */}

            {room.amenities?.length > 0 && (
              <section className="mt-10">

                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                  Amenities
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {room.amenities.map(
                    (amenity, index) => (
                      <span
                        key={`${amenity}-${index}`}
                        className="
                          border
                          border-[#DDE0D8]
                          bg-white
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-[#526056]
                        "
                      >
                        {amenity}
                      </span>
                    )
                  )}

                </div>

              </section>
            )}

            {/* Location */}

            <section className="mt-10">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                Location
              </p>

              <div className="mt-4 border border-[#DDDCD3] bg-white p-4">

                <div className="mb-4 flex items-start gap-3">

                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-[#55745F]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#26372C]">
                      {room.location?.locality}
                      {room.location?.city
                        ? `, ${room.location.city}`
                        : ""}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#747872]">
                      {room.location?.address}
                    </p>
                  </div>

                </div>

                {hasCoordinates && (
                  <div className="overflow-hidden border border-[#E2E2DA]">
                    <MapView
                      latitude={latitude}
                      longitude={longitude}
                    />
                  </div>
                )}

                {hasCoordinates && (
                  <button
                    type="button"
                    onClick={handleDirections}
                    className="
                      mt-4
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border
                      border-[#173F2B]
                      bg-[#173F2B]
                      px-4
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
                    <Navigation size={15} />
                    Get Directions
                  </button>
                )}

              </div>

            </section>

          </div>

          {/* =================================================
              CONTACT CARD
          ================================================= */}

          <aside>

            <div className="sticky top-24 border border-[#D9DAD1] bg-white p-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                Contact poster
              </p>

              <div className="mt-5">

                <p className="text-xl font-bold text-[#173F2B]">
                  {room.contact?.name ||
                    "Room poster"}
                </p>

                <p className="mt-1 text-sm text-[#747872]">
                  Interested in this room?
                </p>

              </div>

              <div className="mt-6 space-y-3">

                {room.contact?.phone && (
                  <button
                    type="button"
                    onClick={handleCall}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border
                      border-[#173F2B]
                      bg-[#173F2B]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-[#24583D]
                    "
                  >
                    <Phone size={17} />
                    Call
                  </button>
                )}

                {(room.contact?.whatsapp ||
                  room.contact?.phone) && (
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border
                      border-[#C8D2C8]
                      bg-[#E9EFE7]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-[#173F2B]
                      transition
                      hover:bg-[#DDE8DC]
                    "
                  >
                    <MessageCircle size={17} />
                    WhatsApp
                  </button>
                )}

              </div>

              <div className="mt-6 border-t border-[#ECEBE4] pt-5">

                <div className="flex items-start gap-3">

                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#C96B45]"
                  />

                  <p className="text-xs leading-5 text-[#747872]">
                    {room.location?.address ||
                      `${room.location?.locality || ""}${
                        room.location?.city
                          ? `, ${room.location.city}`
                          : ""
                      }`}
                  </p>

                </div>

              </div>

              <div className="mt-5 border-t border-[#ECEBE4] pt-4">

                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#A0A39D]">
                  Shared through Pluto
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
};

export default RoomDetails;