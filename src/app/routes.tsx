import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { LoginPage } from "./pages/login-page";
import { ProfileCompletionPage } from "./pages/profile-completion";
import { PassengerDashboard } from "./pages/passenger-dashboard";
import { DriverDashboard } from "./pages/driver-dashboard";
import { SafetyPage } from "./pages/safety-page";
import { FinancialPage } from "./pages/financial-page";
import { AdminDashboard } from "./pages/admin-dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/profile-completion",
    Component: () => (
      <ProtectedRoute requireProfileComplete={false}>
        <ProfileCompletionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/passenger",
    Component: () => (
      <ProtectedRoute requiredRoles={["passenger"]} requireProfileComplete={true}>
        <PassengerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/driver",
    Component: () => (
      <ProtectedRoute requiredRoles={["driver"]} requireProfileComplete={true}>
        <DriverDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute requiredRoles={["admin"]} requireProfileComplete={false}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/safety",
    Component: SafetyPage,
  },
  {
    path: "/financial",
    Component: FinancialPage,
  },
]);
