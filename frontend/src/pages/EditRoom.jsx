import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ImagePlus,
  X,
  Save,
  Home,
  MapPin,
  Check,
} from "lucide-react";

const ALLOWED_ROOM_TYPES = [
  "Single",
  "Shared",
  "1 BHK",
  "2 BHK",
  "PG",
  "Other",
];

const ALLOWED_STATUSES = [
  "available",
  "unavailable",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [errors, setErrors] = useState({});

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validatePhone = (value) => {
    const phone = value.replace(/\D/g, "");

    if (phone.length === 10) {
      return /^[6-9]\d{9}$/.test(phone);
    }

    if (phone.length === 12 && phone.startsWith("91")) {
      return /^91[6-9]\d{9}$/.test(phone);
    }

    return false;
  };

  const validateCoordinates = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  const validateForm = () => {
    const newErrors = {};

    const title = formData.title.trim();
    const description = formData.description.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const locality = formData.locality.trim();
    const contactName = formData.contactName.trim();

    /* TITLE */

    if (!title) {
      newErrors.title = "Room title is required.";
    } else if (title.length < 3) {
      newErrors.title =
        "Room title must be at least 3 characters.";
    } else if (title.length > 100) {
      newErrors.title =
        "Room title cannot exceed 100 characters.";
    }

    /* DESCRIPTION */

    if (!description) {
      newErrors.description =
        "Room description is required.";
    } else if (description.length < 20) {
      newErrors.description =
        "Description must be at least 20 characters.";
    } else if (description.length > 2000) {
      newErrors.description =
        "Description cannot exceed 2000 characters.";
    }

    /* RENT */

    const rent = Number(formData.rent);

    if (!String(formData.rent).trim()) {
      newErrors.rent =
        "Monthly rent is required.";
    } else if (!Number.isFinite(rent) || rent <= 0) {
      newErrors.rent =
        "Monthly rent must be greater than ₹0.";
    } else if (rent > 10000000) {
      newErrors.rent =
        "Please enter a valid monthly rent.";
    }

    /* ROOM TYPE */

    if (!ALLOWED_ROOM_TYPES.includes(formData.roomType)) {
      newErrors.roomType =
        "Please select a valid room type.";
    }

    /* STATUS */

    if (!ALLOWED_STATUSES.includes(formData.status)) {
      newErrors.status =
        "Please select a valid listing status.";
    }

    /* LOCATION */

    if (!address) {
      newErrors.address = "Address is required.";
    } else if (address.length < 5) {
      newErrors.address =
        "Please enter a more specific address.";
    }

    if (!city) {
      newErrors.city = "City is required.";
    } else if (city.length < 2) {
      newErrors.city =
        "Please enter a valid city.";
    }

    if (!locality) {
      newErrors.locality =
        "Locality is required.";
    } else if (locality.length < 2) {
      newErrors.locality =
        "Please enter a valid locality.";
    }

    if (
      !formData.latitude ||
      !formData.longitude
    ) {
      newErrors.location =
        "Latitude and longitude are required.";
    } else if (
      !validateCoordinates(
        formData.latitude,
        formData.longitude
      )
    ) {
      newErrors.location =
        "Latitude or longitude is invalid.";
    }

    /* CONTACT */

    if (!contactName) {
      newErrors.contactName =
        "Contact name is required.";
    } else if (contactName.length < 2) {
      newErrors.contactName =
        "Please enter a valid contact name.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone =
        "Enter a valid Indian mobile number.";
    }

    if (
      formData.whatsapp.trim() &&
      !validatePhone(formData.whatsapp)
    ) {
      newErrors.whatsapp =
        "Enter a valid Indian WhatsApp number.";
    }

    /* NEW IMAGES */

    if (images.length > 5) {
      newErrors.images =
        "You can upload maximum 5 images.";
    }

    images.forEach((image) => {
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          image.type
        )
      ) {
        newErrors.images =
          "Only JPG, JPEG, PNG or WEBP images are allowed.";
      }

      if (image.size > MAX_IMAGE_SIZE) {
        newErrors.images =
          "Each image must be 5 MB or smaller.";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     FETCH ROOM
  ========================================================= */

  useEffect(() => {
    const fetchRoom = async () => {
      const token =
        localStorage.getItem("plutoToken");

      /*
       * IMPORTANT:
       * GET /api/rooms/:id is protected.
       * Therefore Authorization header is required.
       */

      if (!token) {
        navigate("/login", {
          replace: true,
          state: {
            from: `/edit-room/${id}`,
          },
        });

        return;
      }

      try {
        setLoading(true);
        setMessage("");
        setMessageType("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const room = response.data?.room;

        if (!room) {
          setMessage(
            "Room information could not be loaded."
          );
          setMessageType("error");
          return;
        }

        const coordinates =
          room.location?.coordinates?.coordinates ||
          [];

        setFormData({
          title: room.title || "",

          description:
            room.description || "",

          rent:
            room.rent !== undefined &&
            room.rent !== null
              ? String(room.rent)
              : "",

          roomType:
            room.roomType || "Single",

          amenities:
            Array.isArray(room.amenities)
              ? room.amenities.join(", ")
              : "",

          address:
            room.location?.address || "",

          city:
            room.location?.city || "",

          locality:
            room.location?.locality || "",

          longitude:
            coordinates.length === 2
              ? String(coordinates[0])
              : "",

          latitude:
            coordinates.length === 2
              ? String(coordinates[1])
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

        setExistingImages(
          Array.isArray(room.images)
            ? room.images
            : []
        );
      } catch (error) {
        console.error(
          "Fetch room error:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "plutoToken"
          );

          localStorage.removeItem(
            "plutoUser"
          );

          navigate("/login", {
            replace: true,
            state: {
              from: `/edit-room/${id}`,
            },
          });

          return;
        }

        setMessage(
          error.response?.data?.message ||
            "Unable to load room."
        );

        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]);

  /* =========================================================
     INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      location:
        name === "latitude" ||
        name === "longitude"
          ? ""
          : prev.location,
    }));

    setMessage("");
  };

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    if (selectedFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images:
          "You can upload maximum 5 images.",
      }));

      e.target.value = "";
      return;
    }

    const invalidType = selectedFiles.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.includes(
          file.type
        )
    );

    if (invalidType) {
      setErrors((prev) => ({
        ...prev,
        images:
          "Only JPG, JPEG, PNG or WEBP images are allowed.",
      }));

      e.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) =>
        file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      setErrors((prev) => ({
        ...prev,
        images:
          "Each image must be 5 MB or smaller.",
      }));

      e.target.value = "";
      return;
    }

    setImages(selectedFiles);

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    setMessage("");

    e.target.value = "";
  };

  /* =========================================================
     REMOVE NEW IMAGE
  ========================================================= */

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setMessage("");
    setMessageType("");

    const isValid = validateForm();

    if (!isValid) {
      setMessage(
        "Please fix the highlighted fields before saving."
      );

      setMessageType("error");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const token =
      localStorage.getItem("plutoToken");

    if (!token) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/edit-room/${id}`,
        },
      });

      return;
    }

    try {
      setSaving(true);

      const roomData = new FormData();

      roomData.append(
        "title",
        formData.title.trim()
      );

      roomData.append(
        "description",
        formData.description.trim()
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

      const amenities = [
        ...new Set(
          formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
      ];

      roomData.append(
        "amenities",
        JSON.stringify(amenities)
      );

      roomData.append(
        "location",
        JSON.stringify({
          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          locality:
            formData.locality.trim(),

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
          name:
            formData.contactName.trim(),

          phone:
            formData.phone.trim(),

          whatsapp:
            formData.whatsapp.trim(),
        })
      );

      images.forEach((image) => {
        roomData.append(
          "images",
          image
        );
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

      setMessage(
        "Room updated successfully."
      );

      setMessageType("success");

      setTimeout(() => {
        navigate("/my-posts");
      }, 700);
    } catch (error) {
      console.error(
        "Update room error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "plutoToken"
        );

        localStorage.removeItem(
          "plutoUser"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update room."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-[#E1E2D9]" />

            <div className="mt-6 h-12 w-56 bg-[#E1E2D9]" />

            <div className="mt-10 h-96 bg-white border border-[#DDDCD3]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#DDDCD3] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          <button
            type="button"
            onClick={() =>
              navigate("/my-posts")
            }
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#747872] transition hover:text-[#173F2B]"
          >
            <ArrowLeft size={16} />
            Back to My Posts
          </button>

          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Home size={17} />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                    Pluto community
                  </p>

                  <p className="text-xs font-semibold text-[#747872]">
                    Manage your listing
                  </p>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171A18] sm:text-5xl">
                Edit room.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#747872] sm:text-base">
                Update your room details, location and
                contact information.
              </p>
            </div>

            <div className="hidden border-l border-[#DDDCD3] pl-6 sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#969992]">
                Listing status
              </p>

              <p className="mt-2 text-sm font-bold text-[#26372C]">
                {formData.status ===
                "available"
                  ? "Currently available"
                  : "Currently unavailable"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FORM
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        <form
          onSubmit={handleSubmit}
          className="grid gap-7 lg:grid-cols-[1fr_300px]"
        >

          <div className="space-y-7">

            {/* =================================================
                BASIC DETAILS
            ================================================= */}

            <FormSection
              number="01"
              title="Basic details"
              description="Keep the information accurate so people know exactly what you're offering."
            >
              <div className="space-y-5">

                <Field
                  label="Room title"
                  required
                  error={errors.title}
                >
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Spacious room near college"
                    className={`input ${
                      errors.title
                        ? "input-error"
                        : ""
                    }`}
                  />
                </Field>

                <Field
                  label="Description"
                  required
                  error={errors.description}
                >
                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Describe the room, surroundings, rules..."
                    rows={6}
                    className={`input resize-none ${
                      errors.description
                        ? "input-error"
                        : ""
                    }`}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="Monthly rent"
                    required
                    error={errors.rent}
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#858982]">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="rent"
                        value={formData.rent}
                        onChange={handleChange}
                        min="1"
                        placeholder="8000"
                        className={`input pl-9 ${
                          errors.rent
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Room type"
                    required
                    error={errors.roomType}
                  >
                    <select
                      name="roomType"
                      value={
                        formData.roomType
                      }
                      onChange={handleChange}
                      className={`input ${
                        errors.roomType
                          ? "input-error"
                          : ""
                      }`}
                    >
                      {ALLOWED_ROOM_TYPES.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </Field>

                </div>

                <Field label="Amenities">
                  <input
                    name="amenities"
                    value={
                      formData.amenities
                    }
                    onChange={handleChange}
                    placeholder="WiFi, AC, Parking, Food"
                    className="input"
                  />
                </Field>

                <Field
                  label="Listing status"
                  required
                  error={errors.status}
                >
                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={handleChange}
                    className={`input ${
                      errors.status
                        ? "input-error"
                        : ""
                    }`}
                  >
                    <option value="available">
                      Available
                    </option>

                    <option value="unavailable">
                      Unavailable
                    </option>
                  </select>
                </Field>

              </div>
            </FormSection>

            {/* =================================================
                IMAGES
            ================================================= */}

            <FormSection
              number="02"
              title="Room images"
              description="Upload new images only when you want to replace or update the current listing photos."
              right={
                <span className="text-xs font-bold text-[#55745F]">
                  {images.length}/5 new
                </span>
              }
            >

              {existingImages.length > 0 && (
                <div className="mb-6">

                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#858982]">
                    Current images
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {existingImages.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="aspect-square overflow-hidden border border-[#D8D7CE] bg-[#EEEDE6]"
                        >
                          <img
                            src={image}
                            alt={`Current room ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>

                </div>
              )}

              <label className="group flex min-h-40 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#CFCFC5] bg-[#FAF9F4] px-6 text-center transition hover:border-[#829685] hover:bg-[#F3F6F0]">

                <div className="flex h-11 w-11 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                  <ImagePlus size={20} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#34483A]">
                  Upload new images
                </p>

                <p className="mt-1 text-[11px] text-[#8A8D87]">
                  JPG, JPEG, PNG or WEBP · Max 5 MB each
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />
              </label>

              {errors.images && (
                <p className="mt-2 text-xs font-semibold text-[#B44E32]">
                  {errors.images}
                </p>
              )}

              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {images.map(
                    (image, index) => (
                      <ImagePreview
                        key={`${image.name}-${image.lastModified}-${index}`}
                        image={image}
                        index={index}
                        onRemove={() =>
                          removeImage(index)
                        }
                      />
                    )
                  )}
                </div>
              )}

            </FormSection>

            {/* =================================================
                LOCATION
            ================================================= */}

            <FormSection
              number="03"
              title="Location"
              description="Keep the address and coordinates accurate so people can find the space easily."
            >

              <div className="space-y-5">

                <Field
                  label="Address"
                  required
                  error={errors.address}
                >
                  <input
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={handleChange}
                    placeholder="Full address"
                    className={`input ${
                      errors.address
                        ? "input-error"
                        : ""
                    }`}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="City"
                    required
                    error={errors.city}
                  >
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lucknow"
                      className={`input ${
                        errors.city
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                  <Field
                    label="Locality"
                    required
                    error={errors.locality}
                  >
                    <input
                      name="locality"
                      value={
                        formData.locality
                      }
                      onChange={handleChange}
                      placeholder="Gomti Nagar"
                      className={`input ${
                        errors.locality
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                </div>

                <div className="border border-[#D8D7CE] bg-[#FAF9F4] p-4">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                      <MapPin size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#34483A]">
                        Saved coordinates
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#858982]">
                        These coordinates are used for
                        the map and directions feature.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="Latitude"
                    required
                    error={errors.latitude}
                  >
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={
                        formData.latitude
                      }
                      onChange={handleChange}
                      placeholder="26.8467"
                      className={`input font-mono text-xs ${
                        errors.latitude
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                  <Field
                    label="Longitude"
                    required
                    error={errors.longitude}
                  >
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={
                        formData.longitude
                      }
                      onChange={handleChange}
                      placeholder="80.9462"
                      className={`input font-mono text-xs ${
                        errors.longitude
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                </div>

                {errors.location && (
                  <p className="text-xs font-semibold text-[#B44E32]">
                    {errors.location}
                  </p>
                )}

              </div>

            </FormSection>

            {/* =================================================
                CONTACT
            ================================================= */}

            <FormSection
              number="04"
              title="Contact details"
              description="Make sure interested people can reach you using the information below."
            >

              <div className="space-y-5">

                <Field
                  label="Contact name"
                  required
                  error={errors.contactName}
                >
                  <input
                    name="contactName"
                    value={
                      formData.contactName
                    }
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`input ${
                      errors.contactName
                        ? "input-error"
                        : ""
                    }`}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="Phone"
                    required
                    error={errors.phone}
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`input ${
                        errors.phone
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                  <Field
                    label="WhatsApp"
                    hint="Optional."
                    error={errors.whatsapp}
                  >
                    <input
                      type="tel"
                      name="whatsapp"
                      value={
                        formData.whatsapp
                      }
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`input ${
                        errors.whatsapp
                          ? "input-error"
                          : ""
                      }`}
                    />
                  </Field>

                </div>

              </div>

            </FormSection>

          </div>

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              <div className="border border-[#D8D7CE] bg-white">

                <div className="border-b border-[#E1E0D8] px-5 py-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#55745F]">
                    Before saving
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-[#26372C]">
                    Quick checklist
                  </h3>

                </div>

                <div className="divide-y divide-[#ECEBE4]">

                  <ChecklistItem
                    text="Room details"
                    done={
                      formData.title.trim()
                        .length >= 3 &&
                      formData.description.trim()
                        .length >= 20
                    }
                  />

                  <ChecklistItem
                    text="Rent & room type"
                    done={
                      Number(formData.rent) >
                        0 &&
                      ALLOWED_ROOM_TYPES.includes(
                        formData.roomType
                      )
                    }
                  />

                  <ChecklistItem
                    text="Location"
                    done={validateCoordinates(
                      formData.latitude,
                      formData.longitude
                    )}
                  />

                  <ChecklistItem
                    text="Contact details"
                    done={
                      formData.contactName.trim()
                        .length >= 2 &&
                      validatePhone(
                        formData.phone
                      )
                    }
                  />

                </div>

              </div>

              <div className="border border-[#D8D7CE] bg-[#E9EFE7] p-5">

                <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Home size={16} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#26372C]">
                  Keep your listing accurate.
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#68736B]">
                  Updated rent, availability, location
                  and contact information make your
                  listing more useful.
                </p>

              </div>

            </div>
          </aside>

          {/* =====================================================
              ACTION BAR
          ===================================================== */}

          <div className="lg:col-span-2">

            <div className="border-t border-[#D8D7CE] pt-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold text-[#34483A]">
                    Ready to save changes?
                  </p>

                  <p className="mt-1 text-[11px] text-[#858982]">
                    Your updated listing will be reflected
                    on Pluto.
                  </p>

                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/my-posts"
                      )
                    }
                    className="flex items-center justify-center gap-2 border border-[#D0CFC6] bg-white px-6 py-3.5 text-sm font-bold text-[#747872] transition hover:border-[#A9AAA2] hover:text-[#34483A]"
                  >
                    <ArrowLeft size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-[#173F2B] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#102F20] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </div>

              {message && (
                <div
                  className={`mt-5 border px-4 py-3 text-xs font-semibold ${
                    messageType ===
                    "success"
                      ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D]"
                      : "border-[#E2C7BC] bg-[#F8EDE8] text-[#9A5037]"
                  }`}
                >
                  {message}
                </div>
              )}

            </div>

          </div>

        </form>
      </section>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d6d5cc;
          background: #faf9f4;
          padding: 12px 16px;
          font-size: 14px;
          color: #171a18;
          outline: none;
          transition:
            border-color 0.2s,
            background-color 0.2s;
        }

        .input:focus {
          border-color: #829685;
          background: #ffffff;
        }

        .input-error {
          border-color: #c96b45 !important;
          background: #fff8f5 !important;
        }
      `}</style>

    </main>
  );
};

/* =========================================================
   FORM SECTION
========================================================= */

const FormSection = ({
  number,
  title,
  description,
  children,
  right,
}) => {
  return (
    <section className="border border-[#D8D7CE] bg-white">

      <div className="flex items-start justify-between gap-5 border-b border-[#E2E1D9] px-5 py-5 sm:px-7">

        <div className="flex gap-4">

          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#E9EFE7] text-[10px] font-bold text-[#173F2B]">
            {number}
          </span>

          <div>

            <h2 className="text-lg font-bold tracking-tight text-[#171A18]">
              {title}
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[#858982] sm:text-sm">
              {description}
            </p>

          </div>

        </div>

        {right}

      </div>

      <div className="p-5 sm:p-7">
        {children}
      </div>

    </section>
  );
};

/* =========================================================
   FIELD
========================================================= */

const Field = ({
  label,
  required = false,
  hint,
  error,
  children,
}) => {
  return (
    <div>

      <label className="mb-2 flex items-center gap-1 text-xs font-bold text-[#34483A]">
        {label}

        {required && (
          <span className="text-[#C96B45]">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p className="mt-1.5 text-[10px] font-semibold leading-4 text-[#B44E32]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[10px] leading-4 text-[#969992]">
          {hint}
        </p>
      ) : null}

    </div>
  );
};

/* =========================================================
   IMAGE PREVIEW
========================================================= */

const ImagePreview = ({
  image,
  index,
  onRemove,
}) => {
  const [preview, setPreview] =
    useState("");

  useEffect(() => {
    const url =
      URL.createObjectURL(image);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <div className="group relative aspect-square overflow-hidden border border-[#D8D7CE] bg-[#EEEDE6]">

      {preview && (
        <img
          src={preview}
          alt={`New room ${index + 1}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      )}

      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center bg-white/90 text-[9px] font-bold text-[#34483A]">
        {index + 1}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-[#173F2B] text-white opacity-0 transition group-hover:opacity-100"
        aria-label={`Remove image ${
          index + 1
        }`}
      >
        <X size={14} />
      </button>

    </div>
  );
};

/* =========================================================
   CHECKLIST
========================================================= */

const ChecklistItem = ({
  text,
  done,
}) => {
  return (
    <div className="flex items-center gap-3 px-5 py-4">

      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center ${
          done
            ? "bg-[#173F2B] text-[#E6B84A]"
            : "bg-[#F1F0E9] text-[#8B8E87]"
        }`}
      >
        {done ? (
          <Check
            size={13}
            strokeWidth={3}
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-[#BFC1BA]" />
        )}
      </span>

      <span
        className={`text-xs font-semibold ${
          done
            ? "text-[#34483A]"
            : "text-[#858982]"
        }`}
      >
        {text}
      </span>

    </div>
  );
};

export default EditRoom;