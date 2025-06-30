import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbApps, TbDownload } from "react-icons/tb";
import { LuMessagesSquare } from "react-icons/lu";
import { SiCreatereactapp } from "react-icons/si";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { MdProductionQuantityLimits } from "react-icons/md";
import { MdOutlineDiscount } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
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
import PropTypes from "prop-types";

// Default items (always shown for new users)
const defaultItems = [
  { id: 1, icon: <FaHome />, text: "Home", path: "/dashboard" },
  { id: 2, icon: <FaCog />, text: "Settings", path: "/settings" },
  { id: 3, icon: <FiHelpCircle />, text: "Help", path: "/help" },
];

// Optional items (can be added by user)
const optionalItems = [
  { id: 4, icon: <FaCalendarAlt />, text: "Appointments", path: "/booking" },
  { id: 5, icon: <MdProductionQuantityLimits />, text: "Products", path: "/products" },
  { id: 6, icon: <MdOutlineDiscount />, text: "Discounts", path: "/discount" },
  { id: 7, icon: <FcServices />, text: "Services", path: "/services" },
  { id: 8, icon: <HiOutlineSpeakerphone />, text: "Marketing Suite", path: "/marketing" },
  { id: 9, icon: <FaAd />, text: "Social & Ads", path: "/social" },
  { id: 10, icon: <PiFolderSimpleUserDuotone />, text: "Customers", path: "/customer" },
  { id: 11, icon: <IoPeople />, text: "Staff", path: "/staff" },
  { id: 12, icon: <RiShoppingBag4Fill />, text: "Orders", path: "/orders" },
  { id: 13, icon: <SiGoogleanalytics />, text: "Analytics", path: "/analytics" },
];

// App items for the Apps section
const appItems = [
  { id: 'messages', icon: <LuMessagesSquare />, text: "Messages", path: "/messages" },
  { id: 'projects', icon: <SiCreatereactapp />, text: "Projects", path: "/projects" },
  { id: 'news', icon: <FaNewspaper />, text: "News", path: "/news" },
  { id: 'notes', icon: <FaNotesMedical />, text: "Notes", path: "/notes" },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  
  // State management
  const [sidebarItems, setSidebarItems] = useState([...defaultItems]);
  const [pinnedApps, setPinnedApps] = useState({});
  const [downloadedApps, setDownloadedApps] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAppsPopup, setShowAppsPopup] = useState(false);
  const [showAddAppsSubtitle, setShowAddAppsSubtitle] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [tempSidebarSelections, setTempSidebarSelections] = useState([]);

  // Load preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Combine default items with user's selected items
          const userSelectedItems = optionalItems.filter(item => 
            data.navigation?.includes(item.id)
          );
          
          setSidebarItems([...defaultItems, ...userSelectedItems]);
          setPinnedApps(data.pinnedApps || {});
          setDownloadedApps(
            Object.keys(data.pinnedApps || {}).filter(app => data.pinnedApps[app])
          );
        } else {
          // For new users, just show default items
          setSidebarItems([...defaultItems]);
          setPinnedApps({});
          setDownloadedApps([]);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to backend and localStorage
  const savePreferences = async (selectedIds) => {
    try {
      // Filter out default items (always included)
      const userSelectedIds = selectedIds.filter(id => id > 3);
      
      // Update local state
      const userSelectedItems = optionalItems.filter(item => 
        userSelectedIds.includes(item.id)
      );
      setSidebarItems([...defaultItems, ...userSelectedItems]);

      // Save to localStorage
      localStorage.setItem('navigation', JSON.stringify(userSelectedIds));
      localStorage.setItem('pinnedApps', JSON.stringify(pinnedApps));

      // Save to backend
      await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          navigation: userSelectedIds,
          pinnedApps: pinnedApps
        })
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Toggle app pin status
  const togglePin = (app) => {
    if (isDownloading) return;
    
    const newPinnedApps = { ...pinnedApps, [app]: !pinnedApps[app] };
    setPinnedApps(newPinnedApps);
    
    // Save preferences
    const selectedIds = sidebarItems.map(item => item.id);
    savePreferences(selectedIds);
  };

  // Download an app
  const handleDownload = (appId) => {
    if (isDownloading || downloadedApps.includes(appId)) return;
    
    const app = appItems.find(item => item.id === appId);
    
    setIsDownloading(true);
    setDownloadProgress({
      appId,
      progress: 0,
      text: `Starting download of ${app.text}...`
    });
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev.progress + Math.floor(Math.random() * 10) + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Auto-pin downloaded app
          const newPinnedApps = { ...pinnedApps, [appId]: true };
          setPinnedApps(newPinnedApps);
          setDownloadedApps(prev => [...prev, appId]);
          
          // Save preferences
          const selectedIds = sidebarItems.map(item => item.id);
          savePreferences(selectedIds);
          
          setTimeout(() => {
            setDownloadProgress(null);
            setIsDownloading(false);
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
  };

  // Filter apps
  const pinnedAppItems = appItems.filter(item => pinnedApps[item.id]);
  const availableAppItems = appItems.filter(item => !downloadedApps.includes(item.id));

  return (
    <div className={`fixed left-0 top-0 h-screen ${isOpen ? "w-64" : "w-17"} bg-[#6FB434] text-white transition-all duration-300 pt-16 overflow-y-auto`}>
      {/* Header with Tools title and Edit button */}
      <div className="flex items-center justify-between p-4 mt-2">
        <h1 className={`text-2xl font-bold ${!isOpen && "hidden"}`}>Tools</h1>
        <div className="flex items-center gap-4">
          <FaEdit
            className={`cursor-pointer text-xl ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (!isDownloading) {
                setTempSidebarSelections(sidebarItems.map(item => item.id));
                setShowPopup(true);
              }
            }}
            title="Edit Sidebar"
          />
        </div>
      </div>
      
      {/* Main Navigation Items */}
      <nav className="flex flex-col gap-4 p-4">
        {sidebarItems.map((item) => (
          <SidebarItem 
            key={item.id} 
            isOpen={isOpen} 
            icon={item.icon} 
            text={item.text}
            path={item.path}
            isDisabled={isDownloading}
            onClick={() => !isDownloading && navigate(item.path)}
          />
        ))}
      </nav>

      {/* Apps Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="group">
          <div 
            className={`flex items-center p-2 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isDownloading && setShowAddAppsSubtitle(!showAddAppsSubtitle)}
          >
            <TbApps className="w-5 h-5 text-white group-hover:text-[#6FB434]" />
            {isOpen && (
              <span className="text-sm font-medium text-white group-hover:text-[#6FB434] group-hover:font-bold ml-2">
                Apps
              </span>
            )}
          </div>

          {showAddAppsSubtitle && isOpen && (
            <div 
              className={`flex items-center p-2 ml-6 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-4 transition-all duration-300 group ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isDownloading && setShowAppsPopup(true)}
            >
              <FaPlus className="w-4 h-4 text-white/70 group-hover:text-[#6FB434]" />
              <span className="text-xs font-medium text-white/70 group-hover:text-[#6FB434] ml-2">
                Add Apps
              </span>
            </div>
          )}
        </div>

        {/* Pinned Apps */}
        {pinnedAppItems.length > 0 && isOpen && (
          <div className="mt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Pinned Apps
            </h3>
            {pinnedAppItems.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-2 rounded-l-3xl bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 group ${isDownloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !isDownloading && navigate(item.path)}
              >
                <div className="flex items-center gap-2">
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 text-white group-hover:text-[#6FB434]`,
                  })}
                  <span className="text-sm font-medium text-white group-hover:text-[#6FB434] group-hover:font-bold">
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    !isDownloading && togglePin(item.id);
                  }}
                  className={`text-yellow-300 hover:text-[#6FB434] ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Unpin"
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
                onClick={() => !isDownloading && setShowPopup(false)}
                className={`mt-2 px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-700 text-white ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdOutlineClear />
              </button>
              <button
                onClick={() => {
                  if (!isDownloading) {
                    savePreferences(tempSidebarSelections);
                    setShowPopup(false);
                  }
                }}
                className={`mt-2 px-4 py-2 bg-[#6FB434] text-white rounded-lg hover:bg-green-700 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Save
              </button>
            </div>
            <h2 className="text-xl font-bold text-left mb-4 text-black">Edit Navigation</h2>
            <div className="flex-grow overflow-y-auto">
              <h3 className="font-bold text-black mb-2">Default Items</h3>
              {defaultItems.map((item) => (
                <div key={item.id} className="flex items-center p-2 text-black">
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </div>
              ))}
              
              <h3 className="font-bold text-black mt-4 mb-2">Optional Items</h3>
              {optionalItems.map((item) => (
                <label key={item.id} className="flex justify-between items-center p-2 border-b border-gray-700">
                  <div className="flex items-center gap-2 text-black">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempSidebarSelections.includes(item.id)}
                    onChange={() => {
                      if (!isDownloading) {
                        setTempSidebarSelections(prev => 
                          prev.includes(item.id) 
                            ? prev.filter(id => id !== item.id)
                            : [...prev, item.id]
                        );
                      }
                    }}
                    className="ml-2"
                    disabled={isDownloading}
                  />
                </label>
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
              <h2 className="text-xl font-bold text-gray-800">Available Apps</h2>
              <button
                onClick={() => !isDownloading && setShowAppsPopup(false)}
                className={`text-gray-500 hover:text-red-600 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdOutlineClear className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {availableAppItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 ${isDownloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => !isDownloading && navigate(item.path)}
                >
                  <div className="flex items-center gap-3">
                    {React.cloneElement(item.icon, {
                      className: "w-5 h-5 text-[#6FB434]",
                    })}
                    <div>
                      <p className="font-medium text-gray-800">{item.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      !isDownloading && handleDownload(item.id);
                    }}
                    className={`text-gray-400 hover:text-[#6FB434] p-1 ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Download app"
                  >
                    <TbDownload className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Notification */}
      {downloadProgress && (
        <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-2 z-50 w-64">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">{downloadProgress.text}</span>
            {downloadProgress.progress === 100 && (
              <button 
                onClick={() => setDownloadProgress(null)} 
                className="text-gray-500 hover:text-gray-700"
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
            <div className="text-green-600 text-sm">Ready to use!</div>
          )}
        </div>
      )}
    </div>
  );
};

// SidebarItem Component
const SidebarItem = ({ isOpen, icon, text, isSelectable = true, onClick, path, isDisabled = false }) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-l-3xl cursor-pointer bg-transparent hover:bg-[#f0f8ff] hover:ml-2 transition-all duration-300 group ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
    >
      {React.cloneElement(icon, {
        className: `w-5 h-5 text-white group-hover:text-[#6FB434]`,
      })}
      {isOpen && (
        <span className="text-sm font-medium text-white group-hover:text-[#6FB434] group-hover:font-bold">
          {text}
        </span>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

SidebarItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  isSelectable: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default Sidebar;