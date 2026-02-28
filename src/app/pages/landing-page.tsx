import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { GlassCard } from "../components/glass-card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import {
  Shield, Users, AlertCircle, DollarSign,
  CheckCircle, ArrowRight, Target, TrendingUp,
  Globe, Heart, Zap, Award
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function LandingPage() {
  const [counts, setCounts] = useState({ rides: 0, drivers: 0, cities: 0, safety: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const trailIdRef = { current: 0 };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });

      // Create trail effect
      trailIdRef.current += 1;
      const newPoint = { x: event.clientX, y: event.clientY, id: trailIdRef.current };
      setTrail((prev) => [...prev, newPoint].slice(-20)); // Keep last 20 points
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const targets = { rides: 500000, drivers: 25000, cities: 50, safety: 99 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        rides: Math.floor((targets.rides * step) / steps),
        drivers: Math.floor((targets.drivers * step) / steps),
        cities: Math.floor((targets.cities * step) / steps),
        safety: Math.floor((targets.safety * step) / steps),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-990 to-black relative overflow-hidden">
      {/* Cursor Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none w-3 h-3 rounded-full"
          style={{
            top: point.y - 6,
            left: point.x - 6,
            background: `rgba(168, 85, 247, ${(index / trail.length) * 0.6})`,
            boxShadow: `0 0 ${10 + (index / trail.length) * 20}px rgba(236, 72, 153, ${(index / trail.length) * 0.4})`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}

      {/* Mouse Following Glow */}
      <motion.div
        className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl"
        style={{
          top: mousePosition.y - 192,
          left: mousePosition.x - 192,
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 100%)",
          boxShadow: "0 0 60px rgba(168, 85, 247, 0.15), 0 0 100px rgba(236, 72, 153, 0.1)",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 150,
          mass: 0.3,
        }}
      />

      {/* Secondary Glow Circle */}
      <motion.div
        className="fixed pointer-events-none w-60 h-60 rounded-full blur-2xl"
        style={{
          top: mousePosition.y - 120,
          left: mousePosition.x - 120,
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.04) 0%, transparent 70%)",
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 100,
          mass: 0.5,
        }}
      />

      {/* Animated Floating Shapes */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className="fixed top-20 right-40 w-72 h-72 rounded-full bg-gradient-to-br from-purple-600/5 to-pink-600/5 blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
          repeatType: "loop",
        }}
        className="fixed top-1/2 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5 blur-3xl pointer-events-none"
      />

      {/* Animated Gradient Shift */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(45deg, #6A0DAD 0%, #FF4FA3 50%, #6A0DAD 100%)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0.05, 0.3, 0.05],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
              repeatType: "loop",
            }}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(0.5px)",
              boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(236, 72, 153, 0.25)`,
            }}
          />
        ))}
      </div>

      {/* Animated Geometric Shapes */}
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, 30, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className="fixed top-1/4 right-1/4 w-48 h-48 pointer-events-none opacity-5"
        style={{
          background: "linear-gradient(135deg, #6A0DAD 0%, #FF4FA3 100%)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />

      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
          repeatType: "loop",
        }}
        className="fixed bottom-1/4 left-1/4 w-40 h-40 pointer-events-none opacity-5"
        style={{
          background: "linear-gradient(45deg, #FF4FA3 0%, #6A0DAD 100%)",
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        }}
      />
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
            repeatType: "loop",
          }}
          className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* AI Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #6A0DAD 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, #FF4FA3 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Car Section */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Car - Moving from left to right */}
        <motion.div
          animate={{
            x: ["-100%", "120%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          className="absolute top-1/3 -left-20 flex items-center"
        >
          <svg width="100" height="60" viewBox="0 0 100 60" className="opacity-20 hover:opacity-40 transition-opacity">
            {/* Car Body */}
            <rect x="10" y="30" width="70" height="20" rx="2" fill="url(#carGradient)" />
            {/* Car Top */}
            <rect x="20" y="15" width="50" height="15" rx="3" fill="url(#carGradient)" />
            {/* Windows */}
            <rect x="25" y="18" width="12" height="10" rx="1" fill="rgba(168, 85, 247, 0.3)" />
            <rect x="40" y="18" width="12" height="10" rx="1" fill="rgba(168, 85, 247, 0.3)" />
            {/* Front Light */}
            <circle cx="78" cy="38" r="3" fill="#FFD700" opacity="0.8" />
            {/* Wheels */}
            <g>
              <motion.circle
                cx="25"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="65"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </g>
            <defs>
              <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6A0DAD" />
                <stop offset="100%" stopColor="#FF4FA3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Second Car - Same direction, staggered */}
        <motion.div
          animate={{
            x: ["-100%", "120%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
            delay: 4,
          }}
          className="absolute top-1/3 -left-20 flex items-center"
        >
          <svg width="100" height="60" viewBox="0 0 100 60" className="opacity-25 hover:opacity-45 transition-opacity">
            {/* Car Body */}
            <rect x="10" y="30" width="70" height="20" rx="2" fill="url(#carGradient3)" />
            {/* Car Top */}
            <rect x="20" y="15" width="50" height="15" rx="3" fill="url(#carGradient3)" />
            {/* Windows */}
            <rect x="25" y="18" width="12" height="10" rx="1" fill="rgba(168, 85, 247, 0.3)" />
            <rect x="40" y="18" width="12" height="10" rx="1" fill="rgba(168, 85, 247, 0.3)" />
            {/* Front Light */}
            <circle cx="78" cy="38" r="3" fill="#FFD700" opacity="0.8" />
            {/* Wheels */}
            <g>
              <motion.circle
                cx="25"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="65"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </g>
            <defs>
              <linearGradient id="carGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4FA3" />
                <stop offset="100%" stopColor="#6A0DAD" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Bottom Car - Moving from right to left */}
        <motion.div
          animate={{
            x: ["120%", "-100%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-0 flex items-center scale-x-[-1]"
        >
          <svg width="100" height="60" viewBox="0 0 100 60" className="opacity-15 hover:opacity-35 transition-opacity">
            {/* Car Body */}
            <rect x="10" y="30" width="70" height="20" rx="2" fill="url(#carGradient2)" />
            {/* Car Top */}
            <rect x="20" y="15" width="50" height="15" rx="3" fill="url(#carGradient2)" />
            {/* Windows */}
            <rect x="25" y="18" width="12" height="10" rx="1" fill="rgba(236, 72, 153, 0.3)" />
            <rect x="40" y="18" width="12" height="10" rx="1" fill="rgba(236, 72, 153, 0.3)" />
            {/* Front Light */}
            <circle cx="78" cy="38" r="3" fill="#FFD700" opacity="0.8" />
            {/* Wheels */}
            <g>
              <motion.circle
                cx="25"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="65"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </g>
            <defs>
              <linearGradient id="carGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4FA3" />
                <stop offset="100%" stopColor="#6A0DAD" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Second Bottom Car - Moving from right to left, staggered */}
        <motion.div
          animate={{
            x: ["120%", "-100%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
            delay: 6,
          }}
          className="absolute bottom-1/4 right-0 flex items-center scale-x-[-1]"
        >
          <svg width="100" height="60" viewBox="0 0 100 60" className="opacity-20 hover:opacity-40 transition-opacity">
            {/* Car Body */}
            <rect x="10" y="30" width="70" height="20" rx="2" fill="url(#carGradient4)" />
            {/* Car Top */}
            <rect x="20" y="15" width="50" height="15" rx="3" fill="url(#carGradient4)" />
            {/* Windows */}
            <rect x="25" y="18" width="12" height="10" rx="1" fill="rgba(236, 72, 153, 0.3)" />
            <rect x="40" y="18" width="12" height="10" rx="1" fill="rgba(236, 72, 153, 0.3)" />
            {/* Front Light */}
            <circle cx="78" cy="38" r="3" fill="#FFD700" opacity="0.8" />
            {/* Wheels */}
            <g>
              <motion.circle
                cx="25"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="65"
                cy="52"
                r="6"
                fill="rgba(100, 100, 100, 0.6)"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </g>
            <defs>
              <linearGradient id="carGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6A0DAD" />
                <stop offset="100%" stopColor="#FF4FA3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4">
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 rounded-full text-sm font-semibold backdrop-blur-sm inline-flex items-center space-x-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                  <span>Series-A Funded • Backed by Top VCs</span>
                </motion.span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-block bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent"
                >
                  Safe Mobility.
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="inline-block bg-gradient-to-r from-[#FF4FA3] to-[#6A0DAD] bg-clip-text text-transparent"
                >
                  Financial Freedom.
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-black"
                >
                  Powered by Women 
                </motion.span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Join India's first women-only ride-hailing platform. Verified female passengers.
                Verified female drivers. AI-powered safety. Microfinance inclusion.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/60 transition-all inline-flex items-center justify-center group text-lg relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-[#FF4FA3] to-[#6A0DAD] rounded-full"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center">
                    Get Started
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2" size={20} />
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1575997759025-5cb986a6041d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRyaXZlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzcxOTI2NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional woman driver"
                  className="rounded-3xl shadow-2xl w-full"
                />
                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute -bottom-6 -left-6 backdrop-blur-xl bg-slate-800/70 rounded-2xl p-4 shadow-2xl border border-slate-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-xl flex items-center justify-center"
                    >
                      <Shield className="text-white" size={24} />
                    </motion.div>
                    <div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
                      >
                        99.9%
                      </motion.div>
                      <div className="text-sm text-gray-400">Safety Score</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#6A0DAD]/20 to-[#FF4FA3]/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#FF4FA3]/20 to-[#6A0DAD]/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              Why Choose SheRide?
            </h2>
            <p className="text-xl text-gray-300">Built for women's safety, empowerment, and financial independence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="text-white" size={32} />,
                title: "Women-Only Network",
                description: "100% verified female passengers and drivers",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: <AlertCircle className="text-white" size={32} />,
                title: "AI Safety Alerts",
                description: "Real-time route monitoring and SOS system",
                gradient: "from-pink-500 to-pink-600"
              },
              {
                icon: <Shield className="text-white" size={32} />,
                title: "24/7 SOS Support",
                description: "Instant emergency response and geo-fencing",
                gradient: "from-purple-600 to-purple-700"
              },
              {
                icon: <DollarSign className="text-white" size={32} />,
                title: "Micro-loans",
                description: "Financial inclusion and credit access",
                gradient: "from-pink-600 to-pink-700"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <GlassCard hover className="p-6 h-full group">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all`}
                  >
                    <motion.div whileHover={{ scale: 1.2 }}>
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">Simple, safe, and seamless</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#6A0DAD] via-[#FF4FA3] to-[#6A0DAD] transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Sign Up & Verify",
                  description: "Quick registration with Aadhaar verification for safety",
                  icon: <CheckCircle className="text-white" size={28} />
                },
                {
                  step: "02",
                  title: "Book Your Ride",
                  description: "Choose cab or bike, track in real-time with AI safety",
                  icon: <Zap className="text-white" size={28} />
                },
                {
                  step: "03",
                  title: "Ride & Earn",
                  description: "Safe travel for passengers, financial freedom for drivers",
                  icon: <Award className="text-white" size={28} />
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.25, duration: 0.7 }}
                  whileHover={{ y: -15 }}
                  className="relative"
                >
                  <GlassCard className="p-8 text-center relative h-full">
                    {/* Step Number Circle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                        {step.icon}
                      </div>
                    </motion.div>
                    <div className="mt-12">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
                      >
                        {step.step}
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              Our Impact
            </h2>
            <p className="text-xl text-gray-300">Empowering women across India</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Rides", value: counts.rides.toLocaleString() + "+", icon: <Target /> },
              { label: "Women Drivers", value: counts.drivers.toLocaleString() + "+", icon: <Users /> },
              { label: "Cities", value: counts.cities + "+", icon: <Globe /> },
              { label: "Safety Rating", value: counts.safety + "%", icon: <Shield /> }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.08 }}
              >
                <GlassCard className="p-8 text-center group">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity },
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                    }}
                    className="w-14 h-14 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all"
                  >
                    {metric.icon}
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-gray-300">{metric.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              UN SDG Alignment
            </h2>
            <p className="text-xl text-gray-300">Contributing to global sustainability goals</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                sdg: "SDG 5",
                title: "Gender Equality",
                description: "Empowering women through economic participation and safe mobility"
              },
              {
                sdg: "SDG 8",
                title: "Decent Work",
                description: "Creating sustainable livelihoods for women drivers"
              },
              {
                sdg: "SDG 10",
                title: "Reduced Inequalities",
                description: "Financial inclusion through micro-loans and insurance"
              }
            ].map((sdg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Heart className="text-white" size={28} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#FF4FA3] mb-1">{sdg.sdg}</div>
                      <h3 className="text-xl font-bold mb-2 text-white">{sdg.title}</h3>
                      <p className="text-gray-300 text-sm">{sdg.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12 text-center bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4FA3]/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                Ready to Join the Revolution?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Be part of India's safest and most empowering ride-hailing platform
              </p>
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/40 transition-all inline-flex items-center justify-center text-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
