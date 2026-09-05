import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  IndianRupee,
  Phone,
  MessageCircle,
  Navigation,
  Home,
} from "lucide-react";

import MapView from "../components/MapView";

const RoomDetails = () => {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ================= FETCH ROOM =================

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await axios.get(
          `http://localhost:5000/api/rooms/${id}`
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
  }, [id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mx-auto" />

          <p className="text-zinc-500 text-sm mt-4">
            Loading room details...
          </p>

        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (message || !room) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Room not found
          </h2>

          <p className="text-red-400 text-sm mt-2">
            {message || "This room may no longer be available."}
          </p>

        </div>

      </div>
    );
  }

  // ================= COORDINATES =================

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

  // ================= DIRECTIONS =================

  const handleDirections = () => {
    if (!hasCoordinates) return;

    const googleMapsUrl =
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    window.open(
      googleMapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* ================================================= */}
        {/* IMAGE */}
        {/* ================================================= */}

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">

          <div className="relative h-72 md:h-[480px] bg-zinc-900">

            {room.images?.length > 0 ? (
              <img
                src={`http://localhost:5000${room.images[0]}`}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">

                <Home
                  size={50}
                  className="text-zinc-800"
                />

              </div>
            )}

            {/* Room Type */}

            <span className="absolute top-5 left-5 bg-black/75 backdrop-blur-md border border-white/10 text-white text-sm px-4 py-2 rounded-full">
              {room.roomType}
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* MAIN INFORMATION */}
        {/* ================================================= */}

        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* ================= LEFT ================= */}

          <div className="lg:col-span-2">

            {/* Title */}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              <div>

                <h1 className="text-3xl md:text-4xl font-bold">
                  {room.title}
                </h1>

                <div className="flex items-center gap-2 text-zinc-500 mt-3">

                  <MapPin size={17} />

                  <span>
                    {room.location?.locality},{" "}
                    {room.location?.city}
                  </span>

                </div>

              </div>

              {/* Rent */}

              <div className="flex items-center text-2xl font-bold whitespace-nowrap">

                <IndianRupee size={21} />

                {room.rent}

                <span className="text-sm text-zinc-600 font-normal ml-1">
                  /month
                </span>

              </div>

            </div>

            {/* Description */}

            <div className="mt-8">

              <h2 className="text-xl font-semibold mb-3">
                About this room
              </h2>

              <p className="text-zinc-400 leading-7">
                {room.description}
              </p>

            </div>

            {/* Amenities */}

            {room.amenities?.length > 0 && (
              <div className="mt-8">

                <h2 className="text-xl font-semibold mb-4">
                  Amenities
                </h2>

                <div className="flex flex-wrap gap-3">

                  {room.amenities.map(
                    (amenity, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300"
                      >
                        {amenity}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ================= CONTACT CARD ================= */}

          <div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">

              <h2 className="text-lg font-semibold">
                Contact Person
              </h2>

              <p className="text-zinc-400 mt-2">
                {room.contact?.name}
              </p>

              {/* Phone */}

              {room.contact?.phone && (
                <a
                  href={`tel:${room.contact.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold text-sm mt-6 transition"
                >
                  <Phone size={17} />
                  Call
                </a>
              )}

              {/* WhatsApp */}

              {room.contact?.whatsapp && (
                <a
                  href={`https://wa.me/${room.contact.whatsapp.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-3 rounded-xl font-semibold text-sm mt-3 transition"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
              )}

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* LOCATION MAP */}
        {/* ================================================= */}

        {hasCoordinates && (
          <section className="mt-12">

            {/* Heading */}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">

              <div>

                <p className="text-indigo-400 text-sm font-medium mb-1">
                  Location
                </p>

                <h2 className="text-2xl font-bold">
                  Where is this room?
                </h2>

                <p className="text-zinc-500 text-sm mt-2">
                  View the exact location of this room on the map.
                </p>

              </div>

              {/* Google Directions */}

              <button
                type="button"
                onClick={handleDirections}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-semibold text-sm transition"
              >
                <Navigation size={17} />
                Get Directions
              </button>

            </div>

            {/* BIG MAP */}

            <div className="rounded-2xl overflow-hidden border border-zinc-800">

              <MapView
                latitude={latitude}
                longitude={longitude}
                title={room.title}
                selectable={false}
                zoom={15}
              />

            </div>

            {/* Address */}

            <div className="flex items-start gap-3 mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">

              <MapPin
                size={18}
                className="text-indigo-400 mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm text-zinc-300">
                  {room.location?.address}
                </p>

                <p className="text-xs text-zinc-600 mt-1">
                  {room.location?.locality},{" "}
                  {room.location?.city}
                </p>

              </div>

            </div>

          </section>
        )}

      </div>

    </div>
  );
};

export default RoomDetails;