import { useState } from "react"; // Import useState
import { FaSearch } from "react-icons/fa";
import logo from '../assets/logo.png';
import { PiChatsCircle } from "react-icons/pi";
import { IoNotificationsOutline, IoHelpCircleOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import PropTypes from "prop-types";

const Navbar = ({ toggleSidebar }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State to control search bar visibility

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible); // Toggle search bar visibility
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#f0f8ff] shadow-md p-3 flex items-center justify-between z-10">
      {/* Left Section: Toggle Button */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <FaBars className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Middle Section: Logo */}
      <div className="flex-1 flex justify-center items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <img src={logo} alt="Logo" className="w-12 h-auto md:w-16 lg:w-15" />
      </div>

      {/* Right Section: Search Bar and Icons */}
      <div className="flex items-center space-x-1 sm:space-x-1">
        {/* Search Bar - Visible only when isSearchVisible is true */}
        {isSearchVisible && (
          <div className="flex items-center gap-2 border p-2 rounded-md w-[200px] lg:w-[200px] mr-4">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none w-full"
            />
          </div>
        )}

         {/* Search Icon - Visible only when search bar is hidden */}
         {!isSearchVisible && (
          <button
            onClick={toggleSearchBar} // Toggle search bar visibility on click
            className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            <FaSearch className="w-6 h-6 text-gray-600" />
          </button>
        )}

        {/* Icons */}
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <PiChatsCircle className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300 relative">
          <IoNotificationsOutline className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <IoHelpCircleOutline className="w-6 h-6 text-gray-600" />
        </button>

        {/* Business Appointments Text - Hidden on small screens, visible on medium and larger */}
        <span className="hidden sm:inline text-black font-medium ml-4">
          Business Appointments
        </span>

       
      </div>
    </div>
  );
};

// Add PropTypes validation
Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;