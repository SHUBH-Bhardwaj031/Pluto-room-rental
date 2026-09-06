import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Home,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";

import RoomCard from "../components/RoomCard";

const API_URL = import.meta.env.VITE_API_URL;

const FindRooms = () => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [roomType, setRoomType] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  // Results section reference
  const resultsSectionRef = useRef(null);

  // ==========================================================
  // FETCH ROOMS
  // ==========================================================

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/rooms`
      );

      const roomData =
        response.data?.rooms ||
        response.data?.data ||
        [];

      setRooms(
        Array.isArray(roomData)
          ? roomData
          : []
      );
    } catch (err) {
      console.error(
        "Fetch rooms error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load rooms. Please try again."
      );

      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ==========================================================
  // NORMALIZE TEXT
  // ==========================================================

  const normalizeText = (value) => {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // ==========================================================
  // DEEP SEARCH
  // ==========================================================

  const filteredRooms = useMemo(() => {
    const query = normalizeText(
      activeSearch
    );

    const minimum =
      minRent !== ""
        ? Number(minRent)
        : null;

    const maximum =
      maxRent !== ""
        ? Number(maxRent)
        : null;

    return rooms.filter((room) => {
      // ------------------------------------------------------
      // DEEP SEARCH
      // ------------------------------------------------------

      if (query) {
        const searchableFields = [
          room.title,
          room.description,
          room.roomType,

          room.location?.address,
          room.location?.city,
          room.location?.locality,

          room.contact?.name,

          ...(Array.isArray(
            room.amenities
          )
            ? room.amenities
            : []),
        ];

        const searchableText =
          normalizeText(
            searchableFields.join(" ")
          );

        if (
          !searchableText.includes(query)
        ) {
          return false;
        }
      }

      // ------------------------------------------------------
      // ROOM TYPE
      // ------------------------------------------------------

      if (
        roomType &&
        normalizeText(
          room.roomType
        ) !== normalizeText(roomType)
      ) {
        return false;
      }

      // ------------------------------------------------------
      // RENT
      // ------------------------------------------------------

      const rent = Number(
        room.rent || 0
      );

      if (
        minimum !== null &&
        rent < minimum
      ) {
        return false;
      }

      if (
        maximum !== null &&
        rent > maximum
      ) {
        return false;
      }

      return true;
    });
  }, [
    rooms,
    activeSearch,
    roomType,
    minRent,
    maxRent,
  ]);

  // ==========================================================
  // DELAY
  // ==========================================================

  const delay = (milliseconds) => {
    return new Promise((resolve) =>
      setTimeout(resolve, milliseconds)
    );
  };

  // ==========================================================
  // SCROLL TO RESULTS
  // ==========================================================

  const scrollToResults = () => {
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        }
      );
    }, 150);
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = async (event) => {
    event.preventDefault();

    if (searching) return;

    setSearching(true);
    setError("");

    // Give user visible skeleton loading
    await delay(800);

    setActiveSearch(
      searchInput.trim()
    );

    setSearching(false);

    // Wait for result UI to render, then scroll
    scrollToResults();
  };

  // ==========================================================
  // APPLY FILTERS
  // ==========================================================

  const applyFilters = async () => {
    if (searching) return;

    setSearching(true);

    await delay(800);

    setActiveSearch(
      searchInput.trim()
    );

    setSearching(false);
    setShowFilters(false);

    scrollToResults();
  };

  // ==========================================================
  // CLEAR ALL FILTERS
  // ==========================================================

  const clearFilters = async () => {
    if (searching) return;

    const hasSomething =
      searchInput ||
      activeSearch ||
      roomType ||
      minRent ||
      maxRent;

    if (hasSomething) {
      setSearching(true);

      await delay(500);
    }

    setSearchInput("");
    setActiveSearch("");
    setRoomType("");
    setMinRent("");
    setMaxRent("");

    setSearching(false);
    setShowFilters(false);

    scrollToResults();
  };

  // ==========================================================
  // REMOVE ONE FILTER
  // ==========================================================

  const removeFilter = async (
    filterType
  ) => {
    if (searching) return;

    if (filterType === "search") {
      setSearching(true);

      setSearchInput("");

      await delay(500);

      setActiveSearch("");

      setSearching(false);

      scrollToResults();

      return;
    }

    if (filterType === "roomType") {
      setRoomType("");
    }

    if (filterType === "minRent") {
      setMinRent("");
    }

    if (filterType === "maxRent") {
      setMaxRent("");
    }

    scrollToResults();
  };

  // ==========================================================
  // FILTER STATUS
  // ==========================================================

  const hasFilters =
    Boolean(activeSearch) ||
    Boolean(roomType) ||
    Boolean(minRent) ||
    Boolean(maxRent);

  const activeFilterCount = [
    activeSearch,
    roomType,
    minRent,
    maxRent,
  ].filter(Boolean).length;

  const showSkeleton =
    loading || searching;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
      {/* ======================================================
          HEADER / SEARCH
      ====================================================== */}

      <section className="border-b border-[#DDDCD3] bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-9 pt-10 sm:px-8 lg:px-10 lg:pb-11 lg:pt-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 bg-[#E6B84A]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                  Room discovery
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#171A18] sm:text-4xl lg:text-5xl">
                Find your next place.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#747872] sm:text-base">
                Search by city, area, locality,
                address, room details, amenities
                and more.
              </p>
            </div>

            <div className="hidden shrink-0 border-l border-[#DDDCD3] pl-6 lg:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#969992]">
                PLUTO
              </p>

              <p className="mt-1 text-sm font-bold text-[#26372C]">
                Search. Explore. Connect.
              </p>
            </div>
          </div>

          {/* ==================================================
              SEARCH BAR
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="mt-8 grid overflow-hidden border-2 border-[#C8CEC8] bg-white shadow-[0_10px_30px_rgba(23,63,43,0.07)] transition-all focus-within:border-[#173F2B] focus-within:shadow-[0_12px_34px_rgba(23,63,43,0.12)] md:grid-cols-[1fr_auto]"
          >
            <div className="flex min-h-[82px] items-center gap-4 bg-[#FAFAF6] px-5 py-4 transition-all focus-within:bg-white">
              {/* SEARCH ICON */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                <Search
                  size={19}
                  strokeWidth={2.5}
                />
              </div>

              {/* INPUT */}

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="room-search"
                  className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#55745F]"
                >
                  Search rooms
                </label>

                <input
                  id="room-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value
                    )
                  }
                  placeholder="City, locality, address, amenities..."
                  autoComplete="off"
                  spellCheck="false"
                  className="mt-1 block w-full border-0 border-b-2 border-[#C9CEC8] bg-transparent px-0 py-2 text-base font-semibold !text-[#171A18] caret-[#173F2B] outline-none transition-all placeholder:!text-[#858B84] focus:border-[#173F2B] focus:bg-white"
                />
              </div>

              {/* CLEAR */}

              {searchInput && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchInput("")
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#D2D6D0] bg-white text-[#5F665F] transition hover:border-[#173F2B] hover:bg-[#E9EFE7] hover:text-[#173F2B]"
                  aria-label="Clear search"
                >
                  <X
                    size={15}
                    strokeWidth={2.5}
                  />
                </button>
              )}
            </div>

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              disabled={searching}
              className="flex min-h-[64px] items-center justify-center gap-2 bg-[#173F2B] px-8 text-sm font-bold text-white transition hover:bg-[#102F20] disabled:cursor-wait disabled:opacity-80"
            >
              {searching ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Searching...
                </>
              ) : (
                <>
                  <Search
                    size={17}
                    strokeWidth={2.5}
                  />

                  Search
                </>
              )}
            </button>
          </form>

          {/* ==================================================
              SEARCH HINTS
          ================================================== */}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-[#7E847D]">
            <span className="font-medium">
              Try searching:
            </span>

            {[
              "Matyari",
              "Lucknow",
              "Gomti Nagar",
              "WiFi",
              "1 BHK",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setSearchInput(item)
                }
                className="border-b border-[#C9D1C9] font-semibold text-[#55745F] transition hover:border-[#173F2B] hover:text-[#173F2B]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          RESULTS SECTION
      ====================================================== */}

      <section
        ref={resultsSectionRef}
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
      >
        {/* RESULTS HEADER */}

        <div className="flex flex-col gap-4 border-b border-[#DAD9D0] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#55745F]">
              Available spaces
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#171A18]">
                {showSkeleton
                  ? "Finding..."
                  : filteredRooms.length}
              </h2>

              {!showSkeleton && (
                <span className="text-sm font-medium text-[#858982]">
                  {filteredRooms.length ===
                  1
                    ? "room found"
                    : "rooms found"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* MOBILE FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              className="flex items-center gap-2 border-2 border-[#D0D4CE] bg-white px-4 py-2.5 text-xs font-bold text-[#34483A] transition hover:border-[#AEB9AF] hover:bg-[#F2F5F0] lg:hidden"
            >
              <SlidersHorizontal size={15} />

              Filters

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#173F2B] px-1.5 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-[#747872] transition hover:text-[#173F2B]"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            ACTIVE FILTERS
        ================================================== */}

        {hasFilters && (
          <div className="flex flex-wrap gap-2 border-b border-[#E2E1D9] py-5">
            {activeSearch && (
              <FilterTag
                label={`Search: ${activeSearch}`}
                onRemove={() =>
                  removeFilter("search")
                }
              />
            )}

            {roomType && (
              <FilterTag
                label={roomType}
                onRemove={() =>
                  removeFilter(
                    "roomType"
                  )
                }
              />
            )}

            {minRent && (
              <FilterTag
                label={`Min ₹${Number(
                  minRent
                ).toLocaleString("en-IN")}`}
                onRemove={() =>
                  removeFilter(
                    "minRent"
                  )
                }
              />
            )}

            {maxRent && (
              <FilterTag
                label={`Max ₹${Number(
                  maxRent
                ).toLocaleString("en-IN")}`}
                onRemove={() =>
                  removeFilter(
                    "maxRent"
                  )
                }
              />
            )}
          </div>
        )}

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[245px_1fr]">
          {/* ==================================================
              FILTER SIDEBAR
          ================================================== */}

          <aside
            className={`${
              showFilters
                ? "block"
                : "hidden"
            } lg:block`}
          >
            <div className="sticky top-24 border-2 border-[#D5D7D1] bg-white">
              {/* FILTER HEADER */}

              <div className="flex items-center justify-between border-b border-[#E2E1D9] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                    <SlidersHorizontal
                      size={15}
                    />
                  </span>

                  <h3 className="text-sm font-bold text-[#26372C]">
                    Refine results
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(false)
                  }
                  className="p-1 text-[#777D76] hover:text-[#26372C] lg:hidden"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-7 p-5">
                {/* ROOM TYPE */}

                <div>
                  <label
                    htmlFor="room-type"
                    className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#747A73]"
                  >
                    Room type
                  </label>

                  <div className="relative">
                    <select
                      id="room-type"
                      value={roomType}
                      onChange={(event) =>
                        setRoomType(
                          event.target.value
                        )
                      }
                      className="w-full appearance-none border-2 border-[#D2D6D0] bg-white px-4 py-3.5 pr-11 text-sm font-semibold !text-[#26372C] outline-none transition-all focus:border-[#173F2B] focus:ring-2 focus:ring-[#E9EFE7]"
                    >
                      <option value="">
                        All types
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

                    <ChevronDown
                      size={17}
                      strokeWidth={2.5}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#26372C]"
                    />
                  </div>
                </div>

                {/* BUDGET */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#747A73]">
                    Monthly budget
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-[#59615A]">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={minRent}
                        onChange={(event) =>
                          setMinRent(
                            event.target.value
                          )
                        }
                        placeholder="Min"
                        className="w-full border-2 border-[#D2D6D0] bg-white py-3.5 pl-8 pr-2 text-sm font-semibold !text-[#171A18] caret-[#173F2B] outline-none transition-all placeholder:!text-[#858B84] focus:border-[#173F2B] focus:ring-2 focus:ring-[#E9EFE7]"
                      />
                    </div>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-[#59615A]">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={maxRent}
                        onChange={(event) =>
                          setMaxRent(
                            event.target.value
                          )
                        }
                        placeholder="Max"
                        className="w-full border-2 border-[#D2D6D0] bg-white py-3.5 pl-8 pr-2 text-sm font-semibold !text-[#171A18] caret-[#173F2B] outline-none transition-all placeholder:!text-[#858B84] focus:border-[#173F2B] focus:ring-2 focus:ring-[#E9EFE7]"
                      />
                    </div>
                  </div>
                </div>

                {/* QUICK BUDGET */}

                <div>
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#747A73]">
                    Quick budget
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      [
                        "Under ₹5k",
                        "",
                        "5000",
                      ],
                      [
                        "₹5k–₹10k",
                        "5000",
                        "10000",
                      ],
                      [
                        "₹10k–₹20k",
                        "10000",
                        "20000",
                      ],
                    ].map(
                      ([
                        label,
                        minimum,
                        maximum,
                      ]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            setMinRent(
                              minimum
                            );
                            setMaxRent(
                              maximum
                            );
                          }}
                          className="border-2 border-[#D9DCD6] bg-[#FAFAF6] px-2.5 py-2 text-[10px] font-semibold text-[#59635B] transition hover:border-[#AEB9AF] hover:bg-[#E9EFE7] hover:text-[#173F2B]"
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* APPLY */}

                <button
                  type="button"
                  onClick={applyFilters}
                  disabled={searching}
                  className="flex w-full items-center justify-center gap-2 bg-[#173F2B] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#102F20] disabled:cursor-wait disabled:opacity-70"
                >
                  {searching ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Applying...
                    </>
                  ) : (
                    <>
                      Apply filters
                      <ArrowUpRight
                        size={15}
                      />
                    </>
                  )}
                </button>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#777D76] transition hover:text-[#173F2B]"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ==================================================
              RESULTS GRID
          ================================================== */}

          <div className="min-w-0">
            {showSkeleton ? (
              <LoadingGrid />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={fetchRooms}
              />
            ) : filteredRooms.length ===
              0 ? (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
                search={activeSearch}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredRooms.map(
                  (room) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

// ============================================================
// FILTER TAG
// ============================================================

const FilterTag = ({
  label,
  onRemove,
}) => {
  return (
    <div className="flex items-center gap-2 border border-[#C8D5C9] bg-[#E9EFE7] px-3 py-2 text-[10px] font-bold text-[#31543D]">
      <span>{label}</span>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-5 w-5 items-center justify-center text-[#55745F] transition hover:text-[#173F2B]"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </div>
  );
};

// ============================================================
// LOADING SKELETON
// ============================================================

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden border-2 border-[#DDDCD3] bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-[#E4E3DB]" />

          <div className="space-y-4 p-5">
            <div className="h-5 w-3/4 animate-pulse bg-[#E4E3DB]" />

            <div className="h-4 w-1/2 animate-pulse bg-[#EEEDE7]" />

            <div className="h-px bg-[#EEEDE7]" />

            <div className="h-7 w-1/3 animate-pulse bg-[#E4E3DB]" />

            <div className="flex gap-2">
              <div className="h-7 w-16 animate-pulse bg-[#EEEDE7]" />

              <div className="h-7 w-20 animate-pulse bg-[#EEEDE7]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// ERROR STATE
// ============================================================

const ErrorState = ({
  message,
  onRetry,
}) => {
  return (
    <div className="border-2 border-[#DDDCD3] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F5E5DE] text-[#A95336]">
        <X size={21} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#171A18]">
        Something went wrong
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777B75]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 bg-[#173F2B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#102F20]"
      >
        Try again
      </button>
    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({
  hasFilters,
  onClear,
  search,
}) => {
  return (
    <div className="border-2 border-[#D8D7CE] bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
        <Home size={25} />
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-[#171A18]">
        No rooms found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777B75]">
        {search
          ? `We couldn't find any room matching "${search}". Try another area, city, address or keyword.`
          : hasFilters
          ? "Try changing your room type or budget."
          : "There are no room listings available right now."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 bg-[#173F2B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#102F20]"
        >
          <RotateCcw size={14} />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FindRooms;