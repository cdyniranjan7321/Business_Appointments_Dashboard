import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Form state
  const [formData, setFormData] = useState({
    businessName: "My Business",
    email: "contact@mybusiness.com",
    notifications: true,
    darkMode: false,
    timezone: "UTC+0",
    language: "English"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Settings Content */}
        <div className="p-6 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FB434]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FB434]"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#6FB434] focus:ring-[#6FB434] border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                      Enable Email Notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#6FB434] focus:ring-[#6FB434] border-gray-300 rounded"
                    />
                    <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                      Dark Mode
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FB434]"
                    >
                      <option value="UTC+0">UTC+0 (Nepal)</option>
                      <option value="UTC+0">UTC+0 (London)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                      <option value="UTC+1">UTC+1 (Paris)</option>
                      <option value="UTC+8">UTC+8 (Singapore)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FB434]"
                    >
                      <option value="English">English</option>
                      <option value="Nepali">Nepali</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Account</h3>
                
                <div className="space-y-4">
                  <div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6FB434] text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}