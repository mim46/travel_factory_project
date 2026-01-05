import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import logo from "../assets/images/logo.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      alert("✅ Login successful!");

      // Role based redirect
      if (result.payload.role === "admin") {
        navigate("/admin"); // Admin → Admin Dashboard
      } else {
        navigate("/"); // User → Landing Page
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4">

      <img src={logo} alt="Logo" className="h-24 w-auto mb-6 drop-shadow-xl" />

      <div className="
        w-full max-w-md p-8 rounded-2xl
        bg-white/40 backdrop-blur-md 
        shadow-xl border border-white/30 
        text-center
      ">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In</h2>

        {error && (
          <p className="text-red-600 mb-3 text-sm font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin} className="grid gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-blue-400 text-sm bg-white/70
              focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-blue-400 text-sm bg-white/70
              focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="grid place-items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold 
                py-2 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-700 mt-4">
          Don't have an account?
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}