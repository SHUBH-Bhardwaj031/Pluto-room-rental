import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  MapPin,
  Users,
  ShieldCheck,
  Home as HomeIcon,
  Plus,
  Compass,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

import RoomCard from "../components/RoomCard";

const Home = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms`
        );

        setRooms((response.data.rooms || []).slice(0, 3));
      } catch (error) {
        console.error("Fetch rooms error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const city = searchCity.trim();

    if (city) {
      navigate(`/find-rooms?city=${encodeURIComponent(city)}`);
    } else {
      navigate("/find-rooms");
    }
  };

  const searchByCity = (city) => {
    setSearchCity(city);
    navigate(`/find-rooms?city=${encodeURIComponent(city)}`);
  };

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#DDDCD3] bg-[#F5F3EA]">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-28 -top-28 h-[440px] w-[440px] rounded-full border border-[#D8D8CB]" />

          <div className="absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full border border-[#E3E1D7]" />

          <div className="absolute bottom-[-170px] left-[-120px] h-[360px] w-[360px] rounded-full border border-[#DFDED4]" />

          <div className="absolute right-[31%] top-[17%] h-3 w-3 rounded-full bg-[#E6B84A]" />

          <div className="absolute right-[12%] top-[32%] h-2 w-2 rounded-full bg-[#C96B45]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-7 flex items-center gap-3"
              >
                <span className="flex h-8 w-8 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <HomeIcon size={15} strokeWidth={2.5} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#55745F]">
                    Pluto
                  </p>

                  <p className="text-xs font-semibold text-[#747872]">
                    Rooms by people, for people.
                  </p>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                className="max-w-3xl text-[2.8rem] font-bold leading-[0.98] tracking-[-0.055em] text-[#171A18] sm:text-5xl lg:text-[5.2rem]"
              >
                A better way
                <br />
                to find your
                <br />

                <span className="relative inline-block text-[#173F2B]">
                  next place.
                  <span className="absolute -bottom-1 left-0 h-[5px] w-[72%] bg-[#E6B84A]" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="mt-7 max-w-xl text-base leading-7 text-[#6E736E] sm:text-lg"
              >
                Discover rooms, flats and shared spaces
                posted by people in your community.
                Search a location, explore the details
                and connect directly.
              </motion.p>

              {/* SEARCH */}
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.27 }}
                onSubmit={handleSearch}
                className="mt-9 flex max-w-2xl flex-col border border-[#CFCFC5] bg-white p-1.5 shadow-[0_14px_35px_rgba(23,63,43,0.08)] sm:flex-row"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5">
                  <MapPin
                    size={19}
                    strokeWidth={2}
                    className="shrink-0 text-[#173F2B]"
                  />

                  <div className="min-w-0 flex-1">
                    <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#8A8D87]">
                      Where do you want to live?
                    </label>

                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) =>
                        setSearchCity(e.target.value)
                      }
                      placeholder="Enter a city..."
                      className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#171A18] outline-none placeholder:text-[#A0A29C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-[#173F2B] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#102F20]"
                >
                  <Search size={17} />
                  Find rooms
                </button>
              </motion.form>

              {/* CITY SHORTCUTS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"
              >
                <span className="text-xs font-semibold text-[#969992]">
                  Popular:
                </span>

                {["Lucknow", "Delhi", "Bangalore", "Pune"].map(
                  (city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => searchByCity(city)}
                      className="text-xs font-bold text-[#3D5144] underline decoration-[#C9C8BE] underline-offset-4 transition hover:text-[#173F2B]"
                    >
                      {city}
                    </button>
                  )
                )}
              </motion.div>
            </div>

            {/* RIGHT VISUAL */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:block"
            >
              <div className="relative mx-auto max-w-[520px]">
                {/* Main visual */}
                <div className="relative border border-[#D6D5CB] bg-white p-4 shadow-[0_28px_65px_rgba(23,63,43,0.12)]">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#E2E1D9] pb-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#92958E]">
                        Explore
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#171A18]">
                        Spaces around you
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#E6B84A]" />

                      <span className="text-[10px] font-bold text-[#69706A]">
                        Live listings
                      </span>
                    </div>
                  </div>

                  {/* MAP */}
                  <div className="relative mt-4 h-[335px] overflow-hidden border border-[#DEDDD5] bg-[#EEF0E8]">
                    {/* Roads */}
                    <div className="absolute left-[-5%] top-[31%] h-[2px] w-[110%] rotate-[16deg] bg-white" />

                    <div className="absolute left-[-10%] top-[58%] h-[2px] w-[120%] rotate-[-10deg] bg-white" />

                    <div className="absolute left-[24%] top-[-10%] h-[120%] w-[2px] rotate-[18deg] bg-white" />

                    <div className="absolute left-[64%] top-[-10%] h-[120%] w-[2px] rotate-[-25deg] bg-white" />

                    {/* Green areas */}
                    <div className="absolute left-[5%] top-[8%] h-20 w-32 rounded-[45%] bg-[#DCE5D9]" />

                    <div className="absolute bottom-[8%] right-[3%] h-24 w-36 rounded-[50%] bg-[#DCE5D9]" />

                    <div className="absolute left-[42%] top-[43%] h-28 w-24 rounded-[50%] bg-[#D7E1D5]" />

                    {/* Buildings */}
                    <div className="absolute left-[10%] top-[52%] grid grid-cols-4 gap-1 opacity-60">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 bg-[#D1D3CA]"
                        />
                      ))}
                    </div>

                    <div className="absolute right-[10%] top-[15%] grid grid-cols-3 gap-1 opacity-60">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-5 w-5 bg-[#D1D3CA]"
                        />
                      ))}
                    </div>

                    {/* Pins */}
                    <MapPinVisual
                      className="left-[24%] top-[29%]"
                    />

                    <MapPinVisual
                      className="right-[24%] top-[23%]"
                      yellow
                    />

                    <MapPinVisual
                      className="left-[47%] top-[55%]"
                      active
                    />

                    <MapPinVisual
                      className="right-[31%] bottom-[22%]"
                    />

                    {/* Selected listing */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-[#D8D7CE] bg-white px-4 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.10)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                          <HomeIcon size={16} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#171A18]">
                            Rooms near you
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#888B85]">
                            12 available spaces
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="text-[#173F2B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating stat */}
                <div className="absolute -bottom-6 -left-7 flex items-center gap-3 border border-[#D7D6CC] bg-white px-5 py-4 shadow-[0_14px_35px_rgba(23,63,43,0.12)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7E9B9] text-[#80651D]">
                    <Compass size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#969992]">
                      Your search
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-[#26372C]">
                      Search → Explore → Connect
                    </p>
                  </div>
                </div>

                {/* Yellow detail */}
                <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6B84A] text-[#173F2B] shadow-lg">
                  <MapPin size={19} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}
      <section className="border-b border-[#DDDCD3] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-3">
          <TrustItem
            icon={<Users size={18} />}
            title="Community driven"
            text="Listings shared by people, not agencies."
          />

          <TrustItem
            icon={<MapPin size={18} />}
            title="Location focused"
            text="Search by city and neighbourhood."
          />

          <TrustItem
            icon={<ShieldCheck size={18} />}
            title="Direct connection"
            text="Talk directly to the person who posted."
          />
        </div>
      </section>

      {/* =========================================================
          RECENT LISTINGS
      ========================================================= */}
      <section className="bg-[#F5F3EA]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#173F2B]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                  Fresh from the community
                </p>
              </div>

              <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight tracking-[-0.035em] text-[#171A18] sm:text-4xl">
                Places people are
                <span className="text-[#173F2B]">
                  {" "}
                  sharing right now.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <p className="max-w-md text-sm leading-6 text-[#777B75]">
                Browse the latest spaces added to Pluto.
                Every listing has its own details,
                location and contact information.
              </p>

              <button
                type="button"
                onClick={() => navigate("/find-rooms")}
                className="group flex w-fit shrink-0 items-center gap-2 border-b border-[#B9B9AF] pb-1 text-sm font-bold text-[#26372C] transition hover:border-[#173F2B] hover:text-[#173F2B]"
              >
                See all rooms

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <HomeCardSkeleton />
              <HomeCardSkeleton />
              <HomeCardSkeleton />
            </div>
          ) : rooms.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {rooms.map((room) => (
                <motion.div
                  key={room._id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.45,
                      },
                    },
                  }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="mt-10 border border-[#D9D8CF] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                <HomeIcon size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#171A18]">
                No listings yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777B75]">
                Be the first person to share a space
                with the Pluto community.
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-room")}
                className="mt-6 inline-flex items-center gap-2 bg-[#173F2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102F20]"
              >
                <Plus size={16} />
                Post a room
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="border-y border-[#DDDCD3] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#E6B84A]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                  How Pluto works
                </p>
              </div>

              <h2 className="mt-4 max-w-md text-3xl font-bold leading-tight tracking-[-0.035em] text-[#171A18] sm:text-4xl">
                From searching to
                <span className="text-[#173F2B]">
                  {" "}
                  moving in.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#777B75]">
                No complicated process. Pluto gives you
                the tools to discover a place and connect
                with the person behind it.
              </p>
            </div>

            <div className="border-y border-[#DDDCD3]">
              <HowStep
                number="01"
                title="Search your area"
                text="Enter a city or locality and discover rooms available around the places you care about."
              />

              <HowStep
                number="02"
                title="Compare real listings"
                text="See rent, room type, amenities, photos and location before deciding what interests you."
              />

              <HowStep
                number="03"
                title="Connect directly"
                text="Contact the person who posted the room and continue the conversation directly."
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMMUNITY / POST CTA
      ========================================================= */}
      <section className="bg-[#173F2B]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center bg-[#E6B84A] text-[#173F2B]">
                  <Plus size={17} strokeWidth={2.5} />
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D8E0D8]">
                  Share a space
                </p>
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                Have a room someone else
                <br className="hidden sm:block" />
                could call home?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#C1CCC2]">
                Post the details on Pluto and let people
                searching in your area discover your
                space.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/add-room")}
              className="group flex w-fit items-center gap-3 bg-[#E6B84A] px-6 py-4 text-sm font-bold text-[#173F2B] transition hover:bg-[#F0C75B]"
            >
              Post a room

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>
      
    </main>
  );
};

/* =============================================================
   MAP PIN
============================================================= */

const MapPinVisual = ({
  className = "",
  active = false,
  yellow = false,
}) => {
  return (
    <div
      className={`
        absolute
        ${className}
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border-2
        border-white
        shadow-[0_5px_15px_rgba(23,63,43,0.18)]
        ${
          active
            ? "bg-[#173F2B] text-[#E6B84A]"
            : yellow
            ? "bg-[#E6B84A] text-[#173F2B]"
            : "bg-white text-[#173F2B]"
        }
      `}
    >
      <MapPin size={15} strokeWidth={2.5} />

      {active && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-[#C96B45]" />
      )}
    </div>
  );
};

/* =============================================================
   TRUST ITEM
============================================================= */

const TrustItem = ({ icon, title, text }) => {
  return (
    <div className="flex items-center gap-4 border-[#DDDCD3] px-5 py-6 sm:border-r sm:px-7 last:border-r-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-[#26372C]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#81857F]">
          {text}
        </p>
      </div>
    </div>
  );
};

/* =============================================================
   HOW STEP
============================================================= */

const HowStep = ({
  number,
  title,
  text,
  last = false,
}) => {
  return (
    <div
      className={`
        flex
        gap-5
        py-7
        sm:gap-8
        ${!last ? "border-b border-[#DDDCD3]" : ""}
      `}
    >
      <span className="w-8 shrink-0 pt-1 text-xs font-bold tracking-[0.12em] text-[#C96B45]">
        {number}
      </span>

      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <h3 className="text-lg font-bold text-[#171A18]">
            {title}
          </h3>

          <Check
            size={17}
            className="mt-1 shrink-0 text-[#173F2B]"
          />
        </div>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#777B75]">
          {text}
        </p>
      </div>
    </div>
  );
};

/* =============================================================
   LOADING CARD
============================================================= */

const HomeCardSkeleton = () => {
  return (
    <div className="overflow-hidden border border-[#DDDCD3] bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#E4E3DB]" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse bg-[#E4E3DB]" />

        <div className="h-4 w-1/2 animate-pulse bg-[#EEEDE7]" />

        <div className="border-t border-[#EEEDE7] pt-4">
          <div className="h-7 w-1/3 animate-pulse bg-[#E4E3DB]" />
        </div>

        <div className="flex gap-2">
          <div className="h-7 w-16 animate-pulse bg-[#EEEDE7]" />
          <div className="h-7 w-20 animate-pulse bg-[#EEEDE7]" />
        </div>
      </div>
    </div>
  );
};

export default Home;