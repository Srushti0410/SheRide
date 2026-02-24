import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { GlassCard } from "../components/glass-card";
import { motion } from "motion/react";
import { 
  DollarSign, TrendingUp, Shield, CreditCard, 
  Smartphone, Award, CheckCircle, ArrowRight,
  PiggyBank, Percent, Lock, Users, Building, ChevronRight
} from "lucide-react";
import { useState } from "react";

export function FinancialPage() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [creditScore, setCreditScore] = useState(720);

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
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                💰 Financial Empowerment for Women
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
              Financial Inclusion Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access micro-loans, insurance, and financial services designed specifically for women drivers
            </p>
          </motion.div>

          {/* Micro-loan Application */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Apply for Micro-loan</h2>
                  <p className="text-gray-600 mb-6">
                    Get quick access to loans for vehicle purchase, maintenance, or personal needs with minimal paperwork
                  </p>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-semibold text-gray-700">Loan Amount</label>
                        <span className="text-2xl font-bold text-[#6A0DAD]">
                          ₹{loanAmount.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="100000"
                        step="5000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-[#6A0DAD]"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹10,000</span>
                        <span>₹1,00,000</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                        <p className="text-2xl font-bold text-[#6A0DAD]">8.5%</p>
                        <p className="text-xs text-gray-500">Per annum</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Tenure</p>
                        <p className="text-2xl font-bold text-[#FF4FA3]">12 months</p>
                        <p className="text-xs text-gray-500">Flexible terms</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF4FA3]/10 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Monthly EMI</span>
                        <span className="text-2xl font-bold text-gray-800">
                          ₹{Math.round(loanAmount * 0.0875).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Based on selected amount and tenure</p>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2">
                      <span>Apply Now</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Eligibility Criteria</h3>
                    <div className="space-y-3">
                      {[
                        "Minimum 3 months on SheRide platform",
                        "At least 50 completed rides",
                        "Average rating of 4.0 or above",
                        "Valid Aadhaar and PAN card",
                        "Active bank account"
                      ].map((criteria, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-gray-700">{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Loan Benefits</h3>
                    <div className="space-y-3">
                      {[
                        { icon: <Percent className="text-[#6A0DAD]" />, text: "Lowest interest rates in market" },
                        { icon: <CheckCircle className="text-green-600" />, text: "No hidden charges or fees" },
                        { icon: <Award className="text-[#FF4FA3]" />, text: "Quick approval in 24 hours" },
                        { icon: <Lock className="text-blue-600" />, text: "Secure and confidential process" }
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            {benefit.icon}
                          </div>
                          <span className="text-gray-700 text-sm">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Insurance Partnership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Insurance Coverage</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Health Insurance",
                    premium: "₹3,500",
                    coverage: "₹5,00,000",
                    features: [
                      "Cashless hospitalization",
                      "Pre & post hospitalization",
                      "Maternity coverage",
                      "Annual health checkup"
                    ],
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    title: "Vehicle Insurance",
                    premium: "₹8,500",
                    coverage: "₹10,00,000",
                    features: [
                      "Comprehensive coverage",
                      "Zero depreciation",
                      "24/7 roadside assistance",
                      "Personal accident cover"
                    ],
                    gradient: "from-purple-500 to-purple-600"
                  },
                  {
                    title: "Life Insurance",
                    premium: "₹5,000",
                    coverage: "₹25,00,000",
                    features: [
                      "Term life coverage",
                      "Critical illness rider",
                      "Income protection",
                      "Nominee support"
                    ],
                    gradient: "from-pink-500 to-pink-600"
                  }
                ].map((insurance, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard hover className="p-6 h-full flex flex-col">
                      <div className={`w-16 h-16 bg-gradient-to-br ${insurance.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                        <Shield className="text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{insurance.title}</h3>
                      
                      <div className="mb-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-[#6A0DAD]">{insurance.premium}</span>
                          <span className="text-sm text-gray-500">/year</span>
                        </div>
                        <p className="text-sm text-gray-600">Coverage: {insurance.coverage}</p>
                      </div>

                      <div className="flex-1 space-y-2 mb-4">
                        {insurance.features.map((feature, i) => (
                          <div key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        Get Insured
                      </button>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* UPI Payment Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Digital Payment Solutions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl p-8 text-white mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-purple-100 text-sm mb-1">SheRide Wallet</p>
                        <p className="text-3xl font-bold">₹12,450.00</p>
                      </div>
                      <Smartphone size={40} className="text-white/80" />
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-purple-100 text-sm">UPI ID</p>
                      <p className="font-mono text-lg">sheride@paytm</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors">
                        Add Money
                      </button>
                      <button className="py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors">
                        Withdraw
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Features</h3>
                    {[
                      { icon: <Smartphone className="text-[#6A0DAD]" />, text: "Instant UPI payments" },
                      { icon: <Lock className="text-green-600" />, text: "Secure encrypted transactions" },
                      { icon: <TrendingUp className="text-[#FF4FA3]" />, text: "Real-time earnings tracking" },
                      { icon: <Award className="text-blue-600" />, text: "Zero transaction fees" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-purple-200">
                          {feature.icon}
                        </div>
                        <span className="font-semibold text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { type: "Ride Earning", amount: "+₹180", time: "2 hours ago", status: "completed" },
                      { type: "Ride Earning", amount: "+₹95", time: "4 hours ago", status: "completed" },
                      { type: "Withdrawal", amount: "-₹5,000", time: "Yesterday", status: "processed" },
                      { type: "Ride Earning", amount: "+₹220", time: "2 days ago", status: "completed" },
                      { type: "Bonus", amount: "+₹500", time: "3 days ago", status: "completed" }
                    ].map((transaction, i) => (
                      <div key={i} className="p-4 bg-white border border-purple-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800">{transaction.type}</span>
                          <span className={`text-lg font-bold ${
                            transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {transaction.amount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{transaction.time}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Credit Score Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Credit Score Builder</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="relative">
                    <div className="w-64 h-64 mx-auto relative">
                      <svg className="transform -rotate-90 w-64 h-64">
                        <circle
                          cx="128"
                          cy="128"
                          r="120"
                          stroke="#E6D5F7"
                          strokeWidth="16"
                          fill="none"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="120"
                          stroke="url(#gradient)"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${(creditScore / 900) * 753} 753`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6A0DAD" />
                            <stop offset="100%" stopColor="#FF4FA3" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#FF4FA3] bg-clip-text text-transparent">
                          {creditScore}
                        </div>
                        <div className="text-gray-600 font-semibold mt-2">Credit Score</div>
                        <div className="text-sm text-green-600 font-semibold mt-1">Excellent</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                    <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-6 text-gray-800">How to Improve Your Score</h3>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Complete more rides",
                        description: "Regular activity shows financial stability",
                        impact: "+15 points",
                        color: "bg-blue-100 text-blue-700"
                      },
                      { 
                        title: "Maintain high ratings",
                        description: "4.5+ rating demonstrates reliability",
                        impact: "+20 points",
                        color: "bg-purple-100 text-purple-700"
                      },
                      { 
                        title: "Timely loan repayments",
                        description: "On-time EMI payments build trust",
                        impact: "+30 points",
                        color: "bg-green-100 text-green-700"
                      },
                      { 
                        title: "Diversify income streams",
                        description: "Multiple revenue sources reduce risk",
                        impact: "+25 points",
                        color: "bg-pink-100 text-pink-700"
                      }
                    ].map((tip, i) => (
                      <div key={i} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{tip.title}</h4>
                          <span className={`px-2 py-1 ${tip.color} rounded-full text-xs font-semibold`}>
                            {tip.impact}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Partnership Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 bg-gradient-to-br from-[#6A0DAD]/5 to-[#FF4FA3]/5">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Trusted Financial Partners
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "HDFC Bank", icon: <Building /> },
                  { name: "ICICI Prudential", icon: <Shield /> },
                  { name: "PayTM", icon: <Smartphone /> },
                  { name: "NABFID", icon: <Award /> }
                ].map((partner, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-purple-200 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#FF4FA3] rounded-2xl flex items-center justify-center mb-3 text-white">
                      {partner.icon}
                    </div>
                    <span className="font-semibold text-gray-700 text-center">{partner.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
