import {
  Bell,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#DDDCD3] bg-[#F5F3EA]">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">

          <div className="flex items-end justify-between gap-6">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Bell size={17} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96B45]">
                  Stay updated
                </span>

              </div>

              <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
                Notifications
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#747872]">
                Updates about your rooms, saved spaces,
                and activity on Pluto.
              </p>

            </div>

            <div className="hidden sm:flex h-10 w-10 items-center justify-center border border-[#D9DBD3] bg-white text-[#55745F]">
              <CheckCheck size={18} />
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:px-10">

        <div className="border border-[#DDDCD3] bg-white">

          {/* Top */}

          <div className="flex items-center justify-between border-b border-[#E7E6DE] px-5 py-4 sm:px-6">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#979A93]">
                Inbox
              </p>

              <p className="mt-1 text-sm font-bold text-[#26372C]">
                No new notifications
              </p>

            </div>

            <span className="bg-[#E9EFE7] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#55745F]">
              All caught up
            </span>

          </div>

          {/* Empty */}

          <div className="px-6 py-24 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F7F6F0] text-[#A0A39D]">
              <Bell size={27} />
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Nothing here yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#747872]">
              When there's something important to tell
              you, your notifications will appear here.
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

        </div>

      </main>

    </div>
  );
};

export default Notifications;