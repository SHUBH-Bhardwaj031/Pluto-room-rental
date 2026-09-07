import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Bookmark,
  ArrowUpRight,
  Navigation,
} from "lucide-react";
import axios from "axios";

import googleMapsIcon from "../assets/google-maps-icon.png";

const RoomCard = ({ room, onUnsave }) => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(
    Boolean(room.isSaved)
  );

  const [saving, setSaving] = useState(false);

  /*
   * Sync saved state if room data changes
   */
  useEffect(() => {
    setSaved(Boolean(room.isSaved));
  }, [room.isSaved]);

  const coordinates =
    room.location?.coordinates?.coordinates;

  const hasCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number";

  /* =========================================================
     SAVE / UNSAVE
  ========================================================= */

  const handleSave = async (e) => {
    e.stopPropagation();

    const token =
      localStorage.getItem("plutoToken");

    /*
     * User must login to save a room
     */
    if (!token) {
      navigate("/login");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      if (saved) {
        /*
         * UNSAVE
         */
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/rooms/${room._id}/save`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSaved(false);

        /*
         * If this card is being displayed
         * inside Saved Rooms, remove it
         * immediately from the parent list.
         */
        onUnsave?.(room._id);
      } else {
        /*
         * SAVE
         */
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/rooms/${room._id}/save`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSaved(true);
      }
    } catch (error) {
      console.error(
        "Save/unsave room error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update saved room"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DIRECTIONS
  ========================================================= */

  const handleDirections = (e) => {
    e.stopPropagation();

    const token =
      localStorage.getItem("plutoToken");

    /*
     * User must login to get directions
     */
    if (!token) {
      navigate("/login");
      return;
    }

    if (!hasCoordinates) return;

    if (!navigator.geolocation) {
      alert(
        "Location detection is not supported by your browser."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude =
          position.coords.latitude;

        const currentLongitude =
          position.coords.longitude;

        const [
          roomLongitude,
          roomLatitude,
        ] = coordinates;

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
        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Location permission denied. Please allow location access and try again."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "Your current location could not be detected."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
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

  /* =========================================================
     ROOM DETAILS
  ========================================================= */

  /*
   * IMPORTANT
   * Room ID is NOT added to the URL.
   *
   * URL:
   * /rooms/view-details
   *
   * Room ID:
   * passed through React Router state
   */

  const openRoomDetails = () => {
    const token =
      localStorage.getItem("plutoToken");

    /*
     * User must login to view room details
     */
    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/rooms/view-details", {
      state: {
        roomId: room._id,
      },
    });
  };

  const handleCardClick = () => {
    openRoomDetails();
  };

  return (
    <article
      onClick={handleCardClick}
      className="
        group
        w-full
        min-w-0
        cursor-pointer
        overflow-hidden
        border
        border-[#DDDCD3]
        bg-white
        shadow-[0_4px_18px_rgba(23,63,43,0.045)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#C7C9BE]
        hover:shadow-[0_18px_40px_rgba(23,63,43,0.11)]
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E8E0]">
        {room.images?.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.035]
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#E9E8E0]">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-white text-[#55745F]">
                <MapPin size={23} />
              </div>

              <p className="mt-3 text-xs font-semibold text-[#7E827B]">
                No image available
              </p>
            </div>
          </div>
        )}

        {/* Image shade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* Room type */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#26372C] shadow-sm">
            {room.roomType}
          </span>
        </div>

        {/* Availability */}
        <div className="absolute right-4 bottom-4">
          {room.status === "available" ? (
            <span className="flex items-center gap-1.5 bg-[#E6B84A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#173F2B] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#173F2B]" />
              Available
            </span>
          ) : (
            <span className="bg-[#333934] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
              Unavailable
            </span>
          )}
        </div>

        {/* =====================================================
            SAVE BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          title={
            saved
              ? "Remove from saved rooms"
              : "Save room"
          }
          aria-label={
            saved
              ? "Remove from saved rooms"
              : "Save room"
          }
          className={`
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            shadow-md
            backdrop-blur-sm
            transition-all
            duration-200

            ${
              saved
                ? "border-[#173F2B] bg-[#173F2B] text-[#E6B84A]"
                : "border-white/80 bg-white text-[#26372C] hover:bg-[#E6B84A] hover:text-[#173F2B]"
            }

            ${
              saving
                ? "cursor-wait opacity-60"
                : ""
            }
          `}
        >
          <Bookmark
            size={18}
            strokeWidth={2}
            fill={
              saved
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5">
        {/* Title + Arrow */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[17px] font-bold tracking-[-0.015em] text-[#171A18] transition-colors group-hover:text-[#173F2B]">
              {room.title}
            </h3>

            <div className="mt-2 flex min-w-0 items-center gap-1.5">
              <MapPin
                size={14}
                strokeWidth={2}
                className="shrink-0 text-[#55745F]"
              />

              <span className="truncate text-xs font-medium text-[#747872]">
                {room.location?.locality ||
                  room.location?.city ||
                  "Location unavailable"}
              </span>
            </div>
          </div>

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              border
              border-[#E0E1D9]
              bg-[#F8F7F2]
              text-[#55745F]
              transition-all
              duration-300
              group-hover:border-[#C8D2C8]
              group-hover:bg-[#E9EFE7]
              group-hover:text-[#173F2B]
            "
          >
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-[#ECEBE4]" />

        {/* Price + Directions */}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
              Monthly rent
            </p>

            <div className="flex items-center text-[#173F2B]">
              <IndianRupee
                size={17}
                strokeWidth={2.5}
              />

              <span className="text-[23px] font-bold tracking-[-0.025em]">
                {Number(
                  room.rent || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Directions */}

          <button
            type="button"
            onClick={handleDirections}
            disabled={!hasCoordinates}
            title={
              hasCoordinates
                ? "Get directions"
                : "Location unavailable"
            }
            className="
              flex
              items-center
              gap-2
              border
              border-[#DDDCD3]
              bg-white
              px-3
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.06em]
              text-[#5E665F]
              transition-all
              hover:border-[#BFCABE]
              hover:bg-[#F2F5F0]
              hover:text-[#173F2B]
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            {hasCoordinates ? (
              <img
                src={googleMapsIcon}
                alt=""
                className="h-4 w-4 object-contain"
              />
            ) : (
              <Navigation size={14} />
            )}

            <span>Directions</span>
          </button>
        </div>

        {/* Amenities */}

        {room.amenities?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {room.amenities
              .slice(0, 4)
              .map((amenity, index) => (
                <span
                  key={`${amenity}-${index}`}
                  className="
                    border
                    border-[#E3E4DC]
                    bg-[#F7F6F0]
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-[#657068]
                  "
                >
                  {amenity}
                </span>
              ))}
          </div>
        )}

        {/* Bottom line */}

        <div className="mt-5 flex items-center justify-between border-t border-[#ECEBE4] pt-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C96B45]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#989B94]">
              Pluto listing
            </span>
          </div>

          <span className="text-xs font-bold text-[#173F2B] transition-transform duration-200 group-hover:translate-x-0.5">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;