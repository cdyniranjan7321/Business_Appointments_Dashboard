

import PropTypes from "prop-types"; // Import PropTypes
import { FaBars, FaCalendarAlt, FaChartPie, FaCog, FaHome, FaMoneyBill, FaTags, FaUsers } from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {


  

  return (
    <div className={`fixed left-0 top-0 h-screen ${isOpen ? "w-64" : "w-16"} bg-[#6FB434] text-white transition-all duration-300 pt-16`}>
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-2xl font-bold ${!isOpen && "hidden"}`}>Dashboard</h1>
        <FaBars className="cursor-pointer text-xl" onClick={() => setIsOpen(!isOpen)} />
      </div>

      <nav className="flex flex-col gap-4 p-4">
        <SidebarItem isOpen={isOpen} icon={<FaHome />} text="Home" />
        <SidebarItem isOpen={isOpen} icon={<FaCalendarAlt />} text="Appointments" />
        <SidebarItem isOpen={isOpen} icon={<FaTags />} text="Products" />
        <SidebarItem isOpen={isOpen} icon={<FaUsers />} text="Marketing Suite" />
        <SidebarItem isOpen={isOpen} icon={<FaChartPie />} text="Reports" />
        <SidebarItem isOpen={isOpen} icon={<FaMoneyBill />} text="Payments" />
        <SidebarItem isOpen={isOpen} icon={<FaCog />} text="Settings" />
      </nav>
    </div>
  );
};

const SidebarItem = ({ isOpen, icon, text }) => (
  <div className="flex items-center gap-2 p-2 hover:bg-green-800 rounded cursor-pointer">
    {icon}
    {isOpen && <span>{text}</span>}
  </div>
);

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
};

// Define PropTypes for SidebarItem
SidebarItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // isOpen should be a boolean
  icon: PropTypes.node.isRequired,   // icon should be a React node (JSX element)
  text: PropTypes.string.isRequired, // text should be a string
};

export default Sidebar;
