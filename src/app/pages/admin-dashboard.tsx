import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  TrendingUp,
  AlertOctagon,
  DollarSign,
  Shield,
  Activity,
  Car,
  Award,
  Download,
  Filter,
  ChevronRight,
  Building,
  LogOut,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mock Data
  const rideActivityData = [
    { month: "Aug", rides: 4200, drivers: 180 },
    { month: "Sep", rides: 5800, drivers: 220 },
    { month: "Oct", rides: 7200, drivers: 280 },
    { month: "Nov", rides: 9100, drivers: 340 },
    { month: "Dec", rides: 11500, drivers: 420 },
    { month: "Jan", rides: 14200, drivers: 510 },
    { month: "Feb", rides: 18500, drivers: 630 },
  ];

  const revenueData = [
    { month: "Aug", revenue: 420000, expenses: 180000 },
    { month: "Sep", revenue: 580000, expenses: 220000 },
    { month: "Oct", revenue: 720000, expenses: 280000 },
    { month: "Nov", revenue: 910000, expenses: 340000 },
    { month: "Dec", revenue: 1150000, expenses: 420000 },
    { month: "Jan", revenue: 1420000, expenses: 510000 },
    { month: "Feb", revenue: 1850000, expenses: 630000 },
  ];

  const driverOnboardingData = [
    { week: "Week 1", approved: 45, pending: 20, rejected: 5 },
    { week: "Week 2", approved: 52, pending: 18, rejected: 8 },
    { week: "Week 3", approved: 68, pending: 15, rejected: 4 },
    { week: "Week 4", approved: 71, pending: 22, rejected: 6 },
  ];

  const [pendingLoans] = useState([
    {
      id: 1,
      driver: "Priya Singh",
      amount: "₹50,000",
      status: "pending",
      date: "Feb 24, 2026",
    },
    {
      id: 2,
      driver: "Anjali Kumar",
      amount: "₹75,000",
      status: "pending",
      date: "Feb 23, 2026",
    },
    {
      id: 3,
      driver: "Neha Patel",
      amount: "₹45,000",
      status: "approved",
      date: "Feb 22, 2026",
    },
  ]);

  const [safetyReports] = useState([
    {
      id: 1,
      type: "SOS Alert",
      location: "Downtown Market",
      resolved: true,
      date: "Feb 24, 2026",
    },
    {
      id: 2,
      type: "Route Deviation",
      location: "Tech Park Area",
      resolved: false,
      date: "Feb 24, 2026",
    },
    {
      id: 3,
      type: "Emergency",
      location: "Hospital District",
      resolved: true,
      date: "Feb 23, 2026",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-xs text-gray-500">Admin Account</p>
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
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Platform Analytics
            </h2>
            <p className="text-gray-600">Real-time insights and complete platform control</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 rounded-lg">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 rounded-lg">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: "Total Rides",
              value: "18,542",
              change: "+23.5%",
              icon: Car,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Active Drivers",
              value: "630",
              change: "+18.2%",
              icon: Users,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "Monthly Revenue",
              value: "₹18.5L",
              change: "+30.2%",
              icon: DollarSign,
              gradient: "from-green-500 to-green-600",
            },
            {
              label: "Safety Score",
              value: "99.8%",
              change: "+0.3%",
              icon: Shield,
              gradient: "from-pink-500 to-pink-600",
            },
          ].map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${kpi.gradient} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {kpi.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </div>
                  <div className="text-sm text-gray-600">{kpi.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Ride Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Ride Activity Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={rideActivityData}>
                  <defs>
                    <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="rides"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorRides)"
                  />
                  <Area
                    type="monotone"
                    dataKey="drivers"
                    stroke="#EC4899"
                    fillOpacity={1}
                    fill="url(#colorDrivers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-600" />
                Revenue vs Expenses
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Manage Drivers & Passengers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                User Management
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Passengers</p>
                  <p className="text-2xl font-bold text-blue-900">12,450</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Drivers</p>
                  <p className="text-2xl font-bold text-purple-900">630</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending Verification</p>
                  <p className="text-2xl font-bold text-pink-900">42</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full justify-between rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Manage Passengers <ChevronRight className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  Manage Drivers <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-lg"
                >
                  Review Applications <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Safety Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                Safety Reports
              </h2>

              <div className="space-y-3 mb-6">
                {safetyReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{report.type}</p>
                        <p className="text-sm text-gray-600">{report.location}</p>
                      </div>
                      {report.resolved ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertOctagon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                ))}
              </div>

              <Button
                className="w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white justify-between"
              >
                View All Safety Reports <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Loan Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Loan Application Management
            </h2>

            <div className="grid gap-4">
              {pendingLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-gray-900">{loan.driver}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">Amount: {loan.amount}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${loan.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{loan.date}</p>
                  </div>
                  {loan.status === "pending" && (
                    <div className="flex gap-2">
                      <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="px-4 py-2 rounded-lg"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Driver Onboarding & Policy Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Driver Onboarding Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={driverOnboardingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="rejected" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Government Integration & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Government Integration & Policy Compliance
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Ministry of Women & Child Development", status: "Connected", lastSync: "2 hours ago" },
                { name: "National Commission for Women", status: "Connected", lastSync: "1 day ago" },
                { name: "State Transport Authority", status: "Connected", lastSync: "30 mins ago" },
              ].map((integration, i) => (
                <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-gray-900 mb-2">{integration.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-semibold">
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Last synced: {integration.lastSync}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Reports Submitted", value: "142" },
                { label: "Compliance Score", value: "98.5%" },
                { label: "Policy Updates", value: "5 pending" },
                { label: "Data Requests", value: "12 active" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 bg-purple-50 rounded-lg text-center border border-purple-200"
                >
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
