import {
  AlertCircle,
  MapPin,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  getAverageSafetyRating,
  getCrimeHotspotsNear,
} from "../utils/crime-heatmap";

interface SafetyAlertProps {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  className?: string;
}

export function SafetyAlert({
  latitude = 28.6139,
  longitude = 77.209,
  radiusKm = 5,
  className = "",
}: SafetyAlertProps) {
  const nearbyHotspots = getCrimeHotspotsNear(latitude, longitude, radiusKm);
  const safetyRating = getAverageSafetyRating(latitude, longitude, radiusKm);
  const riskLevel =
    safetyRating < 30 ? "safe" : safetyRating < 60 ? "caution" : "high-risk";

  const getSafetyMessage = () => {
    switch (riskLevel) {
      case "safe":
        return "This area has low crime incidents. Feel safe!";
      case "caution":
        return "Exercise caution. Some incidents reported in this area.";
      case "high-risk":
        return "High-risk area. Share your trip details with a trusted contact.";
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case "safe":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-800",
        };
      case "caution":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-800",
        };
      default:
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
        };
    }
  };

  const colors = getRiskColor();

  return (
    <div
      className={`rounded-lg border ${colors.bg} ${colors.border} p-4 space-y-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`${colors.icon} flex-shrink-0`}>
          {riskLevel === "safe" && <CheckCircle className="w-5 h-5" />}
          {riskLevel === "caution" && <AlertTriangle className="w-5 h-5" />}
          {riskLevel === "high-risk" && <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${colors.icon}`}>Area Safety Report</p>
          <p className="text-xs text-gray-600 mt-1">{getSafetyMessage()}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}>
          {safetyRating}% safe
        </span>
      </div>

      {/* Nearby Hotspots */}
      {nearbyHotspots.length > 0 && (
        <div className="bg-white rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {nearbyHotspots.length} crime hotspot(s) nearby ({radiusKm} km)
          </p>
          <div className="space-y-2">
            {nearbyHotspots.slice(0, 3).map((hotspot) => (
              <div key={hotspot.id} className="flex items-start gap-2 text-xs p-2 bg-gray-50 rounded">
                <MapPin className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{hotspot.location}</p>
                  <p className="text-gray-600">
                    {hotspot.incidentsLastMonth} incident(s) last month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Tips */}
      <div className="bg-white rounded-lg p-3 text-xs space-y-2">
        <p className="font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Safety Tips:
        </p>
        <ul className="space-y-1 text-gray-600 list-disc list-inside">
          {riskLevel === "safe" && (
            <>
              <li>Standard safety precautions apply</li>
              <li>Keep your phone charged</li>
            </>
          )}
          {riskLevel === "caution" && (
            <>
              <li>Share your ride details with a trusted contact</li>
              <li>Stay alert and trust your instincts</li>
              <li>Avoid traveling alone if possible</li>
            </>
          )}
          {riskLevel === "high-risk" && (
            <>
              <li>Definitely share your ride with a trusted contact</li>
              <li>Consider avoiding this area, especially at night</li>
              <li>Use SOS feature if needed</li>
              <li>Keep your phone location enabled</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
