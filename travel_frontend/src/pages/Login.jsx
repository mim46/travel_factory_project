import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../redux/slices/authSlice";
import { sendOtp, verifyOtp, resetPassword, resetForgotPassword, setEmail as setForgotEmail } from "../redux/slices/forgotPasswordSlice";
import logo from "../assets/images/logo.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const { loading: fpLoading, error: fpError, success: fpSuccess, step, email: forgotEmail, message, debugOtp } = useSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Open Forgot Password Modal
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
    dispatch(resetForgotPassword());
  };

  // Close Modal
  const closeModal = () => {
    setShowForgotModal(false);
    setModalEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    dispatch(resetForgotPassword());
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    dispatch(setForgotEmail(modalEmail));
    await dispatch(sendOtp(modalEmail));
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    await dispatch(verifyOtp({ email: forgotEmail, otp }));
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const result = await dispatch(resetPassword({
      email: forgotEmail,
      otp,
      password: newPassword,
      password_confirmation: confirmPassword
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      alert("✅ Password reset successfully! Please login.");
      closeModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4 pt-36">

      <img src={logo} alt="Logo" className="h-20 w-auto mb-4 drop-shadow-xl" />

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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-lg border border-blue-400 text-sm bg-white/70
                focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-blue-400 text-blue-600 
                  focus:ring-2 focus:ring-blue-300"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="#" onClick={handleForgotPasswordClick} className="text-blue-600 hover:underline">
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Forgot Password</h3>
                {fpError && <p className="text-red-600 text-sm mb-3">{fpError}</p>}
                {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

                <form onSubmit={handleSendOtp} className="grid gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold 
                        py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={fpLoading}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                        py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {fpLoading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Verify OTP</h3>
                {fpError && <p className="text-red-600 text-sm mb-3">{fpError}</p>}

                <form onSubmit={handleVerifyOtp} className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm text-center
                      focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold 
                        py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={fpLoading || otp.length !== 6}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                        py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {fpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Reset Password</h3>
                {fpError && <p className="text-red-600 text-sm mb-3">{fpError}</p>}
                {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

                <form onSubmit={handleResetPassword} className="grid gap-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold 
                        py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={fpLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold 
                        py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {fpLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}