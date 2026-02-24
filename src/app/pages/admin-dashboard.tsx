import { Header } from "../components/header";
import { GlassCard } from "../components/glass-card";
import { motion } from "motion/react";
import { 
  Users, TrendingUp, AlertOctagon, MapPin, 
  DollarSign, Shield, Activity, Car, Award,
  Calendar, Download, Filter, ChevronRight, Building
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  // Mock Data
  const rideActivityData = [
    { month: "Aug", rides: 4200, drivers: 180 },
    { month: "Sep", rides: 5800, drivers: 220 },
    { month: "Oct", rides: 7200, drivers: 280 },
    { month: "Nov", rides: 9100, drivers: 340 },
    { month: "Dec", rides: 11500, drivers: 420 },
    { month: "Jan", rides: 14200, drivers: 510 },
    { month: "Feb", rides: 18500, drivers: 630 }
  ];

  const sosIncidentsData = [
    { category: "False Alarm", count: 45, color: "#6A0DAD" },
    { category: "Route Deviation", count: 12, color: "#FF4FA3" },
    { category: "Speed Alert", count: 8, color: "#FFA500" },
    { category: "Zone Alert", count: 5, color: "#FF6B6B" },
    { category: "Emergency", count: 2, color: "#FF0000" }
  ];

  const driverOnboardingData = [
    { week: "Week 1", approved: 45, pending: 20, rejected: 5 },
    { week: "Week 2", approved: 52, pending: 18, rejected: 8 },
    { week: "Week 3", approved: 68, pending: 15, rejected: 4 },
    { week: "Week 4", approved: 71, pending: 22, rejected: 6 }
  ];

  const revenueData = [
    { month: "Aug", revenue: 420000, expenses: 180000 },
    { month: "Sep", revenue: 580000, expenses: 220000 },
    { month: "Oct", revenue: 720000, expenses: 280000 },
    { month: "Nov", revenue: 910000, expenses: 340000 },
    { month: "Dec", revenue: 1150000, expenses: 420000 },
    { month: "Jan", revenue: 1420000, expenses: 510000 },
    { month: "Feb", revenue: 1850000, expenses: 630000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                Admin Analytics
              </h1>
              <p className="text-gray-600">Real-time insights and platform metrics</p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors flex items-center space-x-2">
                <Filter size={18} className="text-[#6A0DAD]" />
                <span className="text-gray-700">Filter</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { 
                label: "Total Rides", 
                value: "18,542", 
                change: "+23.5%",
                icon: <Car className="text-white" size={24} />,
                gradient: "from-blue-500 to-blue-600",
                isPositive: true
              },
              { 
                label: "Active Drivers", 
                value: "630", 
                change: "+18.2%",
                icon: <Users className="text-white" size={24} />,
                gradient: "from-purple-500 to-purple-600",
                isPositive: true
              },
              { 
                label: "Monthly Revenue", 
                value: "₹18.5L", 
                change: "+30.2%",
                icon: <DollarSign className="text-white" size={24} />,
                gradient: "from-green-500 to-green-600",
                isPositive: true
              },
              { 
                label: "Safety Score", 
                value: "99.8%", 
                change: "+0.3%",
                icon: <Shield className="text-white" size={24} />,
                gradient: "from-pink-500 to-pink-600",
                isPositive: true
              }
            ].map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center`}>
                      {kpi.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      kpi.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{kpi.value}</div>
                  <div className="text-sm text-gray-600">{kpi.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Ride Activity Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Ride Activity</h2>
                  <Activity className="text-[#6A0DAD]" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={rideActivityData}>
                    <defs>
                      <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6A0DAD" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6A0DAD" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4FA3" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF4FA3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6D5F7" />
                    <XAxis dataKey="month" stroke="#6A0DAD" />
                    <YAxis stroke="#6A0DAD" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="rides" stroke="#6A0DAD" fillOpacity={1} fill="url(#colorRides)" />
                    <Area type="monotone" dataKey="drivers" stroke="#FF4FA3" fillOpacity={1} fill="url(#colorDrivers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Revenue vs Expenses</h2>
                  <TrendingUp className="text-[#FF4FA3]" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6D5F7" />
                    <XAxis dataKey="month" stroke="#6A0DAD" />
                    <YAxis stroke="#6A0DAD" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#6A0DAD" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expenses" fill="#FF4FA3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* SOS Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">SOS Incidents</h2>
                  <AlertOctagon className="text-red-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sosIncidentsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {sosIncidentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {sosIncidentsData.map((incident, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: incident.color }}></div>
                        <span className="text-sm text-gray-700">{incident.category}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{incident.count}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Driver Onboarding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Driver Onboarding Stats</h2>
                  <Award className="text-[#6A0DAD]" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={driverOnboardingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6D5F7" />
                    <XAxis dataKey="week" stroke="#6A0DAD" />
                    <YAxis stroke="#6A0DAD" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" stackId="a" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="rejected" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>
          </div>

          {/* Heatmap of Unsafe Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Unsafe Zone Heatmap</h2>
                  <p className="text-gray-600">AI-identified high-risk areas based on incident data</p>
                </div>
                <MapPin className="text-red-500" size={32} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-br from-red-50 via-orange-50 to-green-50 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
                    {/* Mock Heatmap Overlay */}
                    <div className="absolute inset-0">
                      <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/40 rounded-full blur-3xl"></div>
                      <div className="absolute top-40 right-32 w-24 h-24 bg-orange-400/30 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-28 left-40 w-20 h-20 bg-red-600/50 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-300/25 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">Interactive Map View</p>
                      <p className="text-sm text-gray-500">Heat intensity represents incident frequency</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-3 text-gray-800">Zone Categories</h3>
                    <div className="space-y-2">
                      {[
                        { level: "Critical", count: 3, color: "bg-red-500" },
                        { level: "High Risk", count: 9, color: "bg-orange-500" },
                        { level: "Moderate", count: 18, color: "bg-yellow-400" },
                        { level: "Safe", count: 170, color: "bg-green-500" }
                      ].map((zone, i) => (
                        <div key={i} className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 ${zone.color} rounded-full`}></div>
                              <span className="text-sm font-semibold text-gray-700">{zone.level}</span>
                            </div>
                            <span className="text-lg font-bold text-gray-800">{zone.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4FA3]/10 rounded-xl">
                    <h4 className="font-bold text-sm mb-2 text-gray-800">AI Insights</h4>
                    <p className="text-xs text-gray-600 mb-2">3 new zones flagged this week</p>
                    <button className="w-full py-2 bg-white border border-purple-200 rounded-lg text-sm font-semibold text-[#6A0DAD] hover:bg-purple-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Government Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Government Integration Panel</h2>
                  <p className="text-gray-600">Policy compliance and regulatory reporting</p>
                </div>
                <Building className="text-[#6A0DAD]" size={32} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Ministry of Women & Child Development",
                    status: "Connected",
                    lastSync: "2 hours ago",
                    color: "green"
                  },
                  {
                    title: "National Commission for Women",
                    status: "Connected",
                    lastSync: "1 day ago",
                    color: "green"
                  },
                  {
                    title: "State Transport Authority",
                    status: "Connected",
                    lastSync: "30 mins ago",
                    color: "green"
                  }
                ].map((integration, i) => (
                  <GlassCard key={i} hover className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Building className="text-[#6A0DAD]" size={24} />
                      <span className={`px-2 py-1 bg-${integration.color}-100 text-${integration.color}-700 rounded-full text-xs font-semibold`}>
                        {integration.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{integration.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Last synced: {integration.lastSync}</p>
                    <button className="w-full py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-semibold text-[#6A0DAD] transition-colors flex items-center justify-center space-x-2">
                      <span>View Reports</span>
                      <ChevronRight size={16} />
                    </button>
                  </GlassCard>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Reports Submitted", value: "142" },
                  { label: "Compliance Score", value: "98.5%" },
                  { label: "Policy Updates", value: "5 pending" },
                  { label: "Data Requests", value: "12 active" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-purple-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#6A0DAD] mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
