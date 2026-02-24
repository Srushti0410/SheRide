import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { PassengerDashboard } from "./pages/passenger-dashboard";
import { DriverDashboard } from "./pages/driver-dashboard";
import { SafetyPage } from "./pages/safety-page";
import { FinancialPage } from "./pages/financial-page";
import { AdminDashboard } from "./pages/admin-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/passenger",
    Component: PassengerDashboard,
  },
  {
    path: "/driver",
    Component: DriverDashboard,
  },
  {
    path: "/safety",
    Component: SafetyPage,
  },
  {
    path: "/financial",
    Component: FinancialPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
