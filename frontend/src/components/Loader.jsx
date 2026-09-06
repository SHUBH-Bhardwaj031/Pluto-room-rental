import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Loader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5F3EA]">

      <div className="flex flex-col items-center">

        {/* Pluto Mark */}

        <div className="relative w-14 h-14 flex items-center justify-center mb-5">

          <div
            className="
              absolute inset-0
              border-2 border-[#173F2B]
              rotate-45
              animate-[spin_2.5s_linear_infinite]
            "
          />

          <span className="relative text-xl font-semibold text-[#173F2B]">
            P
          </span>

        </div>

        {/* Loading text */}

        <div className="flex items-center gap-2">

          <span className="text-[11px] uppercase tracking-[0.22em] text-[#747872]">
            Loading Pluto
          </span>

          <span className="flex gap-1">

            <span className="w-1 h-1 rounded-full bg-[#E6B84A] animate-pulse" />

            <span
              className="
                w-1 h-1 rounded-full
                bg-[#E6B84A]
                animate-pulse
                [animation-delay:150ms]
              "
            />

            <span
              className="
                w-1 h-1 rounded-full
                bg-[#E6B84A]
                animate-pulse
                [animation-delay:300ms]
              "
            />

          </span>

        </div>

      </div>

    </div>
  );
};

export default Loader;