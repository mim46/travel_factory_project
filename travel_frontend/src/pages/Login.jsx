import { useState } from "react";
import logo from "../assets/images/logo.png";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // API hit
      const res = await loginUser(email, password);

      // Save token + user + role
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.role);

      alert("Login successful!");

      // ⭐ ROLE BASED REDIRECT
      if (res.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4">

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

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold 
                py-2 rounded-lg shadow-md transition"
            >
              Sign In
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
