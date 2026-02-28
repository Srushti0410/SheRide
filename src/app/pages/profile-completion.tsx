import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "motion/react";
import { Upload, MapPin, User, Car, FileCheck, AlertCircle } from "lucide-react";
import { LocationSelector } from "../components/LocationSelector";

export function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user, updateProfile, completeProfile } = useAuth();
  const [step, setStep] = useState<"personal" | "location" | "verification">("personal");
  const [loading, setLoading] = useState(false);

  // Personal Info
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Driver specific
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // Location
  const [homeLocation, setHomeLocation] = useState<any>(null);
  const [workLocation, setWorkLocation] = useState<any>(null);

  // Verification
  const [idProof, setIdProof] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [insuranceProof, setInsuranceProof] = useState("");

  // const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // Store as base64 or handle upload to backend
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "idProof" | "insuranceProof"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "idProof") {
          setIdProof("verified");
        } else if (type === "insuranceProof") {
          setInsuranceProof("verified");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === "personal") {
      if (!age || !gender || !emergencyContact || !emergencyPhone) {
        alert("Please fill all personal details");
        return;
      }
      setStep("location");
    } else if (step === "location") {
      if (!homeLocation || !workLocation) {
        alert("Please select both home and work locations");
        return;
      }
      setStep("verification");
    }
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const profileData = {
        age: parseInt(age),
        gender: gender as "male" | "female" | "other" | undefined,
        emergencyContact,
        emergencyPhone,
        homeLocation,
        workLocation,
        idProof,
        idNumber,
        licenseNumber: user?.role === "driver" ? licenseNumber : undefined,
        vehicleModel: user?.role === "driver" ? vehicleModel : undefined,
        vehicleNumber: user?.role === "driver" ? vehicleNumber : undefined,
        insuranceProof: user?.role === "driver" ? insuranceProof : undefined,
        verificationStatus: "pending" as const,
      };

      updateProfile(profileData);
      completeProfile();

      // Redirect to appropriate dashboard
      const dashboardPath =
        user?.role === "admin" ? "/admin" :
          user?.role === "driver" ? "/driver" : "/passenger";
      navigate(dashboardPath);
    } catch (error) {
      alert("Error submitting profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateAllFields = (): boolean => {
    if (!age || !gender || !emergencyContact || !emergencyPhone) return false;
    if (!homeLocation || !workLocation) return false;
    if (user?.role === "driver") {
      if (!licenseNumber || !vehicleModel || !vehicleNumber || !idProof) return false;
    } else {
      if (!idProof || !idNumber) return false;
    }
    return true;
  };

  const completionPercentage = () => {
    let filled = 0;
    let total = 7; // base fields

    if (age) filled++;
    if (gender) filled++;
    if (emergencyContact) filled++;
    if (emergencyPhone) filled++;
    if (homeLocation) filled++;
    if (workLocation) filled++;
    if (idProof) filled++;

    if (user?.role === "driver") {
      total += 3;
      if (licenseNumber) filled++;
      if (vehicleModel) filled++;
      if (vehicleNumber) filled++;
    } else {
      if (idNumber) filled++;
    }

    return Math.round((filled / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-300 mb-8">Help us verify your identity for safety</p>

          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${completionPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mb-8">Profile {completionPercentage()}% complete</p>
        </motion.div>

        {/* Steps */}
        <div className="flex gap-2 mb-8 justify-center md:justify-start">
          {["personal", "location", "verification"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${i !== 2 ? "md:mr-4" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s
                  ? "bg-pink-500 text-white ring-4 ring-pink-300"
                  : ["personal", "location", "verification"].indexOf(step) >
                    ["personal", "location", "verification"].indexOf(s)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400"
                  }`}
              >
                {i + 1}
              </div>
              {i !== 2 && <div className="hidden md:block w-8 h-0.5 bg-gray-700"></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-800 rounded-2xl p-8"
        >
          {/* Personal Information Step */}
          {step === "personal" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-pink-400" />
                Personal Information
              </h2>

              <div className="space-y-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                  <Input
                    type="number"
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-4 h-4 text-pink-500"
                        />
                        <span className="text-gray-300 capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Name *
                  </label>
                  <Input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Name of emergency contact"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Phone number with country code"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Driver Additional Info */}
                {user?.role === "driver" && (
                  <>
                    <div className="border-t border-gray-700 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Car className="w-5 h-5 text-purple-400" />
                        Vehicle Information
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        License Number *
                      </label>
                      <Input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="Your driver license number"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vehicle Model *
                      </label>
                      <Input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g., Toyota Innova"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vehicle Number *
                      </label>
                      <Input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="License plate number"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Location Selection Step */}
          {step === "location" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-pink-400" />
                Live Location Setup
              </h2>

              {/* Home Location Selector */}
              <LocationSelector
                title="Home Address"
                value={homeLocation}
                onChange={(location) => setHomeLocation(location)}
                placeholder="Enter your home address or use map"
                description="We'll use this as your safe pickup location"
              />

              <div className="border-t border-gray-700 my-6"></div>

              {/* Work Location Selector */}
              <LocationSelector
                title="Work Address"
                value={workLocation}
                onChange={(location) => setWorkLocation(location)}
                placeholder="Enter your work address or use map"
                description="Common commute destination"
              />

              <div className="bg-amber-900 bg-opacity-30 border border-amber-600 rounded-lg p-4 flex gap-3 mt-6">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-300">
                  These locations help us provide better safety features and route optimization. You can use search, map selection, or live location to set them up.
                </p>
              </div>
            </div>
          )}

          {/* Verification Step */}
          {step === "verification" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-pink-400" />
                Document Verification
              </h2>

              <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  Upload clear documents for verification. This helps us ensure safety and authenticity.
                </p>
              </div>

              <div className="space-y-4">
                {/* ID Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID Proof (Aadhar/Passport/Driving License) *
                  </label>
                  <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Upload className="w-5 h-5" />
                      <span>
                        {idProof ? "Document Uploaded ✓" : "Click to upload ID proof"}
                      </span>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleDocumentUpload(e, "idProof")}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                </div>

                {/* ID Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID Number (as per document) *
                  </label>
                  <Input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Your ID number"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Driver Insurance */}
                {user?.role === "driver" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vehicle Insurance Proof *
                    </label>
                    <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Upload className="w-5 h-5" />
                        <span>
                          {insuranceProof ? "Document Uploaded ✓" : "Click to upload insurance proof"}
                        </span>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleDocumentUpload(e, "insuranceProof")}
                        className="hidden"
                        accept="image/*,.pdf"
                      />
                    </label>
                  </div>
                )}

                {/* Safety Commitment */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-pink-500 mt-1" required />
                    <span className="text-sm text-gray-300">
                      I commit to maintain safety standards and follow all SheRide guidelines. I
                      understand that verification is mandatory for platform access.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-700">
            {step !== "personal" && (
              <Button
                onClick={() => {
                  if (step === "location") setStep("personal");
                  else if (step === "verification") setStep("location");
                }}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step !== "verification" && (
              <Button onClick={handleNext} className="flex-1 bg-pink-500 hover:bg-pink-600">
                Next
              </Button>
            )}
            {step === "verification" && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !validateAllFields()}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {loading ? "Submitting..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
