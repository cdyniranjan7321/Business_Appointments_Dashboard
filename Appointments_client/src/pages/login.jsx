import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from '../assets/logo.png';

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    navigate("/dashboard"); // Redirect to Dashboard
  };

  return (
    <div className="flex justify-center items-center h-screen font-sans">
      <div className="w-full max-w-md p-8 border border-blue-200 rounded-lg bg-blue-100 shadow-lg text-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-16 h-auto mx-auto mb-4" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Let’s sign in to your account.
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Signing in for Calenify is fast and free.
        </p>

        {/* Form */}
        <form className="w-full" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4 text-left">
            <input
              type="text"
              id="emailOrPhone"
              placeholder="Email address or Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
            </button>
          </div>

          {/* Forget Password Option */}
          <div className="text-right mb-6">
            <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">
              Forget password?
            </a>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="block w-full px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 transition-colors"
          >
            Continue
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
