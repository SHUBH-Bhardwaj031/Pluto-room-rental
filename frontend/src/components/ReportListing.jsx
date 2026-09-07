import { useState } from "react";
import axios from "axios";
import { Flag, X } from "lucide-react";

const ReportListing = ({ roomId, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setMessage("Please select a reason.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("plutoToken");

      if (!token) {
        setMessage("Please login to report this listing.");
        setSuccess(false);
        return;
      }

    const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/reports`,
  {
    roomId,
    reason,
    description,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (response.data.success) {
        setSuccess(true);
        setMessage("Listing reported successfully.");

        setReason("");
        setDescription("");

        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (error) {
      console.error("Report listing error:", error);

      setSuccess(false);

      setMessage(
        error.response?.data?.message ||
          "Unable to report this listing."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-5">
      <div className="w-full max-w-md bg-[#F5F3EA] p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#173F2B]">
              <Flag size={16} />

              <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Safety
              </p>
            </div>

            <h3 className="mt-2 text-xl font-bold text-[#173F2B]">
              Report listing
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#747872]">
              Tell us what is wrong with this listing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#747872] transition-colors hover:text-[#173F2B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-7">

          {/* Reason */}
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
            Reason
          </label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 w-full border border-[#DDDCD3] bg-white px-4 py-3 text-sm text-[#173F2B] outline-none focus:border-[#173F2B]"
          >
            <option value="">
              Select a reason
            </option>

            <option value="Fake / Scam">
              Fake / Scam
            </option>

            <option value="Wrong information">
              Wrong information
            </option>

            <option value="Room no longer available">
              Room no longer available
            </option>

            <option value="Inappropriate content">
              Inappropriate content
            </option>

            <option value="Duplicate listing">
              Duplicate listing
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* Description */}
          <label className="mt-5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
            Additional details
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Optional"
            className="mt-2 w-full resize-none border border-[#DDDCD3] bg-white px-4 py-3 text-sm text-[#173F2B] outline-none placeholder:text-[#A0A39C] focus:border-[#173F2B]"
          />

          {/* Message */}
          {message && (
            <p
              className={`mt-3 text-sm ${
                success
                  ? "text-[#173F2B]"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#173F2B] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportListing;