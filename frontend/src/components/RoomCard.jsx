import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
} from "lucide-react";

import googleMapsIcon from "../assets/google-maps-icon.png";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const coordinates =
    room.location?.coordinates?.coordinates;

  const hasCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2;

  const handleDirections = (e) => {
    e.stopPropagation();

    if (!hasCoordinates) return;

    // Browser current location detect karega
    if (!navigator.geolocation) {
      alert("Location detection is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;

        const [roomLongitude, roomLatitude] = coordinates;

        // Current Location -> Room Location
        const googleMapsUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${currentLatitude},${currentLongitude}` +
          `&destination=${roomLatitude},${roomLongitude}`;

        window.open(
          googleMapsUrl,
          "_blank",
          "noopener,noreferrer"
        );
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Location permission denied. Please allow location access and try again."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert(
            "Your current location could not be detected."
          );
        } else if (error.code === error.TIMEOUT) {
          alert(
            "Location detection timed out. Please try again."
          );
        } else {
          alert(
            "Unable to detect your current location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCardClick = () => {
    navigate(`/rooms/${room._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer w-full min-w-0 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300"
    >
      {/* ================= IMAGE ================= */}

      <div className="relative h-56 bg-zinc-900 overflow-hidden">

        {room.images?.length > 0 ? (
          <img
            src={`http://localhost:5000${room.images[0]}`}
            alt={room.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-600 text-sm">
              No Image Available
            </span>
          </div>
        )}

        {/* Room Type */}

        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
          {room.roomType}
        </span>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-5">

        {/* Title + Rent */}

        <div className="flex items-start justify-between gap-4">

          <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
            {room.title}
          </h3>

          <div className="flex items-center text-white font-bold whitespace-nowrap">
            <IndianRupee size={15} />
            <span>{room.rent}</span>
          </div>

        </div>

        {/* ================= LOCATION ================= */}

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

        {/* ================= AMENITIES ================= */}

        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">

            {room.amenities
              .slice(0, 3)
              .map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                >
                  {amenity}
                </span>
              ))}

          </div>
        )}

        {/* ================= VIEW DETAILS + GOOGLE MAPS ================= */}

        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center gap-2">

          {/* View Details */}

          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-all"
          >
            View Details
          </button>

          {/* Google Maps */}

          <button
            type="button"
            onClick={handleDirections}
            disabled={!hasCoordinates}
            title={
              hasCoordinates
                ? "Get directions from your current location"
                : "Location unavailable"
            }
            className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-indigo-500/10 hover:border-indigo-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <img
              src={googleMapsIcon}
              alt="Google Maps"
              className="w-7 h-7 object-contain"
            />
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoomCard;