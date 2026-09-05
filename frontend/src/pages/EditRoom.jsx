import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ImagePlus,
  X,
  Save,
} from "lucide-react";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    roomType: "Single",
    amenities: "",
    address: "",
    city: "",
    locality: "",
    latitude: "",
    longitude: "",
    contactName: "",
    phone: "",
    whatsapp: "",
    status: "available",
  });

  /* ================= FETCH ROOM ================= */

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/${id}`
        );

        const room = response.data.room;

        const coordinates =
          room.location?.coordinates?.coordinates || [];

        setFormData({
          title: room.title || "",
          description: room.description || "",
          rent: room.rent || "",
          roomType: room.roomType || "Single",

          amenities:
            room.amenities?.join(", ") || "",

          address:
            room.location?.address || "",

          city:
            room.location?.city || "",

          locality:
            room.location?.locality || "",

          longitude:
            coordinates.length === 2
              ? coordinates[0]
              : "",

          latitude:
            coordinates.length === 2
              ? coordinates[1]
              : "",

          contactName:
            room.contact?.name || "",

          phone:
            room.contact?.phone || "",

          whatsapp:
            room.contact?.whatsapp || "",

          status:
            room.status || "available",
        });
      } catch (error) {
        console.error(
          "Fetch room error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Unable to load room"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= IMAGES ================= */

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    if (selectedFiles.length > 5) {
      setMessage(
        "You can upload maximum 5 images."
      );
      return;
    }

    setImages(selectedFiles);
    setMessage("");
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const roomData = new FormData();

      roomData.append(
        "title",
        formData.title
      );

      roomData.append(
        "description",
        formData.description
      );

      roomData.append(
        "rent",
        Number(formData.rent)
      );

      roomData.append(
        "roomType",
        formData.roomType
      );

      roomData.append(
        "status",
        formData.status
      );

      roomData.append(
        "amenities",
        JSON.stringify(
          formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      roomData.append(
        "location",
        JSON.stringify({
          address: formData.address,
          city: formData.city,
          locality: formData.locality,
          coordinates: {
            type: "Point",
            coordinates: [
              Number(formData.longitude),
              Number(formData.latitude),
            ],
          },
        })
      );

      roomData.append(
        "contact",
        JSON.stringify({
          name: formData.contactName,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        })
      );

      images.forEach((image) => {
        roomData.append("images", image);
      });

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/rooms/${id}`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-posts");
    } catch (error) {
      console.error(
        "Update room error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to update room"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white py-10 sm:py-14">

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/my-posts")
            }
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mb-5"
          >
            <ArrowLeft size={16} />
            Back to My Posts
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Edit Room
          </h1>

          <p className="text-zinc-500 mt-2">
            Update your room listing details.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-8"
        >

          {message && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {message}
            </div>
          )}

          {/* BASIC DETAILS */}

          <div className="space-y-5">

            <h2 className="text-lg font-semibold">
              Basic Details
            </h2>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Room title"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the room..."
              rows={5}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleChange}
                placeholder="Monthly rent"
                required
                min="0"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
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

            </div>

            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Amenities: WiFi, AC, Parking"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />

            {/* STATUS */}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Listing Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="available">
                  Available
                </option>

                <option value="unavailable">
                  Unavailable
                </option>
              </select>
            </div>

          </div>

          {/* LOCATION */}

          <div className="mt-10 pt-8 border-t border-zinc-800 space-y-5">

            <h2 className="text-lg font-semibold">
              Location
            </h2>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

              <input
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Locality"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

            </div>

          </div>

          {/* CONTACT */}

          <div className="mt-10 pt-8 border-t border-zinc-800 space-y-5">

            <h2 className="text-lg font-semibold">
              Contact Details
            </h2>

            <input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Contact name"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp number"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

            </div>

          </div>

          {/* IMAGES */}

          <div className="mt-10 pt-8 border-t border-zinc-800">

            <h2 className="text-lg font-semibold mb-2">
              Replace Images
            </h2>

            <p className="text-sm text-zinc-500 mb-5">
              Upload new images only if you want to
              replace the existing images.
            </p>

            <label className="flex flex-col items-center justify-center min-h-36 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-indigo-500/50 cursor-pointer transition-all">

              <ImagePlus
                size={25}
                className="text-zinc-500 mb-2"
              />

              <span className="text-sm text-zinc-400">
                Choose up to 5 images
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">

                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 flex items-center justify-center text-white hover:bg-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* SUBMIT */}

          <div className="mt-10 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/my-posts")
              }
              className="sm:flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium text-sm transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="sm:flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
            >
              <Save size={17} />

              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </section>
  );
};

export default EditRoom;