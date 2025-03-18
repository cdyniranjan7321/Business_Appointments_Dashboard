
import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  FaBars, 
  FaCalendarAlt, 
  FaChartPie, 
  FaCog, 
  FaHome, 
  FaMoneyBill, 
  FaTags, 
  FaEdit } from "react-icons/fa";

import { FiHelpCircle } from "react-icons/fi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaAd } from "react-icons/fa";
import { PiFolderSimpleUserDuotone } from "react-icons/pi";
import { MdOutlineClear, MdOutlineDashboardCustomize } from "react-icons/md";
import { FcPlanner } from "react-icons/fc";

// Default items (always visible)
const defaultItems = [
  { id: 1, icon: <FaHome />, text: "Home" },
  { id: 2, icon: <FaCog />, text: "Settings" },
  { id: 3, icon: <FiHelpCircle />, text: "Help" },
];

// Optional items (can be added via the popup)
const optionalItems = [
  { id: 4, icon: <FaCalendarAlt />, text: "Appointments" },
  { id: 5, icon: <FaTags />, text: "Products" },
  { id: 6, icon: <FaChartPie />, text: "Reports" },
  { id: 7, icon: <FaMoneyBill />, text: "Payments" },
  { id: 8, icon: <HiOutlineSpeakerphone />, text: "Marketing Suite" },
  { id: 9, icon: <FaAd />, text: "Social & Ads" },
  { id: 10, icon: <PiFolderSimpleUserDuotone />, text: "Manage" },
  { id: 11, icon: <MdOutlineDashboardCustomize />, text: "Custom Features" },
  { id: 12, icon: <FcPlanner />, text: "Plan & Price" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [sidebarItems, setSidebarItems] = useState([defaultItems[0], defaultItems[1], defaultItems[2]]);  // State for sidebar items. 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State for notification popup

  // Load saved items from localStorage on component mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("sidebarItems"));
    if (savedItems) {
      // Ensure Home is first, Settings and Help are last
      setSidebarItems([defaultItems[0], ...savedItems, defaultItems[1], defaultItems[2]]);
      // setSidebarItems([...defaultItems, ...savedItems]);
    }
  }, []);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Save items to localStorage whenever sidebarItems changes
  useEffect(() => {
    const optionalItems = sidebarItems.filter((item) => item.id > 3); // Only save optional items
    localStorage.setItem("sidebarItems", JSON.stringify(optionalItems));
  }, [sidebarItems]);

  useEffect(() => {
    // Check if the user is on the dashboard (you can customize this logic)
    const isOnDashboard = window.location.pathname === "/dashboard"; // Update the path as needed
  
    if (isOnDashboard) {
      // Show the notification after 3 seconds
      const showTimeoutId = setTimeout(() => {
        setShowNotification(true);
      }, 2000);

      // Hide the notification after 6 seconds
    const hideTimeoutId = setTimeout(() => {
      setShowNotification(false);
    }, 8000); // 2000ms (show) + 6000ms (display duration)
  
      
    // Clear timeouts when the component unmounts
    return () => {
      clearTimeout(showTimeoutId);
      clearTimeout(hideTimeoutId);
    };
     
    }
  }, []);

  // Handle item selection/deselection in the popup
  const handleItemToggle = (id) => {
    const item = optionalItems.find((item) => item.id === id);
    if (item) {
      const isItemInSidebar = sidebarItems.some((item) => item.id === id);
      if (isItemInSidebar) {
        // Remove item from sidebar
        setSidebarItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
            // Add item to sidebar (between Home and Settings/Help)
            setSidebarItems((prevItems) => [
              prevItems[0], // Home
              ...prevItems.slice(1, -2), // Existing optional items.
              item, // New optional item
              prevItems[prevItems.length -2], // Settings
              prevItems[prevItems.length -1], //Help
            ]);
        // Add item to sidebar
        //setSidebarItems((prevItems) => [...prevItems, item]);
      }
    }
  };

  return (
    
    <div className={`fixed left-0 top-0 h-screen ${isOpen ? "w-64" : "w-17"} bg-[#6FB434] text-white transition-all duration-300 pt-16 overflow-y-auto`}> 
       {/* The width of the sidebar toggles between w-16 (collapsed) and w-64 (expanded), but the height remains h-screen in both states.  */}
      <div className="flex items-center justify-between p-4 mt-2">
        <h1 className={`text-2xl font-bold ${!isOpen && "hidden"}`}>Tools</h1>
        <div className="flex items-center gap-4">
          <FaEdit
            className="cursor-pointer text-xl"
            onClick={() => setShowPopup(true)}
            title="Edit Sidebar"
          />
          <FaBars
            className="cursor-pointer text-xl"
            onClick={() => setIsOpen(!isOpen)}
            title="Toggle Sidebar"
          />
        </div>
      </div>
                 {/* 
                    <nav className="flex flex-col gap-4 p-4">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.id} isOpen={isOpen} icon={item.icon} text={item.text} />
        ))}
      </nav>
                      */}
      
      <nav className="flex flex-col gap-4 p-4">
  {/* Always show Home first */}
  <SidebarItem key={defaultItems[0].id} isOpen={isOpen} icon={defaultItems[0].icon} text={defaultItems[0].text} />

  {/* Show selected optional items */}
  {sidebarItems
    .filter((item) => item.id > 3) // Filter out Home, Settings, and Help
    .map((item) => (
      <SidebarItem key={item.id} isOpen={isOpen} icon={item.icon} text={item.text} />
    ))}

  {/* Always show Settings and Help at the end */}
  <SidebarItem key={defaultItems[1].id} isOpen={isOpen} icon={defaultItems[1].icon} text={defaultItems[1].text} />
  <SidebarItem key={defaultItems[2].id} isOpen={isOpen} icon={defaultItems[2].icon} text={defaultItems[2].text} />
</nav>


      {/* Popup for editing optional items */}
      {showPopup && (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-12">
          {/* The popup also has max-h-[80vh] and overflow-y-auto to ensure it doesn't exceed the screen height and remains scrollable. */}
          <div className="bg-[#f0f8ff] p-6 rounded-lg shadow-lg w-[90%] md:w-150 max-w-lg mx-auto relative h-[75vh] overflow-auto flex flex-col">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={togglePopup}
                className="px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-700 text-white"
              >
                <MdOutlineClear />
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-2 px-4 py-2 bg-[#6FB434] text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
            <h2 className="text-xl font-bold text-left mb-4 text-black">Edit Navigation</h2>
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {optionalItems.map((item) => (
                <label key={item.id} className="flex justify-between items-center p-2 border-b border-gray-700">
                  <div className="flex items-center gap-2 text-black">
                    {item.icon}
                    <span className="text-black">{item.text}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sidebarItems.some((i) => i.id === item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    className="ml-2"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-black">Default Items (Non-Selectable)</h3>
              {defaultItems.map((item, index) => (
                <div key={index} className="flex items-center p-2 text-black">
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
             {showNotification && (
  <div className="fixed bottom-4 right-4 bg-yellow-200 p-4 rounded-lg shadow-lg flex items-center gap-4">
    <span className="text-gray-800">Please <strong>Edit</strong> the sidebar to customize your experience.</span>
    <button 
              onClick={() => setShowNotification(false)} 
              className="text-red-600 hover:text-gray-700 transition-colors duration-300">
      <MdOutlineClear />
    </button>
  </div>
)}

    </div>
  );
};

const SidebarItem = ({ isOpen, icon, text, isSelectable = true }) => (
  <div
    className={`flex items-center gap-2 p-2 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 group ${
      !isSelectable && "opacity-50 cursor-not-allowed"
    }`}
  >
    {React.cloneElement(icon, {
      className: `w-5 h-5 text-white group-hover:text-[#6FB434] ${icon.props.className || ""}`,
    })}
    {isOpen && (
      <span
        className={`text-sm font-medium ${
          !isSelectable ? "text-black" : "text-white"
        } group-hover:text-[#6FB434] group-hover:font-bold group-hover:text-[15px]`}
      >
        {text}
      </span>
    )}
  </div>
);

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

SidebarItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  isSelectable: PropTypes.bool,
};

export default Sidebar;