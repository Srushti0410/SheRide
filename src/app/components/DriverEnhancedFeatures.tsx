import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  FileCheck,
  MapPin,
  Shield,
  Wrench,
  Gift,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Phone,
  AlertCircle as SOS,
  Car,
  GraduationCap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// ─── Earnings Chart Component ───
export function EarningsChart() {
  const weeklyData = [
    { day: "Mon", earnings: 1200 },
    { day: "Tue", earnings: 1450 },
    { day: "Wed", earnings: 980 },
    { day: "Thu", earnings: 1650 },
    { day: "Fri", earnings: 2100 },
    { day: "Sat", earnings: 2350 },
    { day: "Sun", earnings: 1770 },
  ];

  const maxEarnings = Math.max(...weeklyData.map(d => d.earnings));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Weekly Earnings</h3>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-40 mb-6">
          {weeklyData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(item.earnings / maxEarnings) * 100}%` }}
              transition={{ delay: i * 0.05 }}
              className="flex-1"
              title={`${item.day}: ₹${item.earnings}`}
            >
              <div className={`w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg cursor-pointer hover:opacity-80 transition-opacity ${i === 5 || i === 6 ? "shadow-lg shadow-emerald-500/50" : ""}`}>
                <div className="h-full w-full relative">
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                    {item.day}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-xl font-bold text-emerald-600">₹12,500</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Average</p>
            <p className="text-xl font-bold text-teal-600">₹1,786</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Best Day</p>
            <p className="text-xl font-bold text-green-600">₹2,350</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Document Verification Component ───
export function DocumentVerification() {
  const documents = [
    { name: "License", status: "verified", expiryDate: "2026-12-15", icon: FileCheck },
    { name: "Insurance", status: "verified", expiryDate: "2025-06-30", icon: Shield },
    { name: "Vehicle RC", status: "verified", expiryDate: "2027-03-20", icon: Car },
    { name: "Pollution Certificate", status: "expiring-soon", expiryDate: "2025-03-15", icon: AlertTriangle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" />
          Document Status
        </h3>

        <div className="space-y-3">
          {documents.map((doc, i) => {
            const Icon = doc.icon;
            const isExpiring = doc.status === "expiring-soon";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-lg border-2 ${isExpiring
                  ? "border-orange-200 bg-orange-50"
                  : "border-green-200 bg-green-50"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${isExpiring
                        ? "text-orange-600"
                        : "text-green-600"
                        }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-600">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isExpiring ? (
                    <span className="px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-xs font-bold">
                      Renew Soon
                    </span>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Trip Statistics Component ───
export function TripStatistics() {
  const stats = [
    { label: "Total Distance", value: "2,450 km", icon: MapPin, color: "blue" },
    { label: "Avg. Rating", value: "4.9/5.0", icon: Star, color: "yellow" },
    { label: "Rides This Month", value: "78", icon: Car, color: "purple" },
    { label: "On-Time Rate", value: "96%", icon: Clock, color: "green" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Trip Insights</h3>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`}
              >
                <Icon className={`w-6 h-6 text-${stat.color}-600 mb-2`} />
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── SOS & Emergency Features Component ───
export function EmergencyFeatures() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className={`p-6 rounded-2xl border-2 shadow-lg transition-all ${emergencyMode
        ? "border-red-500 bg-red-50"
        : "border-violet-200 bg-violet-50"
        }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Emergency & Support</h3>
          {emergencyMode && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {/* SOS Button */}
          <motion.button
            onClick={() => setEmergencyMode(!emergencyMode)}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${emergencyMode
              ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
              : "bg-red-500 hover:bg-red-600 text-white"
              }`}
          >
            <SOS className="w-5 h-5" />
            {emergencyMode ? "SOS ACTIVE" : "Trigger SOS"}
          </motion.button>

          {/* Emergency Contacts */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 justify-center py-3"
            >
              <Phone className="w-4 h-4" />
              Police
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 justify-center py-3"
            >
              <Phone className="w-4 h-4" />
              Support
            </Button>
          </div>

          {/* Safety Features Status */}
          <div className="space-y-2 mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Live Location Sharing</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Audio Recording</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Incident Report</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Vehicle Maintenance Component ───
export function MaintenanceReminders() {
  const maintenanceItems = [
    { task: "Oil Change", dueDate: "2025-04-15", priority: "medium", icon: Wrench },
    { task: "Tire Rotation", dueDate: "2025-05-20", priority: "low", icon: Wrench },
    { task: "Battery Check", dueDate: "2025-03-30", priority: "high", icon: AlertTriangle },
    { task: "Brake Inspection", dueDate: "2025-04-30", priority: "high", icon: AlertTriangle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          Vehicle Maintenance
        </h3>

        <div className="space-y-3">
          {maintenanceItems.map((item, i) => {
            const Icon = item.icon;
            const daysUntil = Math.ceil(
              (new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const isUrgent = daysUntil <= 7;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-lg border-l-4 ${isUrgent
                  ? "border-l-red-500 bg-red-50"
                  : item.priority === "medium"
                    ? "border-l-orange-500 bg-orange-50"
                    : "border-l-green-500 bg-green-50"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 ${isUrgent ? "text-red-600" : "text-orange-600"
                      }`} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{item.task}</p>
                      <p className="text-xs text-gray-600">
                        {daysUntil} days remaining
                      </p>
                    </div>
                  </div>
                  {isUrgent && (
                    <span className="text-xs font-bold text-red-600">URGENT</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Bonus & Promotion Component ───
export function BonusTracking() {
  const bonuses = [
    { name: "Night Ride Bonus", progress: 75, target: 20, earned: "₹/ride", status: "active" },
    { name: "Rating Milestone", progress: 45, target: 100, earned: "₹5,000", status: "active" },
    { name: "Referral Program", progress: 8, target: 10, earned: "₹500/ref", status: "active" },
    { name: "Surge Hours", progress: 95, target: 100, earned: "2x Fare", status: "available-soon" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-600" />
          Active Bonuses & Promotions
        </h3>

        <div className="space-y-4">
          {bonuses.map((bonus, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-white/60 border border-amber-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{bonus.name}</p>
                  <p className="text-xs text-gray-600">{bonus.earned}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${bonus.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
                  }`}>
                  {bonus.status === "active" ? "Active" : "Coming"}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (bonus.progress / bonus.target) * 100)}%` }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full"
                ></motion.div>
              </div>

              <p className="text-xs text-gray-600 mt-1">
                {bonus.progress} of {bonus.target} {bonus.target > 20 ? "rides" : "referrals"}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Night Mode/Safety Features Component ───
export function NightSafetyMode() {
  const [nightModeEnabled, setNightModeEnabled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className={`p-6 rounded-2xl border-0 shadow-lg transition-all ${nightModeEnabled
        ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        : "bg-white"
        }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-lg ${nightModeEnabled ? "text-white" : "text-gray-900"}`}>
            Night Safety Mode
          </h3>
          <motion.button
            onClick={() => setNightModeEnabled(!nightModeEnabled)}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all ${nightModeEnabled
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {nightModeEnabled ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <div className={`space-y-3 p-4 rounded-lg border-2 ${nightModeEnabled
          ? "border-blue-500 bg-slate-800/50"
          : "border-gray-200 bg-gray-50"
          }`}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${nightModeEnabled ? "text-blue-400" : "text-green-600"}`} />
            <span className={nightModeEnabled ? "text-gray-200" : "text-gray-700"}>
              Brightness Reduced
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${nightModeEnabled ? "text-blue-400" : "text-green-600"}`} />
            <span className={nightModeEnabled ? "text-gray-200" : "text-gray-700"}>
              Enhanced Headlight Alerts
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${nightModeEnabled ? "text-blue-400" : "text-green-600"}`} />
            <span className={nightModeEnabled ? "text-gray-200" : "text-gray-700"}>
              Route Optimization for Safety
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${nightModeEnabled ? "text-blue-400" : "text-green-600"}`} />
            <span className={nightModeEnabled ? "text-gray-200" : "text-gray-700"}>
              Location Shared with Trusted Contacts
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function TrainingLicenseSupport() {
  const trainings = [
    { title: "Learner License Guidance", status: "Available", eta: "Book now" },
    { title: "Partner Driving School", status: "Open", eta: "12 slots" },
    { title: "Practice Test", status: "Ready", eta: "20 questions" },
    { title: "Training Fee Assistance", status: "Eligible", eta: "Up to ₹2,000" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.42 }}
    >
      <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-violet-50">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          Training & License Assistance
        </h3>
        <div className="space-y-3">
          {trainings.map((item) => (
            <div key={item.title} className="p-3 rounded-lg bg-white/80 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.eta}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{item.status}</span>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white">
          Book Training Session
        </Button>
      </Card>
    </motion.div>
  );
}

// Star icon import
function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
