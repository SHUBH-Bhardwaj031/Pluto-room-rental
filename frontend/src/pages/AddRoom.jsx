import { useState } from "react";
import MapView from "../components/MapView";
import axios from "axios";
import { X, ImagePlus } from "lucide-react";

const AddRoom = () => {
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
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + images.length > 5) {
      setMessage("You can upload maximum 5 images");
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("plutoToken");

      if (!token) {
        setMessage("Please login first");
        setLoading(false);
        return;
      }

      const roomData = new FormData();

      roomData.append("title", formData.title);
      roomData.append("description", formData.description);
      roomData.append("rent", Number(formData.rent));
      roomData.append("roomType", formData.roomType);

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

      const response = await axios.post(
        "http://localhost:5000/api/rooms",
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setFormData({
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
      });

      setImages([]);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.10]
            bg-[linear-gradient(rgba(139,92,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.5)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* Top-left glow */}
        <div
          className="
            absolute
            -top-40
            -left-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-indigo-600/[0.08]
            blur-[140px]
          "
        />

        {/* Right glow */}
        <div
          className="
            absolute
            top-[30%]
            -right-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-purple-600/[0.06]
            blur-[150px]
          "
        />

        {/* Bottom glow */}
        <div
          className="
            absolute
            -bottom-40
            left-[30%]
            w-[450px]
            h-[450px]
            rounded-full
            bg-fuchsia-600/[0.035]
            blur-[140px]
          "
        />

      </div>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10 px-4 py-10">

        <div className="max-w-3xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <p className="text-indigo-400 font-medium mb-2">
              Community Listing
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              Add a Room
            </h1>

            <p className="text-zinc-400 mt-2">
              Share a room with the Pluto community.
            </p>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="
              relative
              bg-zinc-950/90
              backdrop-blur-xl
              border border-zinc-800
              rounded-2xl
              p-6 md:p-8
              space-y-8
              shadow-2xl
              shadow-black/30
            "
          >

            {/* ================= BASIC DETAILS ================= */}

            <section>

              <h2 className="text-xl font-semibold mb-5">
                Basic Details
              </h2>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm text-zinc-300 mb-2">
                    Room Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Spacious room near college"
                    required
                    className="
                      w-full
                      bg-zinc-900
                      border border-zinc-700
                      rounded-lg
                      px-4 py-3
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-1
                      focus:ring-indigo-500/30
                    "
                  />

                </div>

                <div>

                  <label className="block text-sm text-zinc-300 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the room, surroundings, rules..."
                    rows="5"
                    required
                    className="
                      w-full
                      bg-zinc-900
                      border border-zinc-700
                      rounded-lg
                      px-4 py-3
                      outline-none
                      focus:border-indigo-500
                      focus:ring-1
                      focus:ring-indigo-500/30
                      resize-none
                    "
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Monthly Rent
                    </label>

                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      placeholder="₹ 8000"
                      min="0"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Room Type
                    </label>

                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    >
                      <option>Single</option>
                      <option>Shared</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>PG</option>
                      <option>Other</option>
                    </select>

                  </div>

                </div>

                <div>

                  <label className="block text-sm text-zinc-300 mb-2">
                    Amenities
                  </label>

                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="WiFi, Parking, AC, Food"
                    className="
                      w-full
                      bg-zinc-900
                      border border-zinc-700
                      rounded-lg
                      px-4 py-3
                      outline-none
                      focus:border-indigo-500
                      focus:ring-1
                      focus:ring-indigo-500/30
                    "
                  />

                  <p className="text-xs text-zinc-500 mt-2">
                    Separate amenities using commas.
                  </p>

                </div>

              </div>
            </section>

            {/* ================= LOCATION ================= */}

            <section>

              <h2 className="text-xl font-semibold mb-5">
                Location
              </h2>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm text-zinc-300 mb-2">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    required
                    className="
                      w-full
                      bg-zinc-900
                      border border-zinc-700
                      rounded-lg
                      px-4 py-3
                      outline-none
                      focus:border-indigo-500
                      focus:ring-1
                      focus:ring-indigo-500/30
                    "
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lucknow"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Locality
                    </label>

                    <input
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      placeholder="Gomti Nagar"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="26.8467"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="80.9462"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                </div>

                {/* MAP */}

                <div className="mt-2">

                  <div className="mb-3">

                    <h3 className="text-sm font-medium text-zinc-300">
                      Select Location on Map
                    </h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      Click anywhere on the map to select the exact room
                      location.
                    </p>

                  </div>

                  <div className="rounded-2xl overflow-hidden border border-zinc-800">

                    <MapView
                      latitude={formData.latitude || 26.8467}
                      longitude={formData.longitude || 80.9462}
                      selectable={true}
                      onLocationSelect={({ latitude, longitude }) => {
                        setFormData((prev) => ({
                          ...prev,
                          latitude: latitude.toFixed(6),
                          longitude: longitude.toFixed(6),
                        }));
                      }}
                    />

                  </div>

                </div>

              </div>
            </section>

            {/* ================= IMAGES ================= */}

            <section>

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-xl font-semibold">
                    Room Images
                  </h2>

                  <p className="text-sm text-zinc-500 mt-1">
                    Upload up to 5 images of the room.
                  </p>

                </div>

                <span className="text-xs text-zinc-500">
                  {images.length}/5
                </span>

              </div>

              <label
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  w-full
                  min-h-40
                  border-2
                  border-dashed
                  border-zinc-700
                  rounded-xl
                  bg-zinc-900/50
                  hover:border-indigo-500
                  hover:bg-zinc-900
                  transition
                  cursor-pointer
                "
              >

                <ImagePlus
                  size={32}
                  className="text-zinc-500 mb-3"
                />

                <span className="text-sm font-medium text-zinc-300">
                  Click to upload images
                </span>

                <span className="text-xs text-zinc-500 mt-1">
                  PNG, JPG, JPEG · Maximum 5 images
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">

                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="
                        relative
                        aspect-square
                        rounded-xl
                        overflow-hidden
                        border border-zinc-800
                        bg-zinc-900
                      "
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Room ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="
                          absolute
                          top-2
                          right-2
                          w-8
                          h-8
                          rounded-full
                          bg-black/70
                          hover:bg-red-500
                          flex
                          items-center
                          justify-center
                          transition
                        "
                      >
                        <X size={16} />
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* ================= CONTACT ================= */}

            <section>

              <h2 className="text-xl font-semibold mb-5">
                Contact Details
              </h2>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm text-zinc-300 mb-2">
                    Contact Name
                  </label>

                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="
                      w-full
                      bg-zinc-900
                      border border-zinc-700
                      rounded-lg
                      px-4 py-3
                      outline-none
                      focus:border-indigo-500
                      focus:ring-1
                      focus:ring-indigo-500/30
                    "
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-zinc-300 mb-2">
                      WhatsApp
                    </label>

                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="
                        w-full
                        bg-zinc-900
                        border border-zinc-700
                        rounded-lg
                        px-4 py-3
                        outline-none
                        focus:border-indigo-500
                        focus:ring-1
                        focus:ring-indigo-500/30
                      "
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-indigo-600
                hover:bg-indigo-500
                disabled:opacity-50
                py-3.5
                rounded-lg
                font-semibold
                transition
                shadow-lg
                shadow-indigo-600/10
              "
            >
              {loading ? "Posting Room..." : "Post Room"}
            </button>

            {message && (
              <div className="text-center text-sm text-indigo-400">
                {message}
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddRoom;