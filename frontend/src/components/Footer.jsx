const Footer = () => {
  return (
    <footer className="bg-[#173F2B] text-[#F5F3EA]">

      {/* =========================
          MAIN FOOTER
      ========================== */}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        <div className="py-14 sm:py-16">

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12 md:gap-16">

            {/* =========================
                BRAND
            ========================== */}

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 border border-[#E6B84A] rotate-45 flex items-center justify-center">
                  <span className="-rotate-45 text-sm font-semibold text-[#E6B84A]">
                    P
                  </span>
                </div>

                <div className="ml-1">
                  <h2 className="text-xl font-semibold tracking-[-0.04em]">
                    Pluto
                  </h2>

                  <p className="text-[8px] uppercase tracking-[0.22em] text-[#B9C5B9] mt-1">
                    Find your space
                  </p>
                </div>

              </div>

              <p className="max-w-sm text-sm leading-6 text-[#C7D0C7] mt-7">
                Find rooms, discover shared spaces and connect directly
                with people in your community.
              </p>

            </div>

            {/* =========================
                EXPLORE
            ========================== */}

            <div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#E6B84A] mb-5">
                Explore
              </p>

              <div className="flex flex-col gap-3">

                <a
                  href="/"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Home
                </a>

                <a
                  href="/find-rooms"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Find Rooms
                </a>

                <a
                  href="/add-room"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Add a Room
                </a>

              </div>

            </div>

            {/* =========================
                COMMUNITY
            ========================== */}

            <div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#E6B84A] mb-5">
                Community
              </p>

              <div className="flex flex-col gap-3">

                <a
                  href="/saved-rooms"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Saved Rooms
                </a>

                <a
                  href="/notifications"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Notifications
                </a>

                <a
                  href="/profile"
                  className="w-fit text-sm text-[#D8DED8] hover:text-white transition-colors"
                >
                  Profile
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            BOTTOM BAR
        ========================== */}

        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <p className="text-xs text-[#AEB9AE]">
            © {new Date().getFullYear()} Pluto. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#AEB9AE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
            <span>Rooms by people, for people.</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;