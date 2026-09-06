import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      const { token, user } = response.data;

      login(user, token);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-10">

        <div className="grid w-full overflow-hidden border border-[#DADBD2] bg-white lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              LEFT BRAND PANEL
          ================================================= */}

          <div className="relative hidden overflow-hidden bg-[#173F2B] p-10 text-white lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-[#E6B84A]/20" />

            <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full border-[35px] border-[#C96B45]/20" />

            <div className="relative">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center bg-[#E6B84A] text-[#173F2B]">
                  <span className="text-xl font-black">
                    P
                  </span>
                </div>

                <span className="text-lg font-bold tracking-tight">
                  Pluto
                </span>

              </div>

              <div className="mt-24 max-w-md">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6B84A]">
                  Community room discovery
                </p>

                <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-[-0.04em]">
                  Find a space.
                  <br />
                  Make it yours.
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-[#C9D3CB]">
                  Discover rooms shared by people in your
                  city and connect directly with the person
                  who posted them.
                </p>

              </div>

            </div>

            <div className="relative border-t border-white/15 pt-5">

              <div className="flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-[#E6B84A]" />

                <p className="text-xs text-[#B9C5BC]">
                  Real spaces · Real people · Direct contact
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT LOGIN
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center justify-center p-6 sm:p-10 lg:p-14"
          >

            <div className="w-full max-w-md">

              {/* Mobile logo */}

              <div className="mb-10 lg:hidden">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                    <span className="text-lg font-black">
                      P
                    </span>
                  </div>

                  <span className="text-lg font-bold text-[#173F2B]">
                    Pluto
                  </span>

                </div>

              </div>

              {/* Header */}

              <div className="mb-8">

                <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                  <KeyRound size={19} />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96B45]">
                  Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-[#171A18]">
                  Login to Pluto
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#747872]">
                  Continue exploring rooms and spaces
                  around you.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#526056]">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788078]"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="
                        w-full
                        border
                        border-[#D9DBD3]
                        bg-[#FAFAF6]
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-[#171A18]
                        caret-[#173F2B]
                        outline-none
                        placeholder:text-[#92968F]
                        focus:border-[#173F2B]
                        focus:bg-white
                        transition
                      "
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#526056]">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788078]"
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="
                        w-full
                        border
                        border-[#D9DBD3]
                        bg-[#FAFAF6]
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-[#171A18]
                        caret-[#173F2B]
                        outline-none
                        placeholder:text-[#92968F]
                        focus:border-[#173F2B]
                        focus:bg-white
                        transition
                      "
                    />

                  </div>

                </div>

                {/* Error */}

                {error && (
                  <div className="border border-[#E3B8A8] bg-[#FFF3EE] px-4 py-3 text-sm text-[#A64E32]">
                    {error}
                  </div>
                )}

                {/* Success */}

                {message && (
                  <div className="border border-[#BFD1C1] bg-[#EDF5ED] px-4 py-3 text-sm text-[#285B38]">
                    {message}
                  </div>
                )}

                {/* Button */}

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    bg-[#173F2B]
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-[#24583D]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    "Logging in..."
                  ) : (
                    <>
                      Login
                      <ArrowRight size={17} />
                    </>
                  )}
                </motion.button>

              </form>

              {/* Signup */}

              <div className="mt-8 border-t border-[#E7E6DE] pt-6 text-center">

                <p className="text-sm text-[#747872]">
                  Don't have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-bold text-[#173F2B] hover:text-[#C96B45]"
                  >
                    Create Account
                  </Link>
                </p>

              </div>

              <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.13em] text-[#A0A39D]">
                Pluto · Community room discovery
              </p>

            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Login;