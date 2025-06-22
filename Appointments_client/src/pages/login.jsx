import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from '../assets/logo.png';

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

    // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Async function t handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();   // Prevent default form submission behavior
    setError(null);      // Reset any previous errors
    setIsLoading(true);   // Set loading state to true during API call

    // Prepare form data for API request
    const formData = {
      emailOrPhone: e.target.emailOrPhone.value,  //Get email/phone value
      password: e.target.password.value    // Get password value
    };

    try {
      // Make POST request to login endpoint
      const response = await fetch('https://business-appointments-dashboard-klvo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),  // Convert data to JSON
      });
 
      // parse response JSON
      const data = await response.json();

      // Check if response was not OK (status code not 2xx)
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user ID and verification status
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('toeken', data.token);  // Store token for authenticated requests
      localStorage.setItem('isVerified', data.isVerified);
      // If your backend also sends businessName on login/signup, you can store it too:
     if (data.businessName) {
     localStorage.setItem('businessName', data.businessName);
    }


      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      // Catch and display any errors
      setError(err.message);
      console.error('Login error:', err);   // Log error to console
    } finally {
      setIsLoading(false);  // Reset loading state regardless of success/failure
    }
  };

  // Component render
  return (
    // Main container div with responsive styling
    <div className="flex justify-center items-center h-screen font-sans">
      {/* Login form container with styling */}
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

         {/* Error message display (conditionally rendered) */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="w-full" onSubmit={handleLogin}>
          {/* Email/Phone Input field */}
          <div className="mb-4 text-left">
            <input
              type="text"
              id="emailOrPhone"
              placeholder="Email address or Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              // Pattern validation for email or phone format
              pattern="(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^\+?[1-9]\d{1,14}$)"
              title="Enter a valid email or phone number"
            />
          </div>

          {/* Password Input field with visibility toggle */}
          <div className="mb-4 relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
            />
             {/* Password visibility toggle button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* Toggle between eye icons based on state */}
              {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
            </button>
          </div>

          {/* Forget Password Option Link */}
          <div className="text-right mb-6">
            <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">
              Forget password?
            </a>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            
            {/* Show loading spinner when submitting */}
            {isLoading ? (
              <span className="flex items-center justify-center">
                {/* Loading spinner SVG */}
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Continue'}
          </button>
        </form>

        {/* Sign Up Link for new users  */}
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to ="/signup" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
