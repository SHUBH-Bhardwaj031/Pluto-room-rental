import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Users,
  Home as HomeIcon,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms"
        );

        setRooms(response.data.rooms.slice(0, 3));
      } catch (error) {
        console.error("Fetch rooms error:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="pluto-page text-white overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[720px] flex items-center px-4 py-20 pluto-grid">

        {/* Ambient background glows */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute top-[5%] left-[8%] w-[420px] h-[420px] bg-indigo-600/10 rounded-full blur-[150px]" />

          <div className="absolute top-[25%] right-[5%] w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-[150px]" />

          <div className="absolute bottom-[-10%] left-[40%] w-[400px] h-[300px] bg-pink-600/[0.04] rounded-full blur-[150px]" />

        </div>

        {/* Hero content */}

        <div className="relative max-w-6xl mx-auto w-full">

          {/* Badge */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl mb-8 shadow-[0_0_30px_rgba(124,58,237,0.06)]"
          >
            <Sparkles
              size={16}
              className="text-indigo-400"
            />

            <span className="text-sm text-zinc-300">
              Community powered room discovery
            </span>
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Find a place
            <br />

            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              that feels like home.
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="max-w-2xl text-lg md:text-xl text-zinc-400 mt-7 leading-relaxed"
          >
            Discover rooms, flats and shared spaces around you.
            Explore real listings posted by the Pluto community.
          </motion.p>

          {/* Search */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
            className="mt-10 max-w-3xl"
          >
            <div className="bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

              <div className="flex flex-col md:flex-row gap-2">

                <div className="flex items-center gap-3 flex-1 px-4 py-3">

                  <MapPin
                    size={20}
                    className="text-indigo-400 shrink-0"
                  />

                  <input
                    type="text"
                    placeholder="Where do you want to live?"
                    className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(
                          `/find-rooms?city=${encodeURIComponent(
                            e.target.value
                          )}`
                        );
                      }
                    }}
                  />

                </div>

                <button
                  onClick={() => navigate("/find-rooms")}
                  className="flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300"
                >
                  <Search size={18} />
                  Find Rooms
                </button>

              </div>
            </div>

            <p className="text-xs text-zinc-600 mt-3 ml-2">
              Try searching for Lucknow, Delhi, Bangalore...
            </p>

          </motion.div>

          {/* Quick Stats */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            className="flex flex-wrap gap-8 mt-14"
          >

            <div>
              <p className="text-2xl font-bold">
                100%
              </p>

              <p className="text-sm text-zinc-500">
                Community driven
              </p>
            </div>

            <div className="h-10 w-px bg-zinc-800 hidden sm:block" />

            <div>
              <p className="text-2xl font-bold">
                Easy
              </p>

              <p className="text-sm text-zinc-500">
                Direct contact
              </p>
            </div>

            <div className="h-10 w-px bg-zinc-800 hidden sm:block" />

            <div>
              <p className="text-2xl font-bold">
                Free
              </p>

              <p className="text-sm text-zinc-500">
                To discover
              </p>
            </div>

          </motion.div>

        </div>
      </section>

      {/* =====================================================
          FEATURED ROOMS
      ===================================================== */}

      <section className="relative px-4 py-24 border-t border-zinc-900/80 pluto-section">

        {/* Ambient glow */}

        <div className="absolute top-0 left-[15%] w-[300px] h-[220px] bg-indigo-600/[0.035] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

            <div>

              <p className="text-indigo-400 text-sm font-medium mb-2">
                Fresh listings
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Rooms people are sharing
              </h2>

              <p className="text-zinc-500 mt-2">
                Explore the latest spaces posted by the community.
              </p>

            </div>

            <button
              onClick={() => navigate("/find-rooms")}
              className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
            >
              View all rooms

              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

          </div>

          {rooms.length > 0 ? (

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >

              {rooms.map((room) => (

                <motion.div
                  key={room._id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={() =>
                    navigate(`/rooms/${room._id}`)
                  }
                  className="group cursor-pointer bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_20px_60px_rgba(99,102,241,0.10)] transition-all duration-300"
                >

                  {/* Image */}

                  <div className="h-52 bg-zinc-900 relative overflow-hidden">

                    {room.images?.length > 0 ? (

                      <img
                        src={`http://localhost:5000${room.images[0]}`}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                    ) : (

                      <div className="absolute inset-0 flex items-center justify-center">

                        <HomeIcon
                          size={45}
                          className="text-zinc-800 group-hover:text-indigo-500/30 group-hover:scale-110 transition-all duration-500"
                        />

                      </div>

                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-4 left-4 text-xs bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-indigo-300">
                      {room.roomType}
                    </span>

                  </div>

                  {/* Content */}

                  <div className="p-5">

                    <h3 className="text-xl font-semibold group-hover:text-indigo-300 transition">
                      {room.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2">

                      <MapPin size={15} />

                      {room.location.locality},{" "}
                      {room.location.city}

                    </div>

                    <div className="flex items-end justify-between mt-6">

                      <div>

                        <p className="text-2xl font-bold">
                          ₹{room.rent}
                        </p>

                        <p className="text-xs text-zinc-600">
                          per month
                        </p>

                      </div>

                      <ArrowRight
                        size={20}
                        className="text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                      />

                    </div>

                  </div>

                </motion.div>

              ))}

            </motion.div>

          ) : (

            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-12 text-center backdrop-blur-xl">

              <HomeIcon
                size={40}
                className="mx-auto text-zinc-700"
              />

              <p className="text-zinc-500 mt-4">
                No rooms posted yet.
              </p>

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          COMMUNITY
      ===================================================== */}

      <section className="relative px-4 py-24 pluto-section">

        <div className="absolute right-[5%] top-[20%] w-[350px] h-[300px] bg-purple-600/[0.025] blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">

          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}

            <motion.div
              whileHover={{ y: -6 }}
              className="group bg-zinc-950/75 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-7 hover:border-indigo-500/25 hover:bg-zinc-900/70 transition-all duration-300"
            >

              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
                <Users
                  size={22}
                  className="text-indigo-400"
                />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Built by the community
              </h3>

              <p className="text-zinc-500 mt-3 leading-6">
                Anyone can share a room and help someone find
                their next place.
              </p>

            </motion.div>

            {/* Card 2 */}

            <motion.div
              whileHover={{ y: -6 }}
              className="group bg-zinc-950/75 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-7 hover:border-purple-500/25 hover:bg-zinc-900/70 transition-all duration-300"
            >

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center">
                <MapPin
                  size={22}
                  className="text-purple-400"
                />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Search by location
              </h3>

              <p className="text-zinc-500 mt-3 leading-6">
                Find rooms around your preferred city or locality
                without endless searching.
              </p>

            </motion.div>

            {/* Card 3 */}

            <motion.div
              whileHover={{ y: -6 }}
              className="group bg-zinc-950/75 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-7 hover:border-pink-500/25 hover:bg-zinc-900/70 transition-all duration-300"
            >

              <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/15 flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-pink-400"
                />
              </div>

              <h3 className="text-xl font-semibold mt-6">
                Direct connection
              </h3>

              <p className="text-zinc-500 mt-3 leading-6">
                Contact the person who posted the room directly.
                No unnecessary middle layer.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative px-4 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-zinc-950 to-indigo-950/20 p-8 md:p-14">

            {/* CTA glows */}

            <div className="absolute -top-40 -right-32 w-[420px] h-[420px] bg-indigo-600/10 blur-[130px] rounded-full" />

            <div className="absolute -bottom-40 left-[25%] w-[300px] h-[250px] bg-purple-600/[0.05] blur-[120px] rounded-full" />

            {/* Content */}

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">

              <div>

                <p className="text-indigo-400 text-sm font-medium">
                  Have a room?
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  Share it with Pluto.
                </h2>

                <p className="text-zinc-500 mt-3 max-w-xl">
                  Post your room and help someone discover a
                  better place to live.
                </p>

              </div>

              <button
                onClick={() => navigate("/add-room")}
                className="shrink-0 flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]"
              >
                Post a Room
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;