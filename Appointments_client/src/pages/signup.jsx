import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing the eye icons
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";


// Declaring and exporting the Signuppage component
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the value of showPassword state
  };

  return (
    // Main wrapper div with Tailwind classes for centering and background
    <div className="flex justify-center items-center h-screen font-sans">
      {/* Container div for the form */}
      <div className="w-[90%] sm:w-[80%] md:w-[700px] lg:w-[800px] xl:w-[1000px] h-auto md:h-[500px] lg:h-[550px] mx-auto flex flex-col justify-center items-center border border-[rgba(135,206,235,0.3)] rounded-lg bg-[rgba(135,206,235,0.3)] shadow-lg p-4 sm:p-6 md:p-8">
        {/* Logo section */}
        <div className="mb-4">
          <img
            src={logo}
            alt="Logo"
            width={60}
            height={40}
            className="mb-4"
          />
          {/* Horizontal line */}
          <hr className="border-none border-t border-gray-500 w-full m-0" />
        </div>

        {/* Heading for the signup form */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 text-center">
          Let’s create your account.
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 mb-5 text-center">
          Signing up for Calenify is fast and free. No commitments or long-term
          contracts required.
        </p>

        {/* Signup form */}
        <form className="w-full max-w-md">
          {/* Email or Phone input field */}
          <div className="mb-4 text-left">
            <input
              type="text"
              id="emailOrphone"
              placeholder="Email address or Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              pattern="(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^\+?[1-9]\d{1,14}$)"
              title="Enter a valid email address or phone number"
            />
          </div>

          {/* Password input field */}
          <div className="mb-4 relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
            />
            {/* Button to toggle password visibility */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-none border-none cursor-pointer text-blue-500 text-xl"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>

          {/* Terms & conditions checkbox */}
          <div className="mb-4 flex items-center text-left">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
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

          {/* Continue button */}
          <Link
  to="/signup2"
  className="w-full block text-center px-4 py-2 sm:py-3 bg-green-500 text-white rounded-md text-sm sm:text-base cursor-pointer no-underline"
>
  Continue
</Link>
        </form>

        {/* Sign in link */}
        <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center">
          Already have a account?{" "}
          <a href="/login" className="text-blue-500 no-underline">
            Sign in
          </a>
          .
        </p>
      </div>
    </div>
  );
}