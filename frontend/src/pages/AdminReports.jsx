import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Ban,
  RefreshCw,
  MapPin,
  IndianRupee,
  User,
} from "lucide-react";

const AdminReports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [takingDownId, setTakingDownId] =
    useState(null);

  /* =========================================================
     FETCH REPORTS
  ========================================================= */

  const fetchReports = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("plutoToken");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.reports || []);
    } catch (error) {
      console.error(
        "Fetch reports error:",
        error
      );

      if (error.response?.status === 401) {
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
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async (
    reportId,
    status
  ) => {
    try {
      setUpdatingId(reportId);

      const token =
        localStorage.getItem("plutoToken");

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/reports/${reportId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedReport =
        response.data.report;

      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status:
                  updatedReport.status,
              }
            : report
        )
      );
    } catch (error) {
      console.error(
        "Update report status error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update report."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     TAKE DOWN
  ========================================================= */

  const takeDownRoom = async (
    roomId,
    reportId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to take down this listing?"
    );

    if (!confirmed) return;

    try {
      setTakingDownId(reportId);

      const token =
        localStorage.getItem("plutoToken");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/reports/room/${roomId}/takedown`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports((prev) =>
        prev.map((report) => {
          if (report._id !== reportId) {
            return report;
          }

          return {
            ...report,
            room: {
              ...report.room,
              status: "unavailable",
            },
          };
        })
      );

      await updateStatus(
        reportId,
        "resolved"
      );
    } catch (error) {
      console.error(
        "Take down error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to take down listing."
      );
    } finally {
      setTakingDownId(null);
    }
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: reports.length,

      pending: reports.filter(
        (report) =>
          report.status === "pending"
      ).length,

      reviewed: reports.filter(
        (report) =>
          report.status === "reviewed"
      ).length,

      resolved: reports.filter(
        (report) =>
          report.status === "resolved"
      ).length,

      dismissed: reports.filter(
        (report) =>
          report.status === "dismissed"
      ).length,
    };
  }, [reports]);

  /* =========================================================
     STATUS UI
  ========================================================= */

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock3,
      className:
        "bg-[#FFF7D9] text-[#8A6B12] border-[#E6D58A]",
    },

    reviewed: {
      label: "Reviewed",
      icon: Eye,
      className:
        "bg-[#EAF0F8] text-[#47627E] border-[#C8D7E8]",
    },

    resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      className:
        "bg-[#E7F0E8] text-[#356044] border-[#C8DDCB]",
    },

    dismissed: {
      label: "Dismissed",
      icon: XCircle,
      className:
        "bg-[#F0EFEC] text-[#6C706A] border-[#D8D7D0]",
    },
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3EA]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-[#DDDCD3]" />

            <div className="mt-4 h-12 w-80 bg-[#DDDCD3]" />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 bg-white"
                />
              ))}
            </div>

            <div className="mt-10 h-96 bg-white" />
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F5F3EA] text-[#171A18]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

        {/* HEADER */}

        <div className="flex flex-col gap-5 border-b border-[#DDDCD3] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[#173F2B] text-[#E6B84A]">
                <ShieldAlert size={19} />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#55745F]">
                  Pluto moderation
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Reports
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#747872]">
              Review listings reported by the
              Pluto community and take action when
              necessary.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReports}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              border
              border-[#173F2B]
              bg-white
              px-4
              py-3
              text-xs
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#173F2B]
              transition
              hover:bg-[#173F2B]
              hover:text-white
            "
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            label="Total"
            value={stats.total}
            icon={ShieldAlert}
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={Clock3}
          />

          <StatCard
            label="Reviewed"
            value={stats.reviewed}
            icon={Eye}
          />

          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
          />

          <StatCard
            label="Dismissed"
            value={stats.dismissed}
            icon={XCircle}
          />

        </div>

        {/* EMPTY */}

        {reports.length === 0 ? (
          <div className="mt-8 border border-[#DDDCD3] bg-white px-6 py-20 text-center">
            <CheckCircle2
              size={35}
              className="mx-auto text-[#55745F]"
            />

            <h2 className="mt-5 text-xl font-bold text-[#173F2B]">
              No reports
            </h2>

            <p className="mt-2 text-sm text-[#747872]">
              There are currently no listing
              reports to review.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">

            {reports.map((report) => {
              const config =
                statusConfig[
                  report.status
                ] || statusConfig.pending;

              const StatusIcon =
                config.icon;

              const room = report.room;
              const reporter =
                report.reportedBy;

              const poster =
                room?.postedBy;

              return (
                <article
                  key={report._id}
                  className="border border-[#DDDCD3] bg-white"
                >
                  {/* TOP */}

                  <div className="flex flex-col gap-4 border-b border-[#ECEBE4] p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            border
                            px-2.5
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            ${config.className}
                          `}
                        >
                          <StatusIcon size={12} />
                          {config.label}
                        </span>

                        <span className="text-[10px] uppercase tracking-[0.12em] text-[#979A93]">
                          {new Date(
                            report.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>

                      </div>

                      <h2 className="mt-4 text-xl font-bold text-[#173F2B]">
                        {room?.title ||
                          "Deleted listing"}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-[#C96B45]">
                        {report.reason}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      {report.status ===
                        "pending" && (
                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            report._id
                          }
                          onClick={() =>
                            updateStatus(
                              report._id,
                              "reviewed"
                            )
                          }
                          className="border border-[#173F2B] bg-[#173F2B] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white disabled:opacity-50"
                        >
                          Mark reviewed
                        </button>
                      )}

                      {report.status !==
                        "resolved" && (
                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            report._id
                          }
                          onClick={() =>
                            updateStatus(
                              report._id,
                              "resolved"
                            )
                          }
                          className="border border-[#55745F] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#356044] disabled:opacity-50"
                        >
                          Resolve
                        </button>
                      )}

                      {report.status !==
                        "dismissed" && (
                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            report._id
                          }
                          onClick={() =>
                            updateStatus(
                              report._id,
                              "dismissed"
                            )
                          }
                          className="border border-[#D8D7D0] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6C706A] disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      )}

                    </div>

                  </div>

                  {/* BODY */}

                  <div className="grid gap-0 lg:grid-cols-[1fr_320px]">

                    {/* LISTING */}

                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col gap-5 sm:flex-row">

                        <div className="h-36 w-full shrink-0 overflow-hidden bg-[#E9E8E0] sm:w-52">
                          {room?.images?.length >
                          0 ? (
                            <img
                              src={
                                room.images[0]
                              }
                              alt={
                                room.title ||
                                "Room"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#979A93]">
                              <AlertTriangle
                                size={25}
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="grid gap-4 sm:grid-cols-2">

                            <Info
                              icon={IndianRupee}
                              label="Monthly rent"
                              value={`₹${Number(
                                room?.rent ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}`}
                            />

                            <Info
                              icon={MapPin}
                              label="Location"
                              value={
                                room?.location
                                  ?.locality ||
                                room?.location
                                  ?.city ||
                                "Not available"
                              }
                            />

                            <Info
                              icon={Eye}
                              label="Views"
                              value={Number(
                                room?.views ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            />

                            <Info
                              icon={User}
                              label="Poster"
                              value={
                                poster?.name ||
                                "Unknown"
                              }
                            />

                          </div>

                          {report.description && (
                            <div className="mt-5 border-t border-[#ECEBE4] pt-4">
                              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#979A93]">
                                Report details
                              </p>

                              <p className="mt-2 text-sm leading-6 text-[#4F5951]">
                                {
                                  report.description
                                }
                              </p>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* ROOM ACTIONS */}

                      <div className="mt-6 flex flex-wrap gap-3">

                        <button
                          type="button"
                          onClick={() => {
                            if (!room?._id)
                              return;

                            navigate(
                              "/rooms/view-details",
                              {
                                state: {
                                  roomId:
                                    room._id,
                                },
                              }
                            );
                          }}
                          disabled={!room?._id}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            border
                            border-[#DDDCD3]
                            bg-[#F8F7F1]
                            px-4
                            py-2.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-[#173F2B]
                            transition
                            hover:bg-white
                            disabled:opacity-40
                          "
                        >
                          <Eye size={14} />
                          View listing
                        </button>

                        {room?._id &&
                          room.status ===
                            "available" && (
                            <button
                              type="button"
                              disabled={
                                takingDownId ===
                                report._id
                              }
                              onClick={() =>
                                takeDownRoom(
                                  room._id,
                                  report._id
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-2.5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.08em]
                                text-red-700
                                transition
                                hover:bg-red-100
                                disabled:opacity-50
                              "
                            >
                              <Ban size={14} />
                              {takingDownId ===
                              report._id
                                ? "Taking down..."
                                : "Take down listing"}
                            </button>
                          )}

                        {room?.status ===
                          "unavailable" && (
                          <span className="inline-flex items-center border border-[#D8D7D0] bg-[#F0EFEC] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6C706A]">
                            Listing unavailable
                          </span>
                        )}

                      </div>

                    </div>

                    {/* REPORTER */}

                    <aside className="border-t border-[#ECEBE4] bg-[#FAF9F4] p-5 sm:p-6 lg:border-l lg:border-t-0">

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#979A93]">
                        Reported by
                      </p>

                      <div className="mt-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center bg-[#173F2B] text-white">
                          <User size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#26372C]">
                            {reporter?.name ||
                              "Unknown user"}
                          </p>

                          <p className="truncate text-xs text-[#747872]">
                            {reporter?.email ||
                              "No email"}
                          </p>
                        </div>

                      </div>

                      {reporter?.phone && (
                        <div className="mt-5 border-t border-[#ECEBE4] pt-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#979A93]">
                            Phone
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#26372C]">
                            {reporter.phone}
                          </p>
                        </div>
                      )}

                      {poster && (
                        <div className="mt-5 border-t border-[#ECEBE4] pt-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#979A93]">
                            Listing owner
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#26372C]">
                            {poster.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 break-all text-xs text-[#747872]">
                            {poster.email ||
                              "No email"}
                          </p>
                        </div>
                      )}

                    </aside>

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="border border-[#DDDCD3] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#979A93]">
          {label}
        </p>

        <Icon
          size={17}
          className="text-[#55745F]"
        />
      </div>

      <p className="mt-4 text-3xl font-bold text-[#173F2B]">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   INFO
========================================================= */

const Info = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-[#55745F]"
        />

        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#979A93]">
          {label}
        </p>
      </div>

      <p className="mt-1 text-sm font-semibold text-[#26372C]">
        {value}
      </p>
    </div>
  );
};

export default AdminReports;