import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const formData = {
      emailOrPhone: e.target.emailOrphone.value,
      password: e.target.password.value
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:6001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Signup failed');
      }

      // Store user ID for the next step if needed
      localStorage.setItem('tempUserId', data.userId);
      
      navigate("/signup2"); // Redirect to the next signup page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen font-sans">
      <div className="w-[90%] sm:w-[80%] md:w-[700px] lg:w-[800px] xl:w-[1000px] h-auto md:h-[500px] lg:h-[550px] mx-auto flex flex-col justify-center items-center border border-[rgba(135,206,235,0.3)] rounded-lg bg-[rgba(135,206,235,0.3)] shadow-lg p-4 sm:p-6 md:p-8">
        <div className="mb-4">
          <img
            src={logo}
            alt="Logo"
            width={60}
            height={40}
            className="mb-4"
          />
          <hr className="border-none border-t border-gray-500 w-full m-0" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 text-center">
          Let&apos;s create your account.
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 mb-5 text-center">
          Signing up for Calenify is fast and free. No commitments or long-term
          contracts required.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm w-full max-w-md">
            {error}
          </div>
        )}

        <form className="w-full max-w-md" onSubmit={handleSignup} noValidate>
          <div className="mb-4 text-left">
            <input
              type="text"
              id="emailOrphone"
              name="emailOrphone"
              placeholder="Email address or Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              pattern="(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^\+?[1-9]\d{1,14}$)"
              title="Enter a valid email address or phone number"
              required
            />
          </div>

          <div className="mb-4 relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-none border-none cursor-pointer text-blue-500 text-xl"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>

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

          <button
            type="submit"
            className="w-full block text-center px-4 py-2 sm:py-3 bg-green-500 text-white rounded-md text-sm sm:text-base cursor-pointer no-underline disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>

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