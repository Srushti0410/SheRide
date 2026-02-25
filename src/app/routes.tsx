import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { LoginPage } from "./pages/login-page";
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
    path: "/passenger",
    Component: () => (
      <ProtectedRoute requiredRoles={["passenger"]}>
        <PassengerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/driver",
    Component: () => (
      <ProtectedRoute requiredRoles={["driver"]}>
        <DriverDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute requiredRoles={["admin"]}>
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
