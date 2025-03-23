

import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import your Sidebar component
import Navbar from "../components/Navbar"; // Import your Navbar component
import template1 from "../assets/template1.png";
import template2 from "../assets/template2.png"
import template3 from "../assets/template 3.jpg";
import template4 from "../assets/template4.png";
import template5 from "../assets/template5.png";
import Hover from  "../assets/Hover.webp";
import vantage from "../assets/vantage.webp";
import canopy from "../assets/canopy.webp";
import loft from "../assets/loft.webp"


const Apps = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex full-screen">
      {/* Sidebar - Fixed position */}
      <div
        className={`fixed h-screen ${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300 z-10`}  // Add z-10 to ensure sidebar is above main content
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
        <div className="flex-1 p-10 overflow-y-auto">
          {/* New Content: Professional WordPress Themes & Search Bar */}
          <div className="flex flex-col md:flex-row gap-8 mt-10">
            {/* Left Side: Text and Search Bar */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-14">
                Professional Themes & Website Templates for any project
              </h1>
              <p className="text-gray-600 mb-6">
                Discover thousands of easy to customize themes, templates & CMS products, made by world-class developers.
              </p>
              {/* Search Bar */}
              <div className="flex items-center bg-white rounded-lg shadow-md p-4">
                <input
                  type="text"
                  placeholder="Search for templates..."
                  className="flex-1 p-2 outline-none"
                />
                <button className="bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400">
                  Search
                </button>
              </div>
            </div>

            {/* Right Side: Hero Section */}
            <div className="flex-2 mt-2">
              <div className= "bg-white rounded-lg shadow-md overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <img
                  src={Hover} // Replace with your hero image
                  alt="Hero Section"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-xl font-semibold text-white">Hero Section</h2>
                    <p className="text-gray-200 mt-2">
                      This is a hero section where you can showcase a featured template or any other important content.
                    </p>
                    <button
                      className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                      onClick={() => alert("Hero Section Clicked!")}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-8">
            Please select Website Templates
          </h1>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={template1} // Replace with your template image
                alt="Template 1"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 1</h2>
                <p className="text-gray-600 mt-2">
                  A clean and modern template for business websites.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 1 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={template2} // Replace with your template image
                alt="Template 2"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 2</h2>
                <p className="text-gray-600 mt-2">
                  A creative and modern template for barber business websites.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 2 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={template3} // Replace with your template image
                alt="Template 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 3</h2>
                <p className="text-gray-600 mt-2">
                  A versatile template for e-commerce and online stores.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 3 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={template4} // Replace with your template image
                alt="Template 4"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 4</h2>
                <p className="text-gray-600 mt-2">
                  A creative template for portfolios and personal websites.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 4 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

            {/* Template 5 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={template5} // Replace with your template image
                alt="Template 5"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">Template 5</h2>
                <p className="text-gray-600 mt-2">
                  A creative template for portfolios and personal websites.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 5 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>


            {/* Template 6 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={vantage} // Replace with your template image
                alt="vantage"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">vantage</h2>
                <p className="text-gray-600 mt-2">
                A versatile template for e-commerce and online stores.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 2 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>

             {/* Template 7 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={canopy} // Replace with your template image
                alt="canopy"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">canopy</h2>
                <p className="text-gray-600 mt-2">
                  A versatile template for e-commerce and online stores.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => alert("Template 3 selected!")}
                >
                  Use This Template
                </button>
              </div>
            </div>


             {/* Template 8 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={loft} // Replace with your template image
                alt="loft"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">loft</h2>
                <p className="text-gray-600 mt-2">
                  A versatile template for e-commerce and online stores.
                </p>
                <button
                  className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
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