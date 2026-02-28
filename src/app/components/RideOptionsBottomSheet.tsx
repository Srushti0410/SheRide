import { motion, AnimatePresence, useDragControls, PanInfo } from "motion/react";
import { Users, Shield, Star, Zap, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface RideOption {
  id: string;
  name: string;
  type: "bike" | "mini" | "sedan" | "suv" | "premium" | "female" | "rickshaw";
  icon: string;
  price: number;
  eta: string;
  capacity: number;
  color: string;
  features?: string[];
}

interface RideOptionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRide: (option: RideOption) => void;
  basePrice: number;
}

const carIcons = {
  bike: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M16 30a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm18 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM19 12h8l3 5h7v3h-6l-3.5 6.2A9 9 0 0 0 25 30h-3.5L17 20h-6v-3h8l2 4 2.2-4H19v-5z" />
    </svg>
  ),
  mini: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M38 18h-2.2l-2.8-7c-.5-1.2-1.7-2-3-2H18c-1.3 0-2.5.8-3 2l-2.8 7H10c-2.2 0-4 1.8-4 4v10c0 1.1.9 2 2 2h2c0 1.7 1.3 3 3 3s3-1.3 3-3h16c0 1.7 1.3 3 3 3s3-1.3 3-3h2c1.1 0 2-.9 2-2V22c0-2.2-1.8-4-4-4zm-25 0l2-5h18l2 5H13zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm22 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  ),
  sedan: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M40 19h-3l-3-7.5C33.5 10.1 32.2 9 30.7 9H17.3c-1.5 0-2.8 1.1-3.3 2.5L11 19H8c-2.2 0-4 1.8-4 4v11c0 1.1.9 2 2 2h2c0 2.2 1.8 4 4 4s4-1.8 4-4h16c0 2.2 1.8 4 4 4s4-1.8 4-4h2c1.1 0 2-.9 2-2V23c0-2.2-1.8-4-4-4zM12 36c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm3-17l2-5.5h14l2 5.5H15zm21 17c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
    </svg>
  ),
  suv: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M42 18h-2.5l-3.5-8.5c-.6-1.4-2-2.5-3.5-2.5H15.5c-1.5 0-2.9 1.1-3.5 2.5L8.5 18H6c-2.2 0-4 1.8-4 4v12c0 1.1.9 2 2 2h2c0 2.8 2.2 5 5 5s5-2.2 5-5h16c0 2.8 2.2 5 5 5s5-2.2 5-5h2c1.1 0 2-.9 2-2V22c0-2.2-1.8-4-4-4zM11 38c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm3-20l2.5-6h15l2.5 6H14zm23 20c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
    </svg>
  ),
  premium: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M41 17h-3l-3.5-9c-.7-1.8-2.4-3-4.2-3H17.7c-1.8 0-3.5 1.2-4.2 3L10 17H7c-2.8 0-5 2.2-5 5v13c0 1.7 1.3 3 3 3h2c0 3.3 2.7 6 6 6s6-2.7 6-6h14c0 3.3 2.7 6 6 6s6-2.7 6-6h2c1.7 0 3-1.3 3-3V22c0-2.8-2.2-5-5-5zM13 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm2-23l3-8h12l3 8H15zm20 23c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
    </svg>
  ),
  female: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M38 18h-2.2l-2.8-7c-.5-1.2-1.7-2-3-2H18c-1.3 0-2.5.8-3 2l-2.8 7H10c-2.2 0-4 1.8-4 4v10c0 1.1.9 2 2 2h2c0 1.7 1.3 3 3 3s3-1.3 3-3h16c0 1.7 1.3 3 3 3s3-1.3 3-3h2c1.1 0 2-.9 2-2V22c0-2.2-1.8-4-4-4zm-25 0l2-5h18l2 5H13zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm22 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      <circle cx="24" cy="8" r="4" fill="currentColor" />
      <path d="M24 13c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4z" fill="currentColor" />
    </svg>
  ),
  rickshaw: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
      <path d="M8 14h20c3.3 0 6 2.7 6 6v5h4c2.2 0 4 1.8 4 4v6h-4a5 5 0 0 1-10 0H18a5 5 0 0 1-10 0H4V18c0-2.2 1.8-4 4-4zm5 23a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm20 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-5-20H12v8h18v-5a3 3 0 0 0-3-3z" />
    </svg>
  ),
};

export function RideOptionsBottomSheet({
  isOpen,
  onClose,
  onSelectRide,
  basePrice,
}: RideOptionsBottomSheetProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dragControls = useDragControls();

  const rideOptions: RideOption[] = [
    {
      id: "bike",
      name: "Bike",
      type: "bike",
      icon: "bike",
      price: Math.round(basePrice * 0.65),
      eta: "1 min",
      capacity: 1,
      color: "orange",
      features: ["Quick", "Affordable", "Helmet"],
    },
    {
      id: "mini",
      name: "Mini",
      type: "mini",
      icon: "mini",
      price: Math.round(basePrice * 0.8),
      eta: "2 min",
      capacity: 3,
      color: "blue",
      features: ["AC", "Music"],
    },
    {
      id: "sedan",
      name: "Sedan",
      type: "sedan",
      icon: "sedan",
      price: basePrice,
      eta: "3 min",
      capacity: 4,
      color: "gray",
      features: ["AC", "Music", "Spacious"],
    },
    {
      id: "suv",
      name: "SUV",
      type: "suv",
      icon: "suv",
      price: Math.round(basePrice * 1.3),
      eta: "4 min",
      capacity: 6,
      color: "green",
      features: ["AC", "Music", "Extra Space", "Comfortable"],
    },
    {
      id: "premium",
      name: "Premium",
      type: "premium",
      icon: "premium",
      price: Math.round(basePrice * 1.6),
      eta: "5 min",
      capacity: 4,
      color: "purple",
      features: ["Luxury", "AC", "Premium Music", "Executive"],
    },
    {
      id: "female",
      name: "Female Driver",
      type: "female",
      icon: "female",
      price: Math.round(basePrice * 1.1),
      eta: "3 min",
      capacity: 4,
      color: "pink",
      features: ["Female Driver", "AC", "Music", "Verified"],
    },
    {
      id: "rickshaw",
      name: "Auto Rickshaw",
      type: "rickshaw",
      icon: "rickshaw",
      price: Math.round(basePrice * 0.75),
      eta: "3 min",
      capacity: 3,
      color: "emerald",
      features: ["Budget", "City Commute", "LGBTQ Friendly"],
    },
  ];

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleSelectOption = (option: RideOption) => {
    setSelectedOption(option.id);
    setTimeout(() => {
      onSelectRide(option);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[40]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            transition={{ type: "spring", damping: 35, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-[50] max-h-[80vh] overflow-hidden"
          >
            <div className="bg-white rounded-t-3xl shadow-2xl">
              {/* Drag Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                />
              </div>

              {/* Header */}
              <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Choose Your Ride</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Tap to select a ride option</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Ride Options */}
              <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {rideOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(option)}
                      className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all ${selectedOption === option.id
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        }`}
                    >
                      {/* Female Driver Only Badge */}
                      {option.type === "female" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" />
                          Women Safety
                        </motion.div>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Car Icon */}
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${option.color}-100 to-${option.color}-200 flex items-center justify-center text-${option.color}-600 p-3`}
                        >
                          {carIcons[option.icon as keyof typeof carIcons]}
                        </motion.div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{option.name}</h3>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                              className="text-right"
                            >
                              <p className="text-xl font-bold text-gray-900">₹{option.price}</p>
                            </motion.div>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{option.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Zap className="w-4 h-4" />
                              <span>{option.eta} away</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-gray-600">4.{8 + index}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1.5">
                            {option.features?.map((feature, i) => (
                              <motion.span
                                key={feature}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                                className={`text-xs px-2 py-0.5 rounded-full bg-${option.color}-100 text-${option.color}-700 font-medium`}
                              >
                                {feature}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Selected Indicator */}
                      <AnimatePresence>
                        {selectedOption === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={`absolute top-4 right-4 w-6 h-6 bg-${option.color}-500 rounded-full flex items-center justify-center`}
                          >
                            <motion.svg
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3 }}
                              viewBox="0 0 24 24"
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <motion.path d="M5 13l4 4L19 7" />
                            </motion.svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Shimmer Loading Effect */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
