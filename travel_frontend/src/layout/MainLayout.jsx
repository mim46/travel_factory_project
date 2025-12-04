import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const location = useLocation();

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/query";

  return (
    <>
      <Navbar />

      {/* Page Content */}
      <main className="min-h-screen">
        <Outlet />  {/* <-- Renders child pages correctly */}
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}
