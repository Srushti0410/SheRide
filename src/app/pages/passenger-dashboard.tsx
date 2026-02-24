import { Header } from "../components/header";
import { GlassCard } from "../components/glass-card";
import { motion } from "motion/react";
import { 
  MapPin, Navigation, Clock, Star, AlertOctagon,
  User, Phone, MessageCircle, DollarSign, Car, Bike
} from "lucide-react";
import { useState } from "react";

export function PassengerDashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideType, setRideType] = useState<"cab" | "bike">("cab");
  const [rideStatus, setRideStatus] = useState<"searching" | "matched" | "ongoing" | null>(null);

  const currentDriver = {
    name: "Priya Sharma",
    rating: 4.9,
    rides: 1250,
    vehicle: "Honda City - DL 3C AB 1234",
    phone: "+91 98765 43210",
    photo: "https://images.unsplash.com/photo-1575997759025-5cb986a6041d?w=150"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              Passenger Dashboard
            </h1>
            <p className="text-gray-600">Book your safe ride with verified women drivers</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking */}
            <div className="lg:col-span-1 space-y-6">
              {/* Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Book a Ride</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A0DAD]" size={20} />
                        <input
                          type="text"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Enter pickup location"
                          className="w-full pl-12 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]/50 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Drop Location</label>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF4FA3]" size={20} />
                        <input
                          type="text"
                          value={drop}
                          onChange={(e) => setDrop(e.target.value)}
                          placeholder="Enter drop location"
                          className="w-full pl-12 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]/50 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Ride Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRideType("cab")}
                          className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                            rideType === "cab"
                              ? "border-[#6A0DAD] bg-[#6A0DAD]/10"
                              : "border-purple-200 hover:border-purple-300"
                          }`}
                        >
                          <Car size={24} className={rideType === "cab" ? "text-[#6A0DAD]" : "text-gray-500"} />
                          <span className={`font-semibold ${rideType === "cab" ? "text-[#6A0DAD]" : "text-gray-700"}`}>
                            Cab
                          </span>
                          <span className="text-xs text-gray-500">₹12/km</span>
                        </button>
                        <button
                          onClick={() => setRideType("bike")}
                          className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                            rideType === "bike"
                              ? "border-[#FF4FA3] bg-[#FF4FA3]/10"
                              : "border-purple-200 hover:border-purple-300"
                          }`}
                        >
                          <Bike size={24} className={rideType === "bike" ? "text-[#FF4FA3]" : "text-gray-500"} />
                          <span className={`font-semibold ${rideType === "bike" ? "text-[#FF4FA3]" : "text-gray-700"}`}>
                            Bike
                          </span>
                          <span className="text-xs text-gray-500">₹6/km</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setRideStatus("matched")}
                      className="w-full py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      Find Driver
                    </button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-gray-800">Recent Locations</h3>
                  <div className="space-y-3">
                    {["Home - Sector 12, Noida", "Office - Connaught Place", "Mall - Select City Walk"].map((location, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <Clock size={16} className="text-[#6A0DAD]" />
                        <span className="text-sm text-gray-700">{location}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Center Column - Map */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6 h-[600px] relative overflow-hidden">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Live Map</h2>
                  
                  {/* Mock Map */}
                  <div className="absolute inset-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={48} className="text-[#6A0DAD] mx-auto mb-2" />
                      <p className="text-gray-600">Map Interface</p>
                      <p className="text-sm text-gray-500">Real-time tracking enabled</p>
                    </div>
                  </div>

                  {/* Route Overlay */}
                  {rideStatus === "ongoing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-20 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Estimated Arrival</span>
                        <span className="text-lg font-bold text-[#6A0DAD]">12 mins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Distance</span>
                        <span className="text-lg font-bold text-[#FF4FA3]">5.2 km</span>
                      </div>
                    </motion.div>
                  )}

                  {/* SOS Button - Floating */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-red-500/50 transition-all z-10"
                  >
                    <AlertOctagon className="text-white" size={28} />
                  </motion.button>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - Driver Info & Status */}
            <div className="lg:col-span-1 space-y-6">
              {rideStatus === "matched" || rideStatus === "ongoing" ? (
                <>
                  {/* Driver Info */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <GlassCard className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Driver</h2>
                      
                      <div className="flex items-start space-x-4 mb-6">
                        <img
                          src={currentDriver.photo}
                          alt={currentDriver.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{currentDriver.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="text-yellow-500 fill-yellow-500" size={16} />
                            <span className="font-semibold text-gray-700">{currentDriver.rating}</span>
                            <span className="text-sm text-gray-500">({currentDriver.rides} rides)</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{currentDriver.vehicle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl hover:shadow-lg transition-all">
                          <Phone size={18} />
                          <span>Call</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-[#6A0DAD] text-[#6A0DAD] rounded-xl hover:bg-[#6A0DAD] hover:text-white transition-all">
                          <MessageCircle size={18} />
                          <span>Chat</span>
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Ride Status */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GlassCard className="p-6">
                      <h3 className="font-bold mb-4 text-gray-800">Ride Status</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Driver Assigned</p>
                            <p className="text-sm text-gray-500">2 mins ago</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Navigation className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Driver En Route</p>
                            <p className="text-sm text-gray-500">Arriving in 5 mins</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-purple-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Estimated Fare</span>
                            <span className="text-2xl font-bold text-[#6A0DAD]">₹145</span>
                          </div>
                          <p className="text-xs text-gray-500">Final fare may vary based on actual distance</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="font-bold mb-4 text-gray-800">Safety Features</h3>
                    <div className="space-y-4">
                      {[
                        { icon: <AlertOctagon className="text-red-500" />, text: "24/7 SOS Button" },
                        { icon: <MapPin className="text-[#6A0DAD]" />, text: "Live Location Sharing" },
                        { icon: <User className="text-[#FF4FA3]" />, text: "Verified Women Drivers" },
                        { icon: <Star className="text-yellow-500" />, text: "Rated 4.8+ Drivers Only" }
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          {feature.icon}
                          <span className="text-sm text-gray-700">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Recent Rides */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-gray-800">Recent Rides</h3>
                  <div className="space-y-3">
                    {[
                      { date: "Today, 10:30 AM", fare: "₹120", rating: 5 },
                      { date: "Yesterday, 6:45 PM", fare: "₹95", rating: 5 },
                      { date: "Feb 22, 2:15 PM", fare: "₹180", rating: 4 }
                    ].map((ride, i) => (
                      <div key={i} className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm text-gray-600">{ride.date}</span>
                          <span className="font-semibold text-[#6A0DAD]">{ride.fare}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(ride.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
