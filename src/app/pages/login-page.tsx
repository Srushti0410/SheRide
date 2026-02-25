import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Users, Car, Settings, ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<"passenger" | "driver" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const roleOptions = [
    {
      id: "passenger",
      title: "Passenger",
      description: "Book rides, track drivers, and stay safe",
      icon: Users,
      benefits: ["Book rides", "Track driver", "View ride history", "SOS & safety features"],
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      id: "driver",
      title: "Driver",
      description: "Earn, grow, and access financial opportunities",
      icon: Car,
      benefits: ["Accept rides", "Earnings dashboard", "Micro-loans", "Insurance access"],
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage the platform and monitor performance",
      icon: Settings,
      benefits: ["Manage users", "Approve loans", "Safety reports", "View analytics"],
      gradient: "from-violet-500 to-blue-500",
      bgGradient: "from-violet-50 to-blue-50",
    },
  ];

  const handleRoleSelect = (role: "passenger" | "driver" | "admin") => {
    setSelectedRole(role);
    setStep("credentials");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email || !password || !name) return;

    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: selectedRole as "passenger" | "driver" | "admin",
    };

    login(user);

    // Redirect based on role
    const dashboardPaths = {
      passenger: "/passenger",
      driver: "/driver",
      admin: "/admin",
    };

    navigate(dashboardPaths[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-pink-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              SheRide
            </h1>
          </div>
          <p className="text-lg text-gray-300">Financial Inclusion & Safe Mobility for Women</p>
        </motion.div>

        {/* Main Content */}
        <div className="w-full max-w-6xl">
          {step === "role" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                Choose Your Role
              </h2>
              <p className="text-gray-400 text-center mb-12">
                Select the role that best describes you
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {roleOptions.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => handleRoleSelect(role.id as "passenger" | "driver" | "admin")}
                    className={`group cursor-pointer relative p-6 rounded-2xl transition-all duration-300 border-2 hover:border-transparent ${selectedRole === role.id
                        ? `border-transparent bg-gradient-to-br ${role.bgGradient}`
                        : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                      }`}
                  >
                    {/* Gradient background on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity bg-gradient-to-br ${role.bgGradient}`}
                    ></div>

                    <div className="relative z-10">
                      <div className={`mb-4 p-3 rounded-lg w-fit bg-gradient-to-br ${role.gradient} bg-opacity-20`}>
                        <role.icon className={`w-8 h-8 text-white`} />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">{role.description}</p>

                      <div className="space-y-2">
                        {role.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`}></div>
                            {benefit}
                          </div>
                        ))}
                      </div>

                      <button
                        className={`mt-6 w-full py-2 rounded-lg font-semibold transition-all bg-gradient-to-r ${role.gradient} text-white hover:shadow-lg hover:shadow-pink-500/50`}
                      >
                        Continue as {role.title}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep("role")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ←
                  </button>
                  <h2 className="text-2xl font-bold text-white">Join as {selectedRole && selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Create Account & Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                  Already have an account?{" "}
                  <button className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
