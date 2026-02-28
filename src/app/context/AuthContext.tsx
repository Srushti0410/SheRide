import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "passenger" | "driver" | "admin" | null;

export interface UserProfile {
  age?: number;
  gender?: "male" | "female" | "other";
  profilePhoto?: string;
  idProof?: string;
  idNumber?: string;
  licenseNumber?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  insuranceProof?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  homeLocation?: { lat: number; lng: number; address: string };
  workLocation?: { lat: number; lng: number; address: string };
  verificationStatus?: "pending" | "approved" | "rejected";
  faceVerification?: "pending" | "verified";
  backgroundCheckStatus?: "pending" | "approved" | "rejected";
  preferredRideTypes?: Array<"bike" | "cab" | "rickshaw">;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  updateProfile: (profile: UserProfile) => void;
  completeProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("sheride_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    const newUser = { ...userData, isProfileComplete: false };
    setUser(newUser);
    localStorage.setItem("sheride_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sheride_user");
  };

  const selectRole = (role: UserRole) => {
    if (user && role) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  const completeProfile = () => {
    if (user) {
      const updatedUser = { ...user, isProfileComplete: true };
      setUser(updatedUser);
      localStorage.setItem("sheride_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        selectRole,
        updateProfile,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
