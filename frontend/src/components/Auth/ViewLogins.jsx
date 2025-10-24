import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaGlobe } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { removeSession } from "../../../Services/authService";
import {
  showConfirm,
  showError,
  showSuccess,
} from "../../../Utils/alertHelper";

const ViewLogins = () => {
  const { userDetails, loading } = useContext(AuthContext);
  const [, setTick] = useState(0);

  // Use currentDeviceId from context instead of cookies
  const deviceId = userDetails?.currentDeviceId;

  // Force re-render every 10s to update session statuses
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  if (!userDetails?.sessions?.length)
    return (
      <p className="flex flex-col h-[calc(100vh-72px)] justify-center items-center my-20 px-5 w-full gap-5 text-textLight dark:text-textDark">
        No login sessions found
      </p>
    );

  // Determine device status
  const getStatus = (session) => {
    const now = Date.now();
    const lastActive = new Date(session.lastActiveAt).getTime();
    const diff = now - lastActive;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const year = 365 * day;

    const formatTimeAgo = (ms) => {
      if (ms < minute) return "just now";
      if (ms < hour) return `${Math.floor(ms / minute)} min ago`;
      if (ms < day) return `${Math.floor(ms / hour)} hr ago`;
      if (ms < week) return `${Math.floor(ms / day)} days ago`;
      if (ms < year) return `${Math.floor(ms / week)} weeks ago`;
      return `${Math.floor(ms / year)} yr ago`;
    };

    if (session.deviceId === deviceId)
      return {
        status: "This device",
        color: "text-lightGreen dark:text-darkGreen",
      };
    if (diff < 2 * minute)
      return { status: "Active", color: "text-lightGreen dark:text-darkGreen" };

    return {
      status: `Offline (${formatTimeAgo(diff)})`,
      color: "text-subTextLight dark:text-subTextDark",
    };
  };

  // Logout current device
  const removeRemoteSession = async (deviceId) => {
    const response = await showConfirm({
      title: "Remove this session?",
      text: "This device will be logged out",
    });

    if (!response.isConfirmed) return;

    try {
      const res = await removeSession(deviceId);

      if (res.success) {
        showSuccess({ text: "Session removed successfully" });
        // Force UI update by refreshing userDetails
        userDetails.sessions = userDetails.sessions.filter(
          (s) => s.deviceId !== deviceId
        );
        setTick((t) => t + 1);
      } else {
        showError({ text: res.message });
      }
    } catch (err) {
      console.log(err);
      showError({ text: err?.res?.data?.message });
    }
  };

  // Icon based on device type
  const getDeviceIcon = (session) => {
    const agent = session.userAgent?.toLowerCase() || "";
    if (agent.includes("android") || agent.includes("iphone"))
      return <FaMobileAlt className="text-2xl" />;
    if (agent.includes("ipad") || agent.includes("tablet"))
      return <FaTabletAlt className="text-2xl" />;
    return <FaDesktop className="text-2xl" />;
  };

  // Sort: current device first, then most recent activity
  const sortedSessions = [...userDetails.sessions].sort((a, b) => {
    if (a.deviceId === deviceId) return -1;
    if (b.deviceId === deviceId) return 1;
    return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
  });

  return (
    <div className="flex flex-col  my-20 min-h-[calc(100vh-72px)] px-5 py-2 md:px-10 lg:px-20 w-full gap-5">
      <h2 className="text-3xl font-semibold text-textLight dark:text-textDark">
        Recent Login Sessions
      </h2>
      <p className=" font-semibold text-subTextLight dark:text-subTextDark">
        See where you have been logged in:
      </p>

      {sortedSessions.map((s) => {
        const { status, color } = getStatus(s);

        return (
          <div
            key={s._id}
            className="w-full p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between md:items-center bg-light dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`${color}`}>{getDeviceIcon(s)}</div>
              <div>
                <p className="font-medium text-textLight dark:text-textDark">
                  {s.device || "Unknown Device"} (
                  {s.browser || "Unknown Browser"})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ">
              <FaGlobe className={`${color}`} />
              <span className="text-sm text-textLight dark:text-textDark">
                {s.location
                  ? `${s.location.city}, ${s.location.country}`
                  : "Unknown Location"}
              </span>
              <span
                className={`ml-4 px-4 py-1 rounded-full text-sm font-semibold ${color}`}
              >
                {status}
              </span>
              {(status === "Active" || status === "This device") && (
                <span className="w-3 h-3 rounded-full bg-lightGreen animate-pulse" />
              )}
            </div>

            {status !== "This device" && (
              <button
                onClick={() => removeRemoteSession(s.deviceId)}
                className="px-4 py-2 bg-deleteNormal text-white rounded-lg hover:bg-deleteHover transition-colors duration-300"
              >
                Logout this device
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ViewLogins;
