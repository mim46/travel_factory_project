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
import Coxsbazar from "./pages/domestic/Coxsbazar";
import Sajek from "./pages/domestic/Sajek";
import Bandarban from "./pages/domestic/Bandarban";
import Sylhet from "./pages/domestic/Sylhet";
import SaintMartin from "./pages/domestic/SaintMartin";

// International pages
import InternationalHome from "./pages/InternationalHome";
import CountryPlace from "./pages/CountryPlace";
import CountryPackages from "./pages/CountryPackages";

// ⭐ ADMIN IMPORTS
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/pages/Users";
import Packages from "./admin/pages/Packages";
import Bookings from "./admin/pages/Bookings";
import Messages from "./admin/pages/Messages";

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
          <Route path="messages" element={<Messages />} />
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
          <Route path="booking" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="query" element={<Query />} />
          <Route path="contact" element={<Contact />} />

          {/* Domestic */}
          <Route path="domestic" element={<DomesticHome />} />
          <Route path="domestic/coxsbazar" element={<Coxsbazar />} />
          <Route path="domestic/sajek" element={<Sajek />} />
          <Route path="domestic/bandarban" element={<Bandarban />} />
          <Route path="domestic/sylhet" element={<Sylhet />} />
          <Route path="domestic/saintmartin" element={<SaintMartin />} />

          {/* International */}
          <Route path="international" element={<InternationalHome />} />
          <Route path="international/:country/:place" element={<CountryPlace />} />
          <Route path="international/:country" element={<CountryPackages />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
