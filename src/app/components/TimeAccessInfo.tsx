import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import {
  isNightTime,
  checkAccessByTimeAndGender,
  formatCurrentTime,
  getTimeRestrictionsInfo,
} from "../utils/time-access-control";

interface TimeAccessInfoProps {
  userGender?: string;
  className?: string;
}

export function TimeAccessInfo({ userGender = "male", className = "" }: TimeAccessInfoProps) {
  const [timeType, setTimeType] = useState<"day" | "night">("day");
  const [currentTime, setCurrentTime] = useState("");
  const [accessInfo, setAccessInfo] = useState<any>(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatCurrentTime());
      const isNight = isNightTime();
      setTimeType(isNight ? "night" : "day");

      const access = checkAccessByTimeAndGender(isNight ? "night" : "day", userGender);
      setAccessInfo(access);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userGender]);

  if (!accessInfo) return null;

  const restrictions = getTimeRestrictionsInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border space-y-4 ${className}`}
    >
      {/* Current Time and Type */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Current Time</p>
            <p className="text-xs text-gray-600">{currentTime}</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${timeType === "day"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-indigo-100 text-indigo-800"
            }`}
        >
          {timeType === "day" ? "☀️ Day Time" : "🌙 Night Time"}
        </div>
      </div>

      {/* Access Status */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          {accessInfo.canAccessRide ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {accessInfo.canAccessRide ? "Access Allowed" : "Access Restricted"}
            </p>
            <p className="text-xs text-gray-600 mt-1">{accessInfo.message}</p>
          </div>
        </div>
      </div>

      {/* Available Ride Types */}
      {accessInfo.canAccessRide && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-900 mb-2">Available Ride Types:</p>
          <div className="flex flex-wrap gap-2">
            {accessInfo.availableRideTypes.map((type: string) => (
              <span
                key={type}
                className={`text-xs px-2 py-1 rounded-full font-medium ${type === "girls-only"
                  ? "bg-pink-100 text-pink-800"
                  : "bg-blue-100 text-blue-800"
                  }`}
              >
                {type === "girls-only" ? "👩 Girls Only Ride" : "🚗 Regular Ride"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Time Restrictions Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-2">
        <p className="font-semibold text-gray-900">Operating Hours:</p>
        <div className="space-y-1 text-gray-600">
          <p>
            <span className="font-medium">Day:</span> {restrictions.dayHours}
          </p>
          <p>
            <span className="font-medium">Night:</span> {restrictions.nightHours}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
