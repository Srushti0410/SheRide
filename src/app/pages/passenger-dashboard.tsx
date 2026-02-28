import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  DollarSign,
  Shield,
  AlertCircle,
  User,
  LogOut,
  ChevronRight,
  Star,
  Phone,
  Navigation,
  CheckCircle,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TimeAccessInfo } from "../components/TimeAccessInfo";
import { SafetyAlert } from "../components/SafetyAlert";
import { MapComponent } from "../components/MapComponent";
import RideBookingMap from "../components/RideBookingMap";
import { RideOptionsBottomSheet } from "../components/RideOptionsBottomSheet";
import { BookingButton } from "../components/BookingButton";
import { SafetyUI } from "../components/SafetyUI";

export function PassengerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeRide, _setActiveRide] = useState<{
    id: string;
    driver: string;
    driverRating: number;
    pickup: string;
    destination: string;
    eta: string;
    price: string;
    status: string;
  } | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showRideOptions, setShowRideOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Wallet" | "Cash">("UPI");
  const [walletBalance] = useState(1280);
  const [routeData, setRouteData] = useState<{
    distance: number;
    time: number;
    fare: number;
  } | null>(null);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [tripStatus, setTripStatus] = useState<"idle" | "pickup" | "ontrip" | "dropped">("idle");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rideHistory = [
    {
      id: "1",
      driver: "Priya Singh",
      rating: 4.9,
      from: "Downtown Market",
      to: "Tech Park Office",
      date: "Today, 10:30 AM",
      amount: "₹245",
      status: "Completed",
    },
    {
      id: "2",
      driver: "Anjali Kumar",
      rating: 4.8,
      from: "Home",
      to: "Shopping Mall",
      date: "Yesterday, 2:15 PM",
      amount: "₹180",
      status: "Completed",
    },
    {
      id: "3",
      driver: "Neha Patel",
      rating: 5.0,
      from: "Station",
      to: "Hospital",
      date: "2 days ago",
      amount: "₹320",
      status: "Completed",
    },
  ];

  const safetyFeatures = [
    { name: "SOS Button", active: true, icon: AlertCircle },
    { name: "Share Trip", active: true, icon: Navigation },
    { name: "Driver Verification", active: true, icon: Shield },
    { name: "Real-time Tracking", active: true, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <span className="text-white font-bold">{user?.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-xs text-gray-500">Passenger Account</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="p-4 rounded-2xl border-0 shadow-lg bg-gradient-to-r from-pink-50 to-violet-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900">Women-Only + LGBTQ Friendly Mobility</p>
                <p className="text-sm text-gray-600">Choose Bike, Cab, or Rickshaw with verified drivers and live safety tracking.</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white border border-pink-200 text-pink-700 w-fit">
                Safety Verified Platform
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBooking(true)}
          >
            <Card className="group cursor-pointer relative p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-pink-500 to-rose-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <MapPin className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-1">Book a Ride</h3>
                <p className="text-sm opacity-90 mb-4">Start your journey now</p>
                <div className="flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100">
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSafety(true)}
          >
            <Card className="group cursor-pointer relative p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-500 to-indigo-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <Shield className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-1">Safety Features</h3>
                <p className="text-sm opacity-90 mb-4">Stay protected always</p>
                <div className="flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowStats(true)}
          >
            <Card className="group cursor-pointer relative p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-violet-500 to-blue-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-1">Your Stats</h3>
                <p className="text-sm opacity-90 mb-4">View your activity</p>
                <div className="flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100">
                  See More <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>
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

        {/* Crime Heatmap for Safe Ride Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Safe Locations</h2>
            <p className="text-gray-600 text-sm mb-4">
              View crime hotspots and select pickup/drop locations based on safety ratings
            </p>
            <MapComponent showHeatmap={true} interactive={true} />
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Ride / Book Ride CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {!activeRide ? (
                <Card className="p-8 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Ride?</h2>
                    <p className="text-gray-600 mb-6">
                      Book a ride now and get matched with a verified driver in seconds
                    </p>
                    <Button
                      onClick={() => {
                        setRouteData(null);
                        setShowRideOptions(false);
                        setSelectedRide(null);
                        setTripStatus("idle");
                        setShowBooking(true);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-lg font-semibold"
                    >
                      Book Your Ride
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 rounded-2xl border-0 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Current Ride</h2>
                  {/* Active ride details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{activeRide.driver}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(activeRide.driverRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{activeRide.driverRating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-pink-500" />
                        <div>
                          <p className="text-xs text-gray-500">PICKUP</p>
                          <p className="font-semibold text-gray-900">{activeRide.pickup}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500">DESTINATION</p>
                          <p className="font-semibold text-gray-900">{activeRide.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Clock className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                        <p className="text-xs text-gray-600 mb-1">ETA</p>
                        <p className="font-bold text-gray-900">{activeRide.eta}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <DollarSign className="w-5 h-5 mx-auto mb-2 text-green-500" />
                        <p className="text-xs text-gray-600 mb-1">Price</p>
                        <p className="font-bold text-gray-900">{activeRide.price}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <Shield className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <p className="font-bold text-gray-900 text-sm">{activeRide.status}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="rounded-lg border-2 hover:bg-gray-50"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white rounded-lg">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Emergency SOS
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Ride History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 rounded-2xl border-0 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Rides</h2>
                <div className="space-y-4">
                  {rideHistory.map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{ride.driver}</h4>
                          <p className="text-sm text-gray-600">{ride.from} → {ride.to}</p>
                          <p className="text-xs text-gray-500">{ride.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(ride.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{ride.amount}</p>
                          <p className="text-xs text-green-600 font-semibold">{ride.status}</p>
                        </div>
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
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Safety Features */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Safety Features</h3>
              <div className="space-y-3">
                {safetyFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 group hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{feature.name}</p>
                        <p className="text-xs text-gray-600">
                          {feature.active ? "✓ Active" : "Inactive"}
                        </p>
                      </div>
                      {feature.active && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <h3 className="text-lg font-bold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Total Rides</span>
                  <span className="text-2xl font-bold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Avg. Rating</span>
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Money Saved</span>
                  <span className="text-2xl font-bold">₹880</span>
                </div>
              </div>
            </Card>

            {/* Help & Support */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg mb-3">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full rounded-lg">
                View FAQs
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Book a Ride Modal - Full Screen */}
      {showBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[50] overflow-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/90 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Book Your Ride</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBooking(false);
                setRouteData(null);
                setShowRideOptions(false);
                setSelectedRide(null);
              }}
              className="rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Map with Booking Interface */}
          <div className="p-4">
            <RideBookingMap
              hideInputs={selectedRide !== null}
              onRouteGenerated={(data: any) => {
                setRouteData(data);
                // Only show ride options if not already open and no ride selected
                if (!showRideOptions && !selectedRide) {
                  setShowRideOptions(true);
                }
              }}
              onLocationSelect={(_pickup: any, _drop: any) => {
                // Pickup and drop locations are handled by map component
              }}
            />
          </div>

          {/* Ride Options Bottom Sheet */}
          {routeData && (
            <RideOptionsBottomSheet
              isOpen={showRideOptions}
              onClose={() => setShowRideOptions(false)}
              onSelectRide={(option) => {
                setSelectedRide(option);
                setShowRideOptions(false);
              }}
              basePrice={routeData.fare}
            />
          )}

          {/* Payment & Wallet */}
          {selectedRide && !showRideOptions && (
            <div className="px-4 pb-2">
              <Card className="p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Payment Method</h3>
                  <span className="text-sm text-emerald-600 font-semibold">Wallet ₹{walletBalance}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(["UPI", "Card", "Wallet", "Cash"] as const).map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? "default" : "outline"}
                      className={`rounded-lg text-xs ${paymentMethod === method ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Booking Button */}
          {selectedRide && !showRideOptions && (
            <BookingButton
              selectedRide={selectedRide}
              paymentMethod={paymentMethod}
              onConfirm={() => {
                setTripStatus("pickup");
                setTimeout(() => setTripStatus("ontrip"), 5000);
                setTimeout(() => setTripStatus("dropped"), 15000);
              }}
            />
          )}

          {/* Safety UI */}
          <SafetyUI
            tripStatus={tripStatus}
            onSOS={() => {
              console.log("SOS activated");
            }}
            onShareTrip={() => {
              console.log("Trip shared");
            }}
          />
        </motion.div>
      )}

      {/* Safety Features Modal */}
      {showSafety && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSafety(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Safety Features</h2>
              <button onClick={() => setShowSafety(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: "SOS Button", desc: "Emergency alert to authorities" },
                { name: "Share Trip", desc: "Share your ride details with contacts" },
                { name: "Driver Verification", desc: "Verified & background-checked drivers" },
                { name: "Real-time Tracking", desc: "Live location sharing with family" },
              ].map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{feature.name}</p>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Your Stats Modal */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowStats(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Activity Stats</h2>
              <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Rides", value: "24", icon: MapPin, color: "pink" },
                { label: "Avg. Rating", value: "4.9", icon: Star, color: "purple" },
                { label: "Total Distance", value: "180 km", icon: Navigation, color: "blue" },
                { label: "Amount Saved", value: "₹880", icon: DollarSign, color: "green" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-500 mb-2`} />
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
