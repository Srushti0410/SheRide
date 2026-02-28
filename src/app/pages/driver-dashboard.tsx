import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Power,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  LogOut,
  Check,
  Shield,
  Award,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TimeAccessInfo } from "../components/TimeAccessInfo";
import { SafetyAlert } from "../components/SafetyAlert";
import { MapComponent } from "../components/MapComponent";
import {
  EarningsChart,
  DocumentVerification,
  TripStatistics,
  EmergencyFeatures,
  MaintenanceReminders,
  BonusTracking,
  NightSafetyMode,
} from "../components/DriverEnhancedFeatures";

export function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rideRequest = {
    passenger: "Ananya Verma",
    pickup: "Sector 18, Noida",
    drop: "India Gate, Delhi",
    distance: "12.5 km",
    fare: "₹180",
    rating: 4.8,
    time: "2 mins away",
  };

  const earnings = {
    today: 1250,
    week: 8500,
    month: 32400,
    rides: 18,
  };

  const recentRides = [
    { time: "2:30 PM", fare: "₹180", distance: "12 km", passenger: "Neha K." },
    { time: "1:15 PM", fare: "₹95", distance: "6 km", passenger: "Priya S." },
    { time: "11:45 AM", fare: "₹220", distance: "15 km", passenger: "Anjali M." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold">{user?.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-xs text-gray-500">Driver Account</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOnline(!isOnline)}
              className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${isOnline
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? "Online" : "Offline"}
            </motion.button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Earnings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: "Today",
              amount: earnings.today,
              icon: Calendar,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "This Week",
              amount: earnings.week,
              icon: TrendingUp,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "This Month",
              amount: earnings.month,
              icon: DollarSign,
              gradient: "from-pink-500 to-pink-600",
            },
            {
              label: "Rides Today",
              amount: earnings.rides,
              icon: Award,
              gradient: "from-green-500 to-green-600",
              isCount: true,
            },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {item.isCount ? item.amount : `₹${item.amount.toLocaleString()}`}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Time-Based Access & Safety Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6 mb-8"
        >
          <TimeAccessInfo userGender={user?.profile?.gender} className="bg-white" />
          {user?.profile?.homeLocation && (
            <SafetyAlert
              latitude={user.profile.homeLocation.lat}
              longitude={user.profile.homeLocation.lng}
              radiusKm={5}
              className="bg-white"
            />
          )}
        </motion.div>

        {/* Crime Heatmap for Safe Route Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Safe Routes & Areas</h2>
            <p className="text-gray-600 text-sm mb-4">
              Plan your routes based on safety ratings and crime hotspots
            </p>
            <MapComponent showHeatmap={true} interactive={true} />
          </Card>
        </motion.div>

        {/* New Enhanced Features Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <EarningsChart />
          <BonusTracking />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <DocumentVerification />
          <TripStatistics />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <EmergencyFeatures />
          <MaintenanceReminders />
        </div>

        <NightSafetyMode />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ride Request */}
            {showRideRequest && isOnline && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-6 rounded-2xl border-2 border-pink-500 shadow-lg relative overflow-hidden bg-white">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full -mr-10 -mt-10"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">New Ride Request</h2>
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold animate-pulse">
                        {rideRequest.time}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                          {rideRequest.passenger.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{rideRequest.passenger}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold text-gray-700">{rideRequest.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {rideRequest.fare}
                          </div>
                          <div className="text-sm text-gray-600">{rideRequest.distance}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pickup</p>
                            <p className="font-semibold text-gray-900">{rideRequest.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Drop</p>
                            <p className="font-semibold text-gray-900">{rideRequest.drop}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => setShowRideRequest(false)}
                        variant="outline"
                        className="rounded-lg border-2"
                      >
                        Decline
                      </Button>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg">
                        Accept Ride
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Online Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-6 rounded-2xl border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Status</h2>

                {isOnline ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-green-700">
                        You are online and ready for rides
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Online Time</p>
                        <p className="text-2xl font-bold text-gray-900">3h 25m</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <Shield className="w-6 h-6 text-pink-600 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Safety Score</p>
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Power className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-semibold">You are currently offline</p>
                    <Button
                      onClick={() => setIsOnline(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg"
                    >
                      Go Online
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 rounded-2xl border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Driver Rating</span>
                      <span className="font-bold text-gray-900">4.9/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Acceptance Rate</span>
                      <span className="font-bold text-gray-900">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-bold text-gray-900">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Rides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 rounded-2xl border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Rides</h2>

                <div className="space-y-3">
                  {recentRides.map((ride, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900">{ride.passenger}</p>
                          <p className="text-xs text-gray-600">
                            {ride.time} • {ride.distance}
                          </p>
                        </div>
                        <span className="font-bold text-green-600 text-lg">{ride.fare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Loan Eligibility */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Loan Eligibility</h3>
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">Eligible Amount</span>
                  <span className="text-2xl font-bold text-purple-600">₹50,000</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Based on your earnings & ride history
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg">
                Apply for Loan
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Safety Features */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Safety & Insurance</h3>

              <div className="space-y-3">
                {[
                  { label: "All Systems Active", enabled: true },
                  { label: "GPS Tracking On", enabled: true },
                  { label: "Dashcam Recording", enabled: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    {item.enabled && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth Tracking */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Financial Growth
              </h3>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ₹1,28,900
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Next Goal</p>
                  <p className="text-lg font-bold text-gray-900">₹2,00,000</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-between rounded-lg"
                >
                  <span>View Detailed Earnings</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-between rounded-lg"
                >
                  <span>Insurance & Documents</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-between rounded-lg"
                >
                  <span>Safety Training</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
