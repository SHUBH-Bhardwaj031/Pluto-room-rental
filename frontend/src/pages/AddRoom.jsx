import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import axios from "axios";
import {
  X,
  MapPin,
  Loader2,
  Home,
  ArrowRight,
  Check,
  Upload,
} from "lucide-react";

const DEFAULT_LATITUDE = 26.8467;
const DEFAULT_LONGITUDE = 80.9462;

const ALLOWED_ROOM_TYPES = [
  "Single",
  "Shared",
  "1 BHK",
  "2 BHK",
  "PG",
  "Other",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddRoom = () => {
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  /* =========================================================
     VALIDATION HELPERS
  ========================================================= */

  const validatePhone = (value) => {
    const phone = value.replace(/\D/g, "");

    if (!phone) return false;

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

    if (!formData.rent.trim()) {
      newErrors.rent = "Monthly rent is required.";
    } else if (!Number.isFinite(rent) || rent <= 0) {
      newErrors.rent =
        "Monthly rent must be greater than ₹0.";
    } else if (rent > 10000000) {
      newErrors.rent =
        "Please enter a valid monthly rent.";
    }

    /* ROOM TYPE */

    if (!ALLOWED_ROOM_TYPES.includes(formData.roomType)) {
      newErrors.roomType = "Please select a valid room type.";
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
      newErrors.city = "Please enter a valid city.";
    }

    if (!locality) {
      newErrors.locality = "Locality is required.";
    } else if (locality.length < 2) {
      newErrors.locality =
        "Please enter a valid locality.";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location =
        "Please select a valid location on the map.";
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
      newErrors.phone = "Phone number is required.";
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

    /* IMAGES */

    if (images.length > 5) {
      newErrors.images =
        "You can upload maximum 5 images.";
    }

    images.forEach((image) => {
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
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
        name === "latitude" || name === "longitude"
          ? ""
          : prev.location,
    }));

    if (
      name === "address" ||
      name === "city" ||
      name === "locality"
    ) {
      setLocationMessage("");
      setErrors((prev) => ({
        ...prev,
        location: "",
      }));
    }

    setMessage("");
  };

  /* =========================================================
     MAP → FORM
  ========================================================= */

  const handleMapLocationSelect = async ({
    latitude,
    longitude,
  }) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));

    setErrors((prev) => ({
      ...prev,
      latitude: "",
      longitude: "",
      location: "",
    }));

    setLocationLoading(true);
    setLocationMessage("Getting location details...");

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon: lng,
            format: "json",
            addressdetails: 1,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      const addressData = response.data?.address || {};

      const city =
        addressData.city ||
        addressData.town ||
        addressData.municipality ||
        addressData.village ||
        "";

      const locality =
        addressData.suburb ||
        addressData.neighbourhood ||
        addressData.city_district ||
        addressData.quarter ||
        "";

      const displayAddress =
        response.data?.display_name || "";

      setFormData((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
        address: displayAddress,
        city,
        locality,
      }));

      setErrors((prev) => ({
        ...prev,
        address: "",
        city: "",
        locality: "",
        latitude: "",
        longitude: "",
        location: "",
      }));

      setLocationMessage(
        "Location selected successfully."
      );
    } catch (error) {
      console.error("Reverse geocoding error:", error);

      setLocationMessage(
        "Coordinates selected. Could not automatically get address details."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  /* =========================================================
     FORM → MAP
  ========================================================= */

  useEffect(() => {
    const address = formData.address.trim();
    const city = formData.city.trim();
    const locality = formData.locality.trim();

    if (
      address.length < 3 &&
      city.length < 3 &&
      locality.length < 3
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      const searchParts = [
        address,
        locality,
        city,
      ].filter(Boolean);

      const query = searchParts.join(", ");

      if (!query) return;

      setLocationLoading(true);
      setLocationMessage("Finding location on map...");

      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: query,
              format: "json",
              addressdetails: 1,
              limit: 1,
            },
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (
          !response.data ||
          response.data.length === 0
        ) {
          setLocationMessage(
            "Location not found. Try a more specific address."
          );
          return;
        }

        const result = response.data[0];

        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        if (
          Number.isNaN(latitude) ||
          Number.isNaN(longitude)
        ) {
          setLocationMessage(
            "Invalid location coordinates."
          );
          return;
        }

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setErrors((prev) => ({
          ...prev,
          location: "",
        }));

        setLocationMessage("Map location updated.");
      } catch (error) {
        console.error("Geocoding error:", error);

        setLocationMessage(
          "Could not find this location right now."
        );
      } finally {
        setLocationLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    formData.address,
    formData.city,
    formData.locality,
  ]);

  /* =========================================================
     IMAGES
  ========================================================= */

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length + images.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload maximum 5 images.",
      }));
      e.target.value = "";
      return;
    }

    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type)
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
      (file) => file.size > MAX_IMAGE_SIZE
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

    setImages((prev) => [...prev, ...selectedFiles]);

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    setMessage("");
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
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

    if (loading) return;

    setMessage("");

    const isValid = validateForm();

    if (!isValid) {
      setMessage(
        "Please fix the highlighted fields before posting."
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("plutoToken");

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        navigate("/login");
        return;
      }

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
          address: formData.address.trim(),
          city: formData.city.trim(),
          locality: formData.locality.trim(),
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
          name: formData.contactName.trim(),
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp.trim(),
        })
      );

      images.forEach((image) => {
        roomData.append("images", image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Room posted successfully."
      );

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
      setErrors({});
      setLocationMessage("");
    } catch (error) {
      console.error("Create room error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while posting the room."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
      <section className="border-b border-[#DDDCD3] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                  <Home size={17} />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#55745F]">
                    Pluto community
                  </p>

                  <p className="text-xs font-semibold text-[#747872]">
                    Share your space
                  </p>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171A18] sm:text-5xl">
                Add a room.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#747872] sm:text-base">
                Tell people about your space, where it is,
                what it offers and how they can reach you.
              </p>
            </div>

            <div className="hidden border-l border-[#DDDCD3] pl-6 sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#969992]">
                Listing flow
              </p>

              <p className="mt-2 text-sm font-bold text-[#26372C]">
                Details → Location → Connect
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
            <div className="space-y-7">
              <FormSection
                number="01"
                title="Tell us about the room"
                description="Give your listing enough detail for someone to understand the space."
              >
                <div className="space-y-5">
                  <Field
                    label="Room title"
                    required
                    hint="A short, clear title works best."
                    error={errors.title}
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Spacious room near college"
                      required
                      className={`input ${
                        errors.title ? "input-error" : ""
                      }`}
                    />
                  </Field>

                  <Field
                    label="Description"
                    required
                    hint="Mention anything useful: surroundings, house rules, availability, etc."
                    error={errors.description}
                  >
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the room, surroundings, rules..."
                      rows={6}
                      required
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
                          placeholder="8000"
                          min="1"
                          required
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
                      <div className="relative">
                        <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className={`input appearance-none pr-10 ${
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

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747872]">
                          ▾
                        </span>
                      </div>
                    </Field>
                  </div>

                  <Field
                    label="Amenities"
                    hint="Separate each amenity with a comma."
                  >
                    <input
                      type="text"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleChange}
                      placeholder="WiFi, Parking, AC, Food"
                      className="input"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                number="02"
                title="Show the space"
                description="Good photos help people understand your listing before contacting you."
                right={
                  <span className="text-xs font-bold text-[#55745F]">
                    {images.length}/5
                  </span>
                }
              >
                <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#CFCFC5] bg-[#FAF9F4] px-6 text-center transition hover:border-[#829685] hover:bg-[#F3F6F0]">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#E9EFE7] text-[#173F2B] transition group-hover:bg-[#E1EAE1]">
                    <Upload size={21} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#34483A]">
                    Upload room images
                  </p>

                  <p className="mt-1 text-xs text-[#8A8D87]">
                    JPG, JPEG, PNG or WEBP · Up to 5 images ·
                    Max 5 MB each
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {errors.images && (
                  <p className="mt-2 text-xs font-semibold text-[#B44E32]">
                    {errors.images}
                  </p>
                )}

                {images.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {images.map((image, index) => (
                      <ImagePreview
                        key={`${image.name}-${image.lastModified}-${index}`}
                        image={image}
                        index={index}
                        onRemove={() =>
                          removeImage(index)
                        }
                      />
                    ))}
                  </div>
                )}
              </FormSection>

              <FormSection
                number="03"
                title="Set the location"
                description="Enter the address or select the exact point directly on the map."
              >
                <div className="space-y-5">
                  <Field
                    label="Address"
                    required
                    error={errors.address}
                  >
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Full address"
                      required
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
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Lucknow"
                        required
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
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        placeholder="Gomti Nagar"
                        required
                        className={`input ${
                          errors.locality
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </Field>
                  </div>

                  <div className="border border-[#DAD9D0] bg-[#FAF9F4] p-3">
                    <div className="mb-3 flex items-start gap-3 px-1 py-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#E9EFE7] text-[#173F2B]">
                        <MapPin size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#34483A]">
                          Select on map
                        </p>

                        <p className="mt-0.5 text-[11px] leading-5 text-[#858982]">
                          Click the map to choose the exact
                          location. Your coordinates will be
                          saved with the listing.
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden border border-[#D6D5CC]">
                      <MapView
                        latitude={
                          formData.latitude ||
                          DEFAULT_LATITUDE
                        }
                        longitude={
                          formData.longitude ||
                          DEFAULT_LONGITUDE
                        }
                        selectable={true}
                        onLocationSelect={
                          handleMapLocationSelect
                        }
                      />
                    </div>

                    <div className="flex min-h-8 items-center gap-2 px-1 pt-3">
                      {locationLoading && (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin text-[#55745F]"
                          />

                          <span className="text-[11px] font-medium text-[#747872]">
                            Finding location...
                          </span>
                        </>
                      )}

                      {!locationLoading &&
                        locationMessage && (
                          <>
                            <Check
                              size={14}
                              className="text-[#55745F]"
                            />

                            <span className="text-[11px] font-medium text-[#55745F]">
                              {locationMessage}
                            </span>
                          </>
                        )}
                    </div>
                  </div>

                  {errors.location && (
                    <p className="text-xs font-semibold text-[#B44E32]">
                      {errors.location}
                    </p>
                  )}

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
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="26.8467"
                        required
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
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="80.9462"
                        required
                        className={`input font-mono text-xs ${
                          errors.longitude
                            ? "input-error"
                            : ""
                        }`}
                      />
                    </Field>
                  </div>
                </div>
              </FormSection>

              <FormSection
                number="04"
                title="How should people reach you?"
                description="These details will be shown to people interested in your listing."
              >
                <div className="space-y-5">
                  <Field
                    label="Contact name"
                    required
                    error={errors.contactName}
                  >
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
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
                      hint="10-digit Indian mobile number."
                      error={errors.phone}
                    >
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        required
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
                        value={formData.whatsapp}
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

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <div className="border border-[#D8D7CE] bg-white">
                  <div className="border-b border-[#E1E0D8] px-5 py-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#55745F]">
                      Listing checklist
                    </p>

                    <h3 className="mt-1 text-sm font-bold text-[#26372C]">
                      Make your listing useful
                    </h3>
                  </div>

                  <div className="divide-y divide-[#ECEBE4]">
                    <ChecklistItem
                      number="01"
                      text="Clear title & description"
                      done={
                        formData.title.trim().length >= 3 &&
                        formData.description.trim()
                          .length >= 20
                      }
                    />

                    <ChecklistItem
                      number="02"
                      text="Rent & room type"
                      done={
                        Number(formData.rent) > 0 &&
                        Boolean(formData.roomType)
                      }
                    />

                    <ChecklistItem
                      number="03"
                      text="Room photos"
                      done={images.length > 0}
                    />

                    <ChecklistItem
                      number="04"
                      text="Exact location"
                      done={validateCoordinates(
                        formData.latitude,
                        formData.longitude
                      )}
                    />

                    <ChecklistItem
                      number="05"
                      text="Contact details"
                      done={
                        formData.contactName.trim().length >= 2 &&
                        validatePhone(formData.phone)
                      }
                    />
                  </div>
                </div>

                <div className="border border-[#D8D7CE] bg-[#E9EFE7] p-5">
                  <div className="flex h-9 w-9 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                    <Home size={16} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#26372C]">
                    A little more detail goes a long way.
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#68736B]">
                    Add good photos, an accurate location
                    and a useful description so people can
                    decide whether your space is right for
                    them.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 border-t border-[#D8D7CE] pt-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-[#34483A]">
                  Ready to share your space?
                </p>

                <p className="mt-1 text-[11px] text-[#858982]">
                  Your listing will be added to Pluto.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 bg-[#173F2B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#102F20] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading
                  ? "Posting room..."
                  : "Post room"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </div>

            {message && (
              <div
                className={`mt-5 border px-4 py-3 text-xs font-semibold ${
                  message
                    .toLowerCase()
                    .includes("success")
                    ? "border-[#C8D5C9] bg-[#E9EFE7] text-[#31543D]"
                    : "border-[#E2C7BC] bg-[#F8EDE8] text-[#9A5037]"
                }`}
              >
                {message}
              </div>
            )}
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
          transition: border-color 0.2s, background-color 0.2s;
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
          <span className="text-[#C96B45]">*</span>
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

const ImagePreview = ({
  image,
  index,
  onRemove,
}) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(image);

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
          alt={`Room ${index + 1}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      )}

      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center bg-white/90 text-[9px] font-bold text-[#34483A] shadow-sm">
        {index + 1}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-[#173F2B] text-white opacity-0 transition group-hover:opacity-100"
        aria-label={`Remove image ${index + 1}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ChecklistItem = ({
  number,
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
          <Check size={13} strokeWidth={3} />
        ) : (
          <span className="text-[9px] font-bold">
            {number}
          </span>
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

export default AddRoom;