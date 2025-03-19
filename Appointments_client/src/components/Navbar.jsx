import { FaSearch } from "react-icons/fa";
import logo from '../assets/logo.png';
import { PiChatsCircle } from "react-icons/pi";
import { IoNotificationsOutline, IoHelpCircleOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#f0f8ff] shadow-md p-3 flex items-center justify-between z-10">
      {/* Left Section: Toggle Button and Dashboard Text */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <FaBars className="w-6 h-6 text-gray-600" />
        </button>
       
      </div>

      {/* Middle Section: Logo */}
      <div className="flex-1 flex justify-center items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <img src={logo} alt="Logo" width={60} height={40} style={{ marginBottom: "16px" }} />
      </div>

      {/* Right Section: Search Bar and Icons */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2 border p-2 rounded-md w-[200px]">
          <FaSearch className="text-gray-500" />
          <input type="text" placeholder="Search" className="outline-none w-full" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <PiChatsCircle className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300 relative">
          <IoNotificationsOutline className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300">
          <IoHelpCircleOutline className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-black font-medium">Business Appointments</span>
      </div>
    </div>
  );
};

// Add PropTypes validation
Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired, // Ensure toggleSidebar is a required function
}  



export default Navbar;