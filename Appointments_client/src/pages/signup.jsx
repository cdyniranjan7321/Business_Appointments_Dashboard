
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo from '../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);  // State for toggling password visibility (ture=visible, false= hidden)
  const [isLoading, setIsLoading] = useState(false); //State for loading status during form submission
  const [error, setError] = useState(null);  // State for storing and displaying error messages
  const navigate = useNavigate();

   // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Async function to handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();   // Prevent default form submission behavior
    setError(null);  // Reset any previous errors
    

    // Check form validity using HTML5 validation
    if (!e.target.checkValidity()) {   
      e.target.reportValidity();   // Show validation messages if invalid
      return;
    }

    // Prepare form data for API request
    const formData = {
      emailOrPhone: e.target.emailOrphone.value,  // Get email/phone value
      password: e.target.password.value   // Get password value
    };

    setIsLoading(true);   // Set loading state to true during PI call

    try {
      // MAke POST request to signup endpoint
      {/*
        const response = await fetch('http://localhost:6001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),   // convert data to JSON
      });   
        */}
        // Use environment variable if available, otherwise fallback to production URL
const backendUrl = process.env.REACT_APP_API_URL || 'https://your-backend-api.niranjanchaudhary.com.np';
const response = await fetch(`${backendUrl}/api/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
       // Parse response JSON
      const data = await response.json();

       // check if response was not OK (status code not 2xx)
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Signup failed');   // Throw error with server message or default message
      }

      // Store user ID for the next step if needed(Store user ID localStorage for next signup step)
      localStorage.setItem('tempUserId', data.userId);
      
      navigate("/signup2"); // Redirect to the next signup page on success
    } catch (err) {
      // Catch and display any errors
      setError(err.message);
    } finally {
      // Reset loading state regardless of success/failure
      setIsLoading(false);
    }
  };
        
   // Component render
  return (
    // Main container div with responsive styling
    <div className="flex justify-center items-center h-screen font-sans">
      {/* Signup form container with responsive sizing */}
      <div className="w-[90%] sm:w-[80%] md:w-[700px] lg:w-[800px] xl:w-[1000px] h-auto md:h-[500px] lg:h-[550px] mx-auto flex flex-col justify-center items-center border border-[rgba(135,206,235,0.3)] rounded-lg bg-[rgba(135,206,235,0.3)] shadow-lg p-4 sm:p-6 md:p-8">
        {/* Logo container */}
        <div className="mb-4">
          <img
            src={logo}
            alt="Logo"
            width={60}
            height={40}
            className="mb-4"
          />
          {/* Horizontal divider line */}
          <hr className="border-none border-t border-gray-500 w-full m-0" />
        </div>

          {/* Signup heading */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 text-center">
          Let&apos;s create your account.
        </h1>
        {/* Subheading text */}
        <p className="text-xs sm:text-sm text-gray-700 mb-5 text-center">
          Signing up for Calenify is fast and free. No commitments or long-term
          contracts required.
        </p>

          {/* Error message display (conditionally rendered) */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm w-full max-w-md">
            {error}
          </div>
        )}

        {/* SIgnup form */}
        <form className="w-full max-w-md" onSubmit={handleSignup} noValidate>
          {/* Email/Phone input field */}
          <div className="mb-4 text-left">
            <input
              type="text"
              id="emailOrphone"
              name="emailOrphone"
              placeholder="Email address or Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"

              // Pattern validation for email or phone format
              pattern="(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^\+?[1-9]\d{1,14}$)"
              title="Enter a valid email address or phone number"
              required
            />
          </div>

            {/* Password input field with visibility toggle */}
          <div className="mb-4 relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
              minLength="6"  // Minimum password length requirement
            />

            {/* Password visibility toggle button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-none border-none cursor-pointer text-blue-500 text-xl"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>

          {/* Terms and conditions checkbox */}
          <div className="mb-4 flex items-center text-left">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              required
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-800">
              I agree to Calenify&apos;s{" "}
              <a href="#" className="text-blue-500 no-underline">
                Terms
              </a>
              ,{" "}
              <a href="#" className="text-blue-500 no-underline">
                Privacy Policy
              </a>
              , and{" "}
              <a href="#" className="text-blue-500 no-underline">
                E-Sign Consent
              </a>
              .
            </label>
          </div>

            {/* Submit button */}
          <button
            type="submit"
            className="w-full block text-center px-4 py-2 sm:py-3 bg-green-500 text-white rounded-md text-sm sm:text-base cursor-pointer no-underline disabled:opacity-50"
            disabled={isLoading} // Disable during loading
          >
             {/* show loading text when submitting */}
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>

         {/* Link to login page for existing users */}
        <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center">
          Already have a account?{" "}
          <Link to ="/login" className="text-blue-500 no-underline">
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}