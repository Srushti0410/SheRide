import { Header } from "../components/header";
import { GlassCard } from "../components/glass-card";
import { motion } from "motion/react";
import { 
  Power, MapPin, DollarSign, TrendingUp, Clock,
  User, Phone, X, Check, Shield, Award, AlertTriangle,
  Calendar, CreditCard, ChevronRight
} from "lucide-react";
import { useState } from "react";

export function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(true);

  const rideRequest = {
    passenger: "Ananya Verma",
    pickup: "Sector 18, Noida",
    drop: "India Gate, Delhi",
    distance: "12.5 km",
    fare: "₹180",
    rating: 4.8,
    time: "2 mins away"
  };

  const earnings = {
    today: 1250,
    week: 8500,
    month: 32400,
    rides: 18
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                Driver Dashboard
              </h1>
              <p className="text-gray-600">Manage your rides and earnings</p>
            </div>

            {/* Online/Offline Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOnline(!isOnline)}
              className={`px-8 py-4 rounded-full font-semibold transition-all flex items-center space-x-3 ${
                isOnline
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Power size={24} />
              <span className="text-lg">{isOnline ? "Online" : "Offline"}</span>
            </motion.button>
          </motion.div>

          {/* Earnings Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today", amount: earnings.today, icon: <Calendar />, color: "from-blue-500 to-blue-600" },
                { label: "This Week", amount: earnings.week, icon: <TrendingUp />, color: "from-purple-500 to-purple-600" },
                { label: "This Month", amount: earnings.month, icon: <DollarSign />, color: "from-pink-500 to-pink-600" },
                { label: "Rides Today", amount: earnings.rides, icon: <Award />, color: "from-green-500 to-green-600", isCount: true }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white`}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {item.isCount ? item.amount : `₹${item.amount.toLocaleString()}`}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Ride Requests */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ride Request Card */}
              {showRideRequest && isOnline && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard className="p-6 border-2 border-[#FF4FA3] relative overflow-hidden">
                    {/* Pulsing Animation */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF4FA3]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">New Ride Request</h2>
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold animate-pulse">
                          {rideRequest.time}
                        </span>
                      </div>

                      <div className="bg-white/50 rounded-xl p-4 mb-4">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                            {rideRequest.passenger.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{rideRequest.passenger}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Award className="text-yellow-500" size={16} />
                              <span className="text-sm font-semibold text-gray-700">{rideRequest.rating}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-[#6A0DAD]">{rideRequest.fare}</div>
                            <div className="text-sm text-gray-500">{rideRequest.distance}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pickup</p>
                              <p className="font-semibold text-gray-800">{rideRequest.pickup}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Drop</p>
                              <p className="font-semibold text-gray-800">{rideRequest.drop}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowRideRequest(false)}
                          className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center space-x-2"
                        >
                          <X size={20} />
                          <span>Decline</span>
                        </button>
                        <button className="px-6 py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2">
                          <Check size={20} />
                          <span>Accept</span>
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Current Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Current Status</h2>
                  
                  {isOnline ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-green-700">You are online and ready for rides</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <Clock className="text-[#6A0DAD] mb-2" size={24} />
                          <p className="text-sm text-gray-600">Online Time</p>
                          <p className="text-xl font-bold text-gray-800">3h 25m</p>
                        </div>
                        <div className="p-4 bg-pink-50 rounded-xl">
                          <Shield className="text-[#FF4FA3] mb-2" size={24} />
                          <p className="text-sm text-gray-600">Safety Score</p>
                          <p className="text-xl font-bold text-gray-800">100%</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Power className="text-gray-400 mx-auto mb-3" size={48} />
                      <p className="text-gray-600 mb-4">You are currently offline</p>
                      <button
                        onClick={() => setIsOnline(true)}
                        className="px-6 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Go Online
                      </button>
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Safety Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Safety Alert Indicator</h2>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Shield className="text-white" size={24} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-700">All Systems Active</span>
                      </div>
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-700">GPS Tracking On</span>
                      </div>
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-700">Dashcam Recording</span>
                      </div>
                      <Check className="text-green-600" size={18} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - Loan & Stats */}
            <div className="space-y-6">
              {/* Loan Eligibility */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlassCard className="p-6 bg-gradient-to-br from-[#6A0DAD]/5 to-[#FF4FA3]/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Loan Eligibility</h3>
                    <CreditCard className="text-[#6A0DAD]" size={24} />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Eligible Amount</span>
                      <span className="text-2xl font-bold text-[#6A0DAD]">₹50,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on your earnings and ride history</p>
                  </div>

                  <button className="w-full px-4 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                    <span>Apply for Loan</span>
                    <ChevronRight size={18} />
                  </button>
                </GlassCard>
              </motion.div>

              {/* Performance Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-gray-800">Performance</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Rating</span>
                        <span className="font-bold text-gray-800">4.9/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Acceptance Rate</span>
                        <span className="font-bold text-gray-800">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="font-bold text-gray-800">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-gray-800">Recent Rides</h3>
                  
                  <div className="space-y-3">
                    {[
                      { time: "2:30 PM", fare: "₹180", distance: "12 km", passenger: "Neha K." },
                      { time: "1:15 PM", fare: "₹95", distance: "6 km", passenger: "Priya S." },
                      { time: "11:45 AM", fare: "₹220", distance: "15 km", passenger: "Anjali M." }
                    ].map((ride, i) => (
                      <div key={i} className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-semibold text-gray-800">{ride.passenger}</p>
                            <p className="text-xs text-gray-500">{ride.time} • {ride.distance}</p>
                          </div>
                          <span className="font-bold text-[#6A0DAD]">{ride.fare}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-gray-800">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <button className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">View Earnings</span>
                      <ChevronRight size={18} className="text-gray-500" />
                    </button>
                    <button className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Insurance Details</span>
                      <ChevronRight size={18} className="text-gray-500" />
                    </button>
                    <button className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Safety Training</span>
                      <ChevronRight size={18} className="text-gray-500" />
                    </button>
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
