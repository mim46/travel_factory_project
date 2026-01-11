import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/images/logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 11)) return;

    setForm({ ...form, [name]: value });
  };

  // Validate form
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full Name is required.";
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email.";
    if (form.phone.length !== 11) newErrors.phone = "Phone must be 11 digits.";
    if (!form.gender) newErrors.gender = "Please select gender.";
    if (!form.dob) newErrors.dob = "Date of Birth is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!validate()) return;

    const result = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob,
        address: form.address,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      alert("Signup successful! Please login now.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4">

      {/* Logo */}
      <img src={logo} alt="Travel Factory Logo" className="h-20 mb-4 drop-shadow-xl" />

      {/* Form Container */}
      <div className="bg-white/40 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-3xl p-6">

        <h2 className="text-center text-3xl font-bold text-[#1a4d4f] mb-6">
          Create Your Account
        </h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            />
            {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            />
            {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
          </div>

          {/* Gender */}
          <div>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            {errors.gender && <p className="text-red-600 text-xs">{errors.gender}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            />
            {errors.dob && <p className="text-red-600 text-xs">{errors.dob}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="p-2.5 rounded-lg w-full border border-blue-400 text-sm"
            />
            {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={handleChange}
              className="p-2.5 pr-10 rounded-lg w-full border border-blue-400 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="p-2.5 pr-10 rounded-lg w-full border border-blue-400 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

        </div>

        {/* Terms */}
        <div className="mt-3 flex items-center space-x-2">
          <input type="checkbox" />
          <span className="text-sm">I agree to the Terms & Conditions.</span>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm font-medium text-center mt-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md text-sm w-1/2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        {/* Login */}
        <p className="text-center mt-3 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-700 font-semibold ml-1">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}
