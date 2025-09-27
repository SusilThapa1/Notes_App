import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { FaDesktop, FaMobileAlt, FaGlobe, FaClock } from "react-icons/fa";

const ViewLogins = () => {
  const { userDetails, loading } = useContext(AuthContext);
  const [, setTick] = useState(0);

  // Force re-render every 15s to update "Offline X min ago"
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading sessions...</p>
      </div>
    );

  if (!userDetails?.sessions?.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">No login sessions found</p>
      </div>
    );

  const getStatus = (lastActiveAt) => {
    const diff = Date.now() - new Date(lastActiveAt).getTime();

    if (diff < 2 * 60 * 1000)
      return { status: "Active", color: "bg-green-100 text-green-700" };
    if (diff < 60 * 60 * 1000)
      return {
        status: `Offline (${Math.floor(diff / 60000)} min ago)`,
        color: "bg-gray-100 text-gray-600",
      };
    return {
      status: `Offline (${Math.floor(diff / 3600000)} hr ago)`,
      color: "bg-gray-100 text-gray-600",
    };
  };

  return (
    <div className="mt-16 px-5 md:px-10 lg:px-20 flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Login Sessions</h2>

      {userDetails.sessions.map((session) => {
        const isMobile =
          session.device?.toLowerCase().includes("android") ||
          session.userAgent?.toLowerCase().includes("mobile");
        const { status, color } = getStatus(session.lastActiveAt);

        return (
          <div
            key={session._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Device & Browser */}
            <div className="flex items-center gap-4 flex-1">
              {isMobile ? (
                <FaMobileAlt className="text-blue-500 text-2xl" />
              ) : (
                <FaDesktop className="text-green-500 text-2xl" />
              )}
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {session.device || (isMobile ? "Mobile" : "Desktop")}
                </p>
                <p className="text-gray-500 text-sm">
                  {session.browser || session.userAgent?.split(") ").pop()}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 flex-1 text-gray-700">
              <FaGlobe className="text-gray-400" />
              <span className="text-sm">
                {session.location
                  ? `${session.location.city}, ${session.location.country}`
                  : "Unknown Location"}
              </span>
            </div>

            {/* IP & Last Active */}
            <div className="flex flex-col items-start flex-1 text-gray-600 text-sm">
              <span className="truncate">IP: {session.ip}</span>
              <div className="flex items-center gap-1 mt-1">
                <FaClock className="text-gray-400" />
                <span>{new Date(session.lastActiveAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${color}`}
              >
                {status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewLogins;
