import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Existing pages
import Home from "./pages/Home";
import BudgetHome from "./pages/BudgetHome";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PackageDetails from "./pages/PackageDetails";
import Gallery from "./pages/Gallery";
import Destinations from "./pages/Destinations";
import Query from "./pages/Query";
import Contact from "./pages/Contact";

// Domestic pages
import DomesticHome from "./pages/DomesticHome";
import CountryPlace from "./pages/CountryPlace";

// International pages
import InternationalHome from "./pages/InternationalHome";
import CountryPackages from "./pages/CountryPackages";

// ⭐ ADMIN IMPORTS
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/pages/Users";
import Packages from "./admin/pages/Packages";
import Bookings from "./admin/pages/Bookings";
import AdminMessages from "./admin/pages/Messages";  // ✅ Renamed to AdminMessages
import AdminDestinations from "./admin/pages/Destinations";
import Reports from "./admin/pages/Reports";

// ⭐ USER DASHBOARD IMPORTS
import UserLayout from "./user/UserLayout";
import UserDashboard from "./user/UserDashboard";
import MyBookings from "./user/pages/MyBookings";
import MyProfile from "./user/pages/MyProfile";
import PaymentHistory from "./user/pages/PaymentHistory";
import Settings from "./user/pages/Settings";
import UserMessages from "./user/pages/Messages";  // ✅ Renamed to UserMessages


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =============================
            ⭐ ADMIN PANEL ROUTES
        ============================== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="packages" element={<Packages />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* =============================
            ⭐ USER DASHBOARD ROUTES
        ============================== */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="messages" element={<UserMessages />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* =============================
            ⭐ USER FRONTEND ROUTES
        ============================== */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Home */}
          <Route index element={<Home />} />

          {/* Other pages */}
          <Route path="budget" element={<BudgetHome />} />
          <Route path="package-details/:id" element={<PackageDetails />} />
          <Route path="booking/:id" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="query" element={<Query />} />
          <Route path="contact" element={<Contact />} />

          {/* ✅ DOMESTIC - Dynamic Routing */}
          <Route path="domestic" element={<DomesticHome />} />
          <Route path="domestic/:place" element={<CountryPlace />} />

          {/* ✅ INTERNATIONAL - Dynamic Routing */}
          <Route path="international" element={<InternationalHome />} />
          <Route path="international/:country" element={<CountryPackages />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}