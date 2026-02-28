import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Share2, Shield, MapPin, Navigation, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface SafetyUIProps {
  tripStatus?: "idle" | "pickup" | "ontrip" | "dropped";
  onSOS?: () => void;
  onShareTrip?: () => void;
}

export function SafetyUI({ tripStatus = "idle", onSOS, onShareTrip }: SafetyUIProps) {
  const [sosPressed, setSosPressed] = useState(false);
  const [sharePressed, setSharePressed] = useState(false);

  const handleSOS = () => {
    setSosPressed(true);
    if (onSOS) onSOS();

    setTimeout(() => {
      setSosPressed(false);
    }, 3000);
  };

  const handleShare = () => {
    setSharePressed(true);
    if (onShareTrip) onShareTrip();

    setTimeout(() => {
      setSharePressed(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-24 z-30 flex flex-col gap-3">
        {/* SOS Button */}
        <motion.div
          initial={{ scale: 0, x: 100 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSOS}
            className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white group overflow-hidden"
          >
            {/* Glow Animation */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />

            {/* Pulse Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 2],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
                className="absolute inset-0 border-2 border-red-500 rounded-full"
              />
            ))}

            <AlertCircle className="w-7 h-7 relative z-10" />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg pointer-events-none"
            >
              Emergency SOS
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-8 border-l-gray-900 border-y-4 border-y-transparent" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Share Trip Button */}
        <motion.div
          initial={{ scale: 0, x: 100 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white group"
          >
            <Share2 className="w-6 h-6" />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg pointer-events-none"
            >
              Share Trip
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-8 border-l-gray-900 border-y-4 border-y-transparent" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Shield/Protection Indicator */}
        <motion.div
          initial={{ scale: 0, x: 100 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white"
          >
            <Shield className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* Trip Progress Indicator */}
      <AnimatePresence>
        {tripStatus !== "idle" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-full px-6 py-3 shadow-2xl">
              <div className="flex items-center gap-4">
                {/* Pickup */}
                <motion.div
                  animate={{
                    scale: tripStatus === "pickup" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1, repeat: tripStatus === "pickup" ? Infinity : 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${tripStatus === "pickup"
                        ? "bg-blue-500 text-white"
                        : tripStatus === "ontrip" || tripStatus === "dropped"
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {tripStatus === "ontrip" || tripStatus === "dropped" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 mt-1">Pickup</span>
                </motion.div>

                {/* Connection Line */}
                <div className="relative w-12 h-0.5 bg-gray-300">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: tripStatus === "ontrip" || tripStatus === "dropped" ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-green-500 origin-left"
                  />
                </div>

                {/* On Trip */}
                <motion.div
                  animate={{
                    scale: tripStatus === "ontrip" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1, repeat: tripStatus === "ontrip" ? Infinity : 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${tripStatus === "ontrip"
                        ? "bg-blue-500 text-white"
                        : tripStatus === "dropped"
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {tripStatus === "dropped" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Navigation className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 mt-1">On Trip</span>
                </motion.div>

                {/* Connection Line */}
                <div className="relative w-12 h-0.5 bg-gray-300">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: tripStatus === "dropped" ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-green-500 origin-left"
                  />
                </div>

                {/* Drop */}
                <motion.div
                  animate={{
                    scale: tripStatus === "dropped" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1, repeat: tripStatus === "dropped" ? Infinity : 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${tripStatus === "dropped"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {tripStatus === "dropped" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 mt-1">Drop</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Alert Modal */}
      <AnimatePresence>
        {sosPressed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm text-center shadow-2xl"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">SOS Activated!</h3>
              <p className="text-gray-600 mb-4">
                Emergency alert sent to authorities and your emergency contacts.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-red-500 hover:bg-red-600">
                  Call 112
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Success Toast */}
      <AnimatePresence>
        {sharePressed && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Trip shared successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
