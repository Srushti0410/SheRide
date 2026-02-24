import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { GlassCard } from "../components/glass-card";
import { motion } from "motion/react";
import { 
  AlertOctagon, Shield, MapPin, Radio, Camera, Bell,
  Navigation, Lock, Eye, Phone, Users, CheckCircle,
  AlertTriangle, Activity, Mic
} from "lucide-react";
import { useState } from "react";

export function SafetyPage() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                🛡️ Your Safety is Our Priority
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              Advanced Safety System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered safety features designed to protect women passengers and drivers at every step
            </p>
          </motion.div>

          {/* Emergency SOS Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GlassCard className="p-12 text-center bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Emergency SOS Button</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Instant emergency alert sent to local authorities, emergency contacts, and our 24/7 response team
              </p>
              
              <motion.button
                whileHover={{ scale: sosActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSosActive(!sosActive)}
                className={`w-48 h-48 rounded-full font-bold text-2xl transition-all mx-auto flex flex-col items-center justify-center space-y-3 ${
                  sosActive
                    ? "bg-red-600 shadow-2xl shadow-red-500/50 animate-pulse"
                    : "bg-gradient-to-br from-red-500 to-red-600 hover:shadow-2xl hover:shadow-red-500/30"
                } text-white`}
              >
                <AlertOctagon size={64} />
                <span>{sosActive ? "ACTIVE" : "SOS"}</span>
              </motion.button>

              {sosActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-red-100 border-2 border-red-300 rounded-xl max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center space-x-2 text-red-700">
                    <Activity className="animate-pulse" />
                    <span className="font-semibold">Emergency alert activated!</span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    Authorities notified • Location shared • Recording started
                  </p>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Safety Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Navigation className="text-white" size={32} />,
                title: "Route Deviation Alert",
                description: "AI monitors your route in real-time and alerts you if the driver deviates from the planned path",
                gradient: "from-blue-500 to-blue-600",
                status: "Active"
              },
              {
                icon: <MapPin className="text-white" size={32} />,
                title: "Geo-fencing",
                description: "Smart alerts when entering or leaving unsafe zones based on historical data and AI analysis",
                gradient: "from-purple-500 to-purple-600",
                status: "Monitoring"
              },
              {
                icon: <Camera className="text-white" size={32} />,
                title: "Dual Dashcam",
                description: "Front and interior cameras recording every ride with encrypted cloud backup",
                gradient: "from-pink-500 to-pink-600",
                status: "Recording"
              },
              {
                icon: <Mic className="text-white" size={32} />,
                title: "Voice Commands",
                description: "Hands-free emergency activation with voice commands like 'SheRide Emergency'",
                gradient: "from-red-500 to-red-600",
                status: "Listening"
              },
              {
                icon: <Phone className="text-white" size={32} />,
                title: "Live Tracking",
                description: "Share real-time location with trusted contacts during your entire journey",
                gradient: "from-green-500 to-green-600",
                status: "Enabled"
              },
              {
                icon: <Shield className="text-white" size={32} />,
                title: "24/7 Support",
                description: "Dedicated women safety team available round the clock for any concerns",
                gradient: "from-indigo-500 to-indigo-600",
                status: "Online"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-6 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Route Deviation UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Route Deviation Alert System</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">How It Works</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <CheckCircle className="text-green-500" />, text: "AI compares real-time route with optimal path" },
                      { icon: <CheckCircle className="text-green-500" />, text: "Alerts triggered if deviation exceeds 500 meters" },
                      { icon: <CheckCircle className="text-green-500" />, text: "Automatic notification to emergency contacts" },
                      { icon: <CheckCircle className="text-green-500" />, text: "Driver explanation required or ride auto-paused" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                        {item.icon}
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <Navigation size={64} className="text-[#6A0DAD] mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold mb-2">Live Route Monitoring</p>
                    <p className="text-sm text-gray-600">AI-powered deviation detection in real-time</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Geo-fencing Unsafe Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Geo-fencing & Unsafe Zone Alerts</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 h-full flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="text-white" size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Heat Map Visualization</h3>
                        <p className="text-gray-600">AI-analyzed unsafe zones based on historical data</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { level: "High Risk", color: "bg-red-500", zones: 12 },
                        { level: "Medium Risk", color: "bg-orange-400", zones: 28 },
                        { level: "Safe Zones", color: "bg-green-500", zones: 160 }
                      ].map((zone, i) => (
                        <div key={i} className="bg-white/80 rounded-xl p-4 text-center">
                          <div className={`w-12 h-12 ${zone.color} rounded-full mx-auto mb-2`}></div>
                          <p className="text-sm font-semibold text-gray-700">{zone.level}</p>
                          <p className="text-2xl font-bold text-gray-800">{zone.zones}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="text-red-600" size={20} />
                      <span className="font-bold text-red-700">High Alert Zone</span>
                    </div>
                    <p className="text-sm text-red-600">Automatic speed restriction & increased monitoring</p>
                  </div>

                  <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bell className="text-orange-600" size={20} />
                      <span className="font-bold text-orange-700">Caution Zone</span>
                    </div>
                    <p className="text-sm text-orange-600">Enhanced tracking & driver alerts enabled</p>
                  </div>

                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="font-bold text-green-700">Safe Zone</span>
                    </div>
                    <p className="text-sm text-green-600">Normal operation with standard safety protocols</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Dashcam Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Dual Dashcam System</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 rounded-full flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-semibold">REC</span>
                  </div>
                  <Camera size={48} className="text-white/50" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-semibold">Front Camera</p>
                    <p className="text-white/70 text-xs">1080p • Wide Angle</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 rounded-full flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-semibold">REC</span>
                  </div>
                  <Camera size={48} className="text-white/50" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-semibold">Interior Camera</p>
                    <p className="text-white/70 text-xs">1080p • Night Vision</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: <Lock />, text: "End-to-end encrypted storage" },
                  { icon: <Eye />, text: "Privacy-protected, incident-only access" },
                  { icon: <Shield />, text: "30-day cloud backup retention" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Voice Command */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 bg-gradient-to-br from-[#6A0DAD]/5 to-[#FF4FA3]/5">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="text-white" size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Voice Command Emergency</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Activate emergency protocols hands-free with voice commands
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    { command: "SheRide Emergency", action: "Activates full SOS protocol" },
                    { command: "SheRide Help", action: "Connects to support team" },
                    { command: "SheRide Share Location", action: "Shares live location to contacts" }
                  ].map((cmd, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border-2 border-purple-200">
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full text-sm font-semibold mb-3">
                        "{cmd.command}"
                      </div>
                      <p className="text-sm text-gray-600">{cmd.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
