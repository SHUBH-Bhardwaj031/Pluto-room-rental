import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import ReportListing from "../components/ReportListing";

import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Phone,
  MessageCircle,
  Navigation,
  Home,
  Flag,
} from "lucide-react";

import MapView from "../components/MapView";

const RoomDetails = () => {
  const navigate = useNavigate();

  const { id: roomId } = useParams();

  const [showReportForm, setShowReportForm] =
    useState(false);

  const [room, setRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

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
      const token =
        localStorage.getItem(
          "plutoToken"
        );

      /*
      =========================================================
         LOGIN REQUIRED
      =========================================================
      */

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /*
      =========================================================
         ROOM ID REQUIRED
      =========================================================
      */

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

        const response =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        /*
        =======================================================
           ROOM FETCH ALSO INCREMENTS VIEW COUNT
        =======================================================

           Backend atomically increments `views` whenever
           this protected endpoint is requested.
        */

        setRoom(
          response.data?.room ||
            null
        );
      } catch (error) {
        console.error(
          "Fetch room error:",
          error
        );

        /*
        =======================================================
           TOKEN INVALID / EXPIRED
        =======================================================
        */

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "plutoToken"
          );

          localStorage.removeItem(
            "plutoUser"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setMessage(
          error.response?.data
            ?.message ||
            "Unable to load room details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

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

  if (
    message ||
    !room
  ) {
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
            onClick={() =>
              navigate(
                "/find-rooms"
              )
            }
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
    room.location
      ?.coordinates
      ?.coordinates;

  const hasCoordinates =
    Array.isArray(
      coordinates
    ) &&
    coordinates.length === 2 &&
    Number.isFinite(
      Number(coordinates[0])
    ) &&
    Number.isFinite(
      Number(coordinates[1])
    );

  let latitude = null;
  let longitude = null;

  if (hasCoordinates) {
    longitude =
      Number(coordinates[0]);

    latitude =
      Number(coordinates[1]);
  }

  // =========================================================
  // DIRECTIONS
  // =========================================================

  const handleDirections = () => {
    if (!hasCoordinates) {
      return;
    }

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
  // NORMALIZE WHATSAPP NUMBER
  // =========================================================

  const getWhatsAppNumber = () => {
    const rawNumber =
      room.contact?.whatsapp ||
      room.contact?.phone;

    if (!rawNumber) {
      return "";
    }

    let cleanNumber =
      rawNumber.replace(
        /\D/g,
        ""
      );

    /*
     * Already an Indian international number
     */

    if (
      cleanNumber.startsWith(
        "91"
      ) &&
      cleanNumber.length === 12
    ) {
      return cleanNumber;
    }

    /*
     * Indian number written with leading zero
     */

    if (
      cleanNumber.startsWith(
        "0"
      ) &&
      cleanNumber.length === 11
    ) {
      cleanNumber =
        cleanNumber.substring(
          1
        );
    }

    /*
     * Standard Indian 10-digit mobile number
     */

    if (
      cleanNumber.length === 10
    ) {
      return `91${cleanNumber}`;
    }

    return cleanNumber;
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const handleWhatsApp = () => {
    const cleanNumber =
      getWhatsAppNumber();

    if (!cleanNumber) {
      return;
    }

    const messageText =
      `Hi, I found your room "${room.title}" on Pluto. ` +
      `I am interested in this room. Is it still available?`;

    const whatsappUrl =
      `https://wa.me/${cleanNumber}` +
      `?text=${encodeURIComponent(
        messageText
      )}`;

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
    if (
      !room.contact?.phone
    ) {
      return;
    }

    window.location.href =
      `tel:${room.contact.phone}`;
  };

  const hasPhone =
    Boolean(
      room.contact?.phone
    );

  const hasWhatsApp =
    Boolean(
      room.contact?.whatsapp ||
        room.contact?.phone
    );

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="border-b border-[#DDDCD3] bg-[#F5F3EA]">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
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

              {room.status ===
              "available" ? (
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
                  {room.location
                    ?.locality ||
                    "Location"}

                  {room.location
                    ?.city
                    ? `, ${room.location.city}`
                    : ""}
                </span>

              </div>

            </div>

            {/* =================================================
                RENT + VIEWS
            ================================================= */}

            <div className="mt-8 border-y border-[#DDDCD3] py-6">

              <div className="flex items-end justify-between gap-6">

                {/* Monthly Rent */}

                <div>

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
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

                {/* Views */}

                <div className="text-right">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                    Views
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#173F2B]">
                    {Number(
                      room.views || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

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

            {room.amenities?.length >
              0 && (
              <section className="mt-10">

                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                  Amenities
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {room.amenities.map(
                    (
                      amenity,
                      index
                    ) => (
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
                      {room.location
                        ?.locality}

                      {room.location
                        ?.city
                        ? `, ${room.location.city}`
                        : ""}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#747872]">
                      {room.location
                        ?.address}
                    </p>

                  </div>

                </div>

                {hasCoordinates && (
                  <div className="overflow-hidden border border-[#E2E2DA]">

                    <MapView
                      latitude={
                        latitude
                      }
                      longitude={
                        longitude
                      }
                    />

                  </div>
                )}

                {hasCoordinates && (
                  <button
                    type="button"
                    onClick={
                      handleDirections
                    }
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
                    <Navigation
                      size={15}
                    />
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

              {/* Header */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
                    Contact poster
                  </p>

                  <p className="mt-5 text-xl font-bold text-[#173F2B]">
                    {room.contact
                      ?.name ||
                      "Room poster"}
                  </p>

                  <p className="mt-1 text-sm text-[#747872]">
                    Interested in this room?
                  </p>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F3E9C9] text-[#173F2B]">
                  <MessageCircle
                    size={20}
                  />
                </div>

              </div>

              {/* Contact Buttons */}

              <div className="mt-6 space-y-3">

                {hasPhone && (
                  <button
                    type="button"
                    onClick={
                      handleCall
                    }
                    className="
                      group
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
                      transition-all
                      hover:bg-[#24583D]
                    "
                  >
                    <Phone
                      size={17}
                      className="transition-transform group-hover:scale-105"
                    />
                    Call Poster
                  </button>
                )}

                {hasWhatsApp && (
                  <button
                    type="button"
                    onClick={
                      handleWhatsApp
                    }
                    className="
                      group
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
                      transition-all
                      hover:border-[#AEBEAF]
                      hover:bg-[#DDE8DC]
                    "
                  >
                    <MessageCircle
                      size={17}
                      className="transition-transform group-hover:scale-105"
                    />
                    Message on WhatsApp
                  </button>
                )}

                {!hasPhone &&
                  !hasWhatsApp && (
                    <div className="border border-[#E3E0D6] bg-[#F7F6F0] px-4 py-4 text-center">

                      <p className="text-xs font-semibold text-[#747872]">
                        Contact information is not available.
                      </p>

                    </div>
                  )}

              </div>

              {/* Safety / Contact Note */}

              {(hasPhone ||
                hasWhatsApp) && (
                <div className="mt-5 border-l-2 border-[#E6B84A] bg-[#FBF8EA] px-4 py-3">

                  <p className="text-[11px] leading-5 text-[#697169]">
                    Contact the poster directly to confirm
                    availability, rent and other details
                    before visiting.
                  </p>

                </div>
              )}

              {/* Address */}

              <div className="mt-6 border-t border-[#ECEBE4] pt-5">

                <div className="flex items-start gap-3">

                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#C96B45]"
                  />

                  <p className="text-xs leading-5 text-[#747872]">
                    {room.location
                      ?.address ||
                      `${
                        room.location
                          ?.locality ||
                        ""
                      }${
                        room.location
                          ?.city
                          ? `, ${room.location.city}`
                          : ""
                      }`}
                  </p>

                </div>

              </div>

              {/* =================================================
                  REPORT LISTING
              ================================================= */}

              <div className="mt-5 border-t border-[#ECEBE4] pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowReportForm(
                      true
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#747872]
                    transition-colors
                    hover:text-red-600
                  "
                >
                  <Flag size={14} />
                  Report listing
                </button>

              </div>

              {/* Pluto */}

              <div className="mt-5 border-t border-[#ECEBE4] pt-4">

                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#A0A39D]">
                  Shared through Pluto
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* =====================================================
          REPORT MODAL
      ===================================================== */}

      {showReportForm && (
        <ReportListing
          roomId={roomId}
          onClose={() =>
            setShowReportForm(
              false
            )
          }
        />
      )}

    </div>
  );
};

export default RoomDetails;