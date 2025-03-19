import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import your Sidebar component
import Navbar from "../components/Navbar"; // Import your Navbar component

const Apps = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Fixed position */}
      <div
        className={`fixed h-screen ${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        {/* Navbar - Fixed position */}
        <div className="fixed w-full z-10">
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Website Template Section */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-200 mt-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Please select Website Templates
          </h1>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10">
              <img
                src="https://via.placeholder.com/400x200" // Replace with your template image
                alt="Template 1"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 1</h2>
                <p className="text-gray-600 mt-2">
                  A clean and modern template for business websites.
                </p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => alert("Template 1 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10">
              <img
                src="https://via.placeholder.com/400x200" // Replace with your template image
                alt="Template 2"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 2</h2>
                <p className="text-gray-600 mt-2">
                  A creative template for portfolios and personal websites.
                </p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => alert("Template 2 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10">
              <img
                src="https://via.placeholder.com/400x200" // Replace with your template image
                alt="Template 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 3</h2>
                <p className="text-gray-600 mt-2">
                  A versatile template for e-commerce and online stores.
                </p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => alert("Template 3 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;