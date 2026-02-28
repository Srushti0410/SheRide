import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Car, Star, Phone, Shield, Navigation, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface BookingButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  selectedRide?: {
    name: string;
    price: number;
  };
}

interface Driver {
  name: string;
  rating: number;
  carNumber: string;
  photo: string;
  eta: number;
}

type RideStatus =
  | "idle"
  | "searching"
  | "found"
  | "captain_on_way"
  | "arriving"
  | "reached"
  | "started";

export function BookingButton({ onConfirm, disabled, selectedRide }: BookingButtonProps) {
  const [rideStatus, setRideStatus] = useState<RideStatus>("idle");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // Start ride progression
    setRideStatus("searching");

    // Step 1: Finding driver (3 seconds)
    setTimeout(() => {
      setRideStatus("found");
      setDriver({
        name: "Priya Sharma",
        rating: 4.9,
        carNumber: "KA 05 MN 1234",
        photo: "👩",
        eta: 5,
      });
    }, 3000);

    // Step 2: Captain on the way (5 seconds)
    setTimeout(() => {
      setRideStatus("captain_on_way");
      setDriver((prev) => prev ? { ...prev, eta: 3 } : null);
    }, 8000);

    // Step 3: Arriving (3 seconds)
    setTimeout(() => {
      setRideStatus("arriving");
      setDriver((prev) => prev ? { ...prev, eta: 1 } : null);
    }, 11000);

    // Step 4: Driver reached (2 seconds)
    setTimeout(() => {
      setRideStatus("reached");
      setDriver((prev) => prev ? { ...prev, eta: 0 } : null);
    }, 13000);

    // Step 5: Ride started
    setTimeout(() => {
      setRideStatus("started");
    }, 15000);

    onConfirm();
  };

  const getStatusMessage = () => {
    switch (rideStatus) {
      case "searching":
        return "Finding nearest driver...";
      case "found":
        return "Driver Found!";
      case "captain_on_way":
        return "Captain is on the way";
      case "arriving":
        return "Captain is arriving";
      case "reached":
        return "Captain has arrived!";
      case "started":
        return "Ride Started";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (rideStatus) {
      case "searching":
        return <Car className="w-5 h-5" />;
      case "found":
        return <CheckCircle className="w-5 h-5" />;
      case "captain_on_way":
        return <Navigation className="w-5 h-5" />;
      case "arriving":
        return <MapPin className="w-5 h-5" />;
      case "reached":
        return <CheckCircle className="w-5 h-5" />;
      case "started":
        return <Car className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Sticky Bottom Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-white via-white to-transparent"
      >
        <Button
          onClick={handleClick}
          disabled={disabled || rideStatus !== "idle"}
          className="relative w-full h-14 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Ripple Effects */}
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute w-8 h-8 bg-white rounded-full"
              style={{ left: ripple.x, top: ripple.y, transform: "translate(-50%, -50%)" }}
            />
          ))}

          {/* Button Content */}
          <motion.div
            animate={{ scale: rideStatus === "searching" ? 0.95 : 1 }}
            className="relative z-10 flex items-center justify-center gap-2"
          >
            {rideStatus === "searching" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Car className="w-5 h-5" />
                </motion.div>
                <span>Finding Driver...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>
                  Confirm Ride {selectedRide && `• ₹${selectedRide.price}`}
                </span>
              </>
            )}
          </motion.div>

          {/* Shimmer Effect */}
          {rideStatus === "idle" && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          )}
        </Button>

        {selectedRide && rideStatus === "idle" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-gray-600 mt-2"
          >
            {selectedRide.name} • Arrives in ~2 min
          </motion.p>
        )}
      </motion.div>

      {/* Searching Overlay */}
      <AnimatePresence>
        {rideStatus === "searching" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl"
            >
              {/* Radar Pulse Effect */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 border-4 border-pink-500 rounded-full"
                  />
                ))}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Scanning Line */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center" }}
                >
                  <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-pink-500 to-transparent" />
                </motion.div>
              </div>

              <motion.h3
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Finding nearest driver...
              </motion.h3>
              <p className="text-gray-600">Please wait a moment</p>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-pink-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Found Card with Status Progression */}
      <AnimatePresence>
        {driver && rideStatus !== "idle" && rideStatus !== "searching" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-white rounded-3xl shadow-2xl p-6 border-2 ${rideStatus === "reached" ? "border-green-500" : "border-blue-500"
                }`}
            >
              {/* Status Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <motion.div
                  animate={{
                    rotate: rideStatus === "captain_on_way" || rideStatus === "arriving" ? 360 : 0
                  }}
                  transition={{
                    duration: rideStatus === "captain_on_way" || rideStatus === "arriving" ? 2 : 0,
                    repeat: rideStatus === "captain_on_way" || rideStatus === "arriving" ? Infinity : 0,
                    ease: "linear"
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${rideStatus === "reached"
                      ? "bg-green-500"
                      : rideStatus === "started"
                        ? "bg-purple-500"
                        : "bg-blue-500"
                    }`}
                >
                  {getStatusIcon()}
                </motion.div>
                <span className={`text-lg font-bold ${rideStatus === "reached"
                    ? "text-green-600"
                    : rideStatus === "started"
                      ? "text-purple-600"
                      : "text-blue-600"
                  }`}>
                  {getStatusMessage()}
                </span>
              </motion.div>

              {/* Driver Info */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
                  className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-3xl"
                >
                  {driver.photo}
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{driver.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(driver.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{driver.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-mono">{driver.carNumber}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 border-2 border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>

              {/* ETA Banner - Only show if not reached/started */}
              {driver.eta > 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-gradient-to-r ${rideStatus === "arriving"
                      ? "from-orange-500 to-red-500"
                      : "from-pink-500 to-purple-500"
                    } text-white rounded-xl p-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    {rideStatus === "arriving" ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MapPin className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Car className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {rideStatus === "arriving" ? "Almost there" : "Driver arriving in"}
                    </span>
                  </div>
                  <motion.div
                    key={driver.eta}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold"
                  >
                    {driver.eta} min
                  </motion.div>
                </motion.div>
              )}

              {/* Reached Message */}
              {rideStatus === "reached" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-3 text-center"
                >
                  <p className="text-green-700 font-semibold">
                    Your captain is waiting at the pickup point
                  </p>
                </motion.div>
              )}

              {/* Started Message */}
              {rideStatus === "started" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center"
                >
                  <p className="text-purple-700 font-semibold">
                    Enjoy your ride! Drive safely 🚗
                  </p>
                </motion.div>
              )}

              {/* Verification Badge */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600"
              >
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verified & Background Checked Driver</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
