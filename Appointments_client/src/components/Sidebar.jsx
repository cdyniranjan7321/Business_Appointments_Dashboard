
import React from "react";
import { useNavigate } from "react-router-dom";
import { TbApps, TbDownload } from "react-icons/tb";
import { LuMessagesSquare } from "react-icons/lu";
import { SiCreatereactapp } from "react-icons/si";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { useState, useEffect } from "react";
import { MdProductionQuantityLimits } from "react-icons/md";
import { MdOutlineDiscount } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import PropTypes from "prop-types";
import { FcServices } from "react-icons/fc";
import { 
  FaCalendarAlt, 
  FaCog, 
  FaHome, 
  FaEdit,
  FaNewspaper,
  FaNotesMedical,
  FaThumbtack,
  FaPlus } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaAd } from "react-icons/fa";
import { PiFolderSimpleUserDuotone } from "react-icons/pi";
import { MdOutlineClear } from "react-icons/md";

// Default sidebar items (always visible)
const defaultItems = [
  { id: 1, icon: <FaHome />, text: "Home", description: "Dashboard overview", path: "/dashboard" },
  { id: 2, icon: <FaCog />, text: "Settings", path: "/settings" },
  { id: 3, icon: <FiHelpCircle />, text: "Help", path: "/help"},
];

// Optional items (can be added via the edit popup)
const optionalItems = [
  { id: 4, icon: <FaCalendarAlt />, text: "Appointments", path:"/booking" },
  { id: 5, icon: <MdProductionQuantityLimits />, text: "Products", path:"/products" },
  { id: 6, icon: <MdOutlineDiscount />, text: "Discounts", path:"/discount" },
  { id: 7, icon: <FcServices />, text: "Services", path:"/services" },
  { id: 8, icon: <HiOutlineSpeakerphone />, text: "Marketing Suite", path:"/marketing" },
  { id: 9, icon: <FaAd />, text: "Social & Ads" },
  { id: 10, icon: <PiFolderSimpleUserDuotone />, text: "Customers", path:"/customer" },
  { id: 11, icon: <IoPeople />, text: "Staff", path:"/staff" },
  { id: 12, icon: <RiShoppingBag4Fill />, text: "Orders", path:"/orders" },
  { id: 13, icon: <SiGoogleanalytics />, text: "Analytics", path:"/analytics" },
];

// App items for the Apps section
const appItems = [
  { id: 'messages', icon: <LuMessagesSquare />, text: "Messages", description: "Chat and notifications" },
  { id: 'projects', icon: <SiCreatereactapp />, text:"Projects", description: "Create website & projects", path:"/apps"},
  { id: 'news', icon: <FaNewspaper />, text:"News", description: "Latest updates" },
  { id: 'notes', icon: <FaNotesMedical />, text:"Notes", description: "Documents and files"},
];

const Sidebar = ({ isOpen }) => {
  // State management
  const [showPopup, setShowPopup] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([defaultItems[0], defaultItems[1], defaultItems[2]]);
  const [showNotification, setShowNotification] = useState(false);
  const [showAppsPopup, setShowAppsPopup] = useState(false);
  const [showAddAppsSubtitle, setShowAddAppsSubtitle] = useState(false);
  const [pinnedApps, setPinnedApps] = useState({
    messages: false,
    projects: false,
    news: false,
    notes: false
  });
  const [downloadedApps, setDownloadedApps] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const navigate = useNavigate();

  // Load saved items from localStorage
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("sidebarItems"));
    const savedPinnedApps = JSON.parse(localStorage.getItem("pinnedApps"));
    const savedDownloadedApps = JSON.parse(localStorage.getItem("downloadedApps"));
    
    if (savedItems) {
      setSidebarItems([defaultItems[0], ...savedItems, defaultItems[1], defaultItems[2]]);
    }
    if (savedPinnedApps) {
      setPinnedApps(savedPinnedApps);
    }
    if (savedDownloadedApps) {
      setDownloadedApps(savedDownloadedApps);
    }
  }, []);

  // Save items to localStorage when they change
  useEffect(() => {
    const optionalItems = sidebarItems.filter((item) => item.id > 3);
    localStorage.setItem("sidebarItems", JSON.stringify(optionalItems));
    localStorage.setItem("pinnedApps", JSON.stringify(pinnedApps));
    localStorage.setItem("downloadedApps", JSON.stringify(downloadedApps));
  }, [sidebarItems, pinnedApps, downloadedApps]);

  // Show welcome notification on dashboard
  useEffect(() => {
    const isOnDashboard = window.location.pathname === "/dashboard";
    if (isOnDashboard) {
      const showTimeoutId = setTimeout(() => {
        setShowNotification(true);
      }, 2000);
      const hideTimeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 8000);
      return () => {
        clearTimeout(showTimeoutId);
        clearTimeout(hideTimeoutId);
      };
    }
  }, []);

  // Toggle optional items in the sidebar
  const handleItemToggle = (id) => {
    if (isDownloading) return; // Disable during download
    
    const item = optionalItems.find((item) => item.id === id);
    if (item) {
      const isItemInSidebar = sidebarItems.some((item) => item.id === id);
      if (isItemInSidebar) {
        setSidebarItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
        setSidebarItems((prevItems) => [
          prevItems[0],
          ...prevItems.slice(1, -2),
          item,
          prevItems[prevItems.length - 2],
          prevItems[prevItems.length - 1],
        ]);
      }
    }
  };

  // Toggle app pin status
  const togglePin = (app) => {
    if (isDownloading) return; // Disable during download
    
    setPinnedApps(prev => ({
      ...prev,
      [app]: !prev[app]
    }));

    // When unpinning, remove from downloaded apps too
    if (pinnedApps[app]) {
      setDownloadedApps(prev => prev.filter(id => id !==app));
    }
  };

  // Download an app with progress simulation
  const handleDownload = (appId) => {
    if (isDownloading) return; // Prevent multiple downloads at once
    
    if (!downloadedApps.includes(appId)) {
      const app = appItems.find(item => item.id === appId);
      
      // Set downloading state
      setIsDownloading(true);
      
      // Show download started notification
      setDownloadProgress({
        appId,
        progress: 0,
        text: `Starting download of ${app.text}...`
      });
      
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const newProgress = prev.progress + Math.floor(Math.random() * 10) + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Add to downloadedApps AND pin it automatically
            setDownloadedApps(prev => [...prev, appId]);
            setPinnedApps(prev => ({ ...prev, [appId]: true })); // Auto-pin
            setTimeout(() => {
              setDownloadProgress(null);
              setIsDownloading(false); // Re-enable buttons after download completes
            }, 1000);
            return {
              ...prev,
              progress: 100,
              text: `${app.text} downloaded successfully!`
            };
          }
          return {
            ...prev,
            progress: newProgress,
            text: `Downloading ${app.text}... ${newProgress}%`
          };
        });
      }, 300);
    }
  };

  // Filter apps
  const pinnedAppItems = appItems.filter(item => pinnedApps[item.id]);
  const availableAppItems = appItems.filter(item => !downloadedApps.includes(item.id));

  // Handle app click navigation
  const handleAppClick = (path) => {
    if (isDownloading) return; // Disable during download
    if (path) {
      navigate(path);
    }
  };

  // Handle Apps section click
  const handleAppsClick = () => {
    if (isDownloading) return; // Disable during download
    setShowAddAppsSubtitle(!showAddAppsSubtitle);
  };

  // Handle Add Apps click
  const handleAddAppsClick = () => {
    if (isDownloading) return; // Disable during download
    setShowAppsPopup(true);
  };

  return (
    <div className={`fixed left-0 top-0 h-screen ${isOpen ? "w-64" : "w-17"} bg-[#6FB434] text-white transition-all duration-300 pt-16 overflow-y-auto`}>
      {/* Header with Tools title and Edit button */}
      <div className="flex items-center justify-between p-4 mt-2">
        <h1 className={`text-2xl font-bold ${!isOpen && "hidden"}`}>Tools</h1>
        <div className="flex items-center gap-4">
          <FaEdit
            className={`cursor-pointer text-xl ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isDownloading && setShowPopup(true)}
            title="Edit Sidebar"
          />
        </div>
      </div>
      
      {/* Main Navigation Items */}
      <nav className="flex flex-col gap-4 p-4">
        <SidebarItem 
          key={defaultItems[0].id} 
          isOpen={isOpen} 
          icon={defaultItems[0].icon} 
          text={defaultItems[0].text}
          path={defaultItems[0].path}
          isDisabled={isDownloading}
        />

        {sidebarItems
          .filter((item) => item.id > 3)
          .map((item) => (
            <SidebarItem 
              key={item.id} 
              isOpen={isOpen} 
              icon={item.icon} 
              text={item.text}
              path={item.path}
              isDisabled={isDownloading}
            />
        ))}

        <SidebarItem 
          key={defaultItems[1].id} 
          isOpen={isOpen} 
          icon={defaultItems[1].icon} 
          text={defaultItems[1].text} 
          path={defaultItems[1].path}
          isDisabled={isDownloading}
        />
        <SidebarItem 
          key={defaultItems[2].id} 
          isOpen={isOpen} 
          icon={defaultItems[2].icon} 
          text={defaultItems[2].text}
          path={defaultItems[2].path} 
          isDisabled={isDownloading}
        />
      </nav>

      {/* Apps Section at the bottom */}
      <div className="border-t border-gray-200 p-4">
        {/* Apps Header */}
        <div className="group">
          <div 
            className={`flex items-center p-2 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={!isDownloading ? handleAppsClick : undefined}
          >
            <TbApps className="w-5 h-5 text-white group-hover:text-[#6FB434]" />
            {isOpen && (
              <span className="text-sm font-medium text-white group-hover:text-[#6FB434] group-hover:font-bold ml-2">
                Apps
              </span>
            )}
          </div>

          {/* Add Apps Subtitle */}
          {showAddAppsSubtitle && isOpen && (
            <div 
              className={`flex items-center p-2 ml-6 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-4 transition-all duration-300 group ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={!isDownloading ? handleAddAppsClick : undefined}
            >
              <FaPlus className="w-4 h-4 text-white/70 group-hover:text-[#6FB434]" />
              <span className="text-xs font-medium text-white/70 group-hover:text-[#6FB434] ml-2">
                Add Apps
              </span>
            </div>
          )}
        </div>

        {/* Pinned Apps Section */}
        {pinnedAppItems.length > 0 && (
          <div className={`mt-2 ${!isOpen && "hidden"}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Pinned Apps
            </h3>
            {pinnedAppItems.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-2 rounded-l-3xl bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 group ${isDownloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={!isDownloading ? () => handleAppClick(item.path) : undefined}
              >
                <div className="flex items-center gap-2">
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 text-white group-hover:text-[#6FB434]`,
                  })}
                  {isOpen && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white group-hover:text-[#6FB434] group-hover:font-bold">
                        {item.text}
                      </span>
                      <span className="text-xs text-white/70 group-hover:text-[#6FB434]/70">
                        {item.description}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDownloading) togglePin(item.id);
                  }}
                  className={`text-yellow-300 hover:text-[#6FB434] ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Unpin"
                  disabled={isDownloading}
                >
                  <FaThumbtack className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Sidebar Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-12 z-50">
          <div className="bg-[#f0f8ff] p-6 rounded-lg shadow-lg w-[90%] md:w-150 max-w-lg mx-auto relative h-[75vh] overflow-auto flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => !isDownloading && setShowPopup(true)}
                className={`px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-700 text-white ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isDownloading}
              >
                <MdOutlineClear />
              </button>
              <button
                onClick={() => !isDownloading && setShowPopup(false)}
                className={`mt-2 px-4 py-2 bg-[#6FB434] text-white rounded-lg hover:bg-green-700 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isDownloading}
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
                    onChange={() => !isDownloading && handleItemToggle(item.id)}
                    className="ml-2"
                    disabled={isDownloading}
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

      {/* Apps Selection Popup */}
      {showAppsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-96 max-w-md mx-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Picked for you </h2>
              <button
                onClick={() => {
                  if (!isDownloading) {
                    setShowAppsPopup(false);
                    setDownloadProgress(null);
                  }
                }}
                className={`text-gray-500 hover:text-red-600 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isDownloading}
              >
                <MdOutlineClear className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {availableAppItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 ${isDownloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={!isDownloading ? () => {
                    handleAppClick(item.path);
                    setShowAppsPopup(false);
                  } : undefined}
                >
                  <div className="flex items-center gap-3">
                    {React.cloneElement(item.icon, {
                      className: "w-5 h-5 text-[#6FB434]",
                    })}
                    <div>
                      <p className="font-medium text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDownloading) handleDownload(item.id);
                    }}
                    className={`text-gray-400 hover:text-[#6FB434] p-1 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isDownloading ? "Download in progress..." : "Download app"}
                    disabled={isDownloading}
                  >
                    <TbDownload className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welcome Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-yellow-200 p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span className="text-gray-800">Please <strong>Edit</strong> the sidebar to customize your experience.</span>
          <button 
            onClick={() => !isDownloading && setShowNotification(false)} 
            className={`text-red-600 hover:text-gray-700 transition-colors duration-300 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isDownloading}
          >
            <MdOutlineClear />
          </button>
        </div>
      )}

      {/* Download Progress Notification */}
      {downloadProgress && (
        <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-2 z-50 w-64">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">{downloadProgress.text}</span>
            {downloadProgress.progress === 100 && (
              <button 
                onClick={() => !isDownloading && setDownloadProgress(null)} 
                className={`text-gray-500 hover:text-gray-700 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isDownloading}
              >
                <MdOutlineClear />
              </button>
            )}
          </div>
          {downloadProgress.progress < 100 ? (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#6FB434] h-2.5 rounded-full" 
                style={{ width: `${downloadProgress.progress}%` }}
              ></div>
            </div>
          ) : (
            <div className="text-green-600 text-sm">App ready to use!</div>
          )}
        </div>
      )}
    </div>
  );
};

// SidebarItem Component
const SidebarItem = ({ isOpen, icon, text, isSelectable = true, onClick, path, isDisabled = false }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (isDisabled) return;
    if (onClick) {
      onClick();
    }
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 group ${
        !isSelectable && "opacity-50 cursor-not-allowed"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={!isDisabled ? handleClick : undefined}
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
};

// Prop Types
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

SidebarItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string,
  isSelectable: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default Sidebar;