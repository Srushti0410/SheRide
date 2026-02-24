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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 relative overflow-hidden">
      {/* AI Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #6A0DAD 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, #FF4FA3 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
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
                <span className="px-4 py-2 bg-gradient-to-r from-[#E6D5F7] to-[#FFE5F4] text-[#6A0DAD] rounded-full text-sm font-semibold">
                  🚀 Series-A Funded • Backed by Top VCs
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                  Safe Mobility.
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#FF4FA3] to-[#6A0DAD] bg-clip-text text-transparent">
                  Financial Freedom.
                </span>
                <br />
                <span className="text-gray-800">
                  Powered by Women.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join India's first women-only ride-hailing platform. Verified female passengers. 
                Verified female drivers. AI-powered safety. Microfinance inclusion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/passenger"
                  className="px-8 py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all inline-flex items-center justify-center group"
                >
                  Book a Ride
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/driver"
                  className="px-8 py-4 bg-white text-[#6A0DAD] rounded-full font-semibold border-2 border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white transition-all inline-flex items-center justify-center"
                >
                  Become a Driver
                </Link>
              </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 backdrop-blur-xl bg-white/90 rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-xl flex items-center justify-center">
                      <Shield className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#6A0DAD]">99.9%</div>
                      <div className="text-sm text-gray-600">Safety Score</div>
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
            <p className="text-xl text-gray-600">Built for women's safety, empowerment, and financial independence</p>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-6 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E6D5F7]/30 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple, safe, and seamless</p>
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <GlassCard className="p-8 text-center relative">
                    {/* Step Number Circle */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-full flex items-center justify-center shadow-lg">
                        {step.icon}
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="text-5xl font-bold text-[#E6D5F7] mb-3">{step.step}</div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
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
            <p className="text-xl text-gray-600">Empowering women across India</p>
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
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                    {metric.icon}
                  </div>
                  <div className="text-4xl font-bold text-[#6A0DAD] mb-2">{metric.value}</div>
                  <div className="text-gray-600">{metric.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E6D5F7]/30 to-pink-50/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              UN SDG Alignment
            </h2>
            <p className="text-xl text-gray-600">Contributing to global sustainability goals</p>
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
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{sdg.title}</h3>
                      <p className="text-gray-600 text-sm">{sdg.description}</p>
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
          <GlassCard className="p-12 text-center bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4FA3]/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                Ready to Join the Revolution?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Be part of India's safest and most empowering ride-hailing platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/passenger"
                  className="px-8 py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all inline-flex items-center justify-center"
                >
                  Start Riding Now
                </Link>
                <Link
                  to="/driver"
                  className="px-8 py-4 bg-white text-[#6A0DAD] rounded-full font-semibold border-2 border-[#6A0DAD] hover:bg-[#6A0DAD] hover:text-white transition-all inline-flex items-center justify-center"
                >
                  Drive & Earn
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
