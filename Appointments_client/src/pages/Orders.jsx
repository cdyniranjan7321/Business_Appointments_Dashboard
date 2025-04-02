
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion for animations
import Sidebar from "../components/Sidebar"; // Import your Sidebar component
import Navbar from "../components/Navbar"; // Import your Navbar component
import template1 from "../assets/template1.png";
import template2 from "../assets/template2.png";
import template3 from "../assets/template 3.jpg";
import template4 from "../assets/template4.png";
import template5 from "../assets/template5.png";
import Hover from "../assets/Hover.webp";
import vantage from "../assets/vantage.webp";
import canopy from "../assets/canopy.webp";
import loft from "../assets/loft.webp";

const Orders = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close
  const [searchInput, setSearchInput] = useState(""); // State to manage search input
  const [filteredTemplates, setFilteredTemplates] = useState([]); // State to manage filtered templates
  const templateRefs = useRef([]); // Refs to manage template sections

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Filter templates based on search input
    const filtered = templates.filter((template) =>
      template.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

  // Function to handle template selection from the search list
  const handleTemplateSelect = (templateName) => {
    setSearchInput(templateName); // Set the search input to the selected template name
    setFilteredTemplates([]);  // Clear the filtered templates lists.
  };

  // Function to handle search button click
  const handleSearchButtonClick = () => {
    if (searchInput) {
      const selectedTemplate = templates.find(
        (template) => template.name.toLowerCase() === searchInput.toLowerCase()
      );
      if (selectedTemplate) {
        const templateIndex = templates.findIndex(
          (template) => template.name === selectedTemplate.name
        );
        if (templateIndex !== -1) {
          templateRefs.current[templateIndex].scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };


  // Template data
  const templates = [
    { name: "Template 1", image: template1, description: "A clean and modern template for business websites." },
    { name: "Template 2", image: template2, description: "A creative and modern template for barber business websites." },
    { name: "Template 3", image: template3, description: "A versatile template for e-commerce and online stores." },
    { name: "Template 4", image: template4, description: "A creative template for portfolios and personal websites." },
    { name: "Template 5", image: template5, description: "A creative template for portfolios and personal websites." },
    { name: "vantage", image: vantage, description: "A versatile template for e-commerce and online stores." },
    { name: "canopy", image: canopy, description: "A versatile template for e-commerce and online stores." },
    { name: "loft", image: loft, description: "A versatile template for e-commerce and online stores." },
  ];

  // Animation variants for the filtered templates list
  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
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
            <div className="flex-1 relative">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-14">
                Professional Themes & Website Templates for any project
              </h1>
              <p className="text-gray-600 mb-6">
                Discover thousands of easy to customize themes, templates & CMS products, made by world-class developers.
              </p>
              {/* Search Bar */}
              <div className="flex items-center bg-white rounded-lg shadow-md p-4 relative">
                <input
                  type="text"
                  placeholder="Search for templates..."
                  className="flex-1 p-2 outline-none"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <button
                  className="bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={handleSearchButtonClick}
                >
                  Search
                </button>
              </div>
              {/* White Popup for Search Results */}
              <AnimatePresence>
                {searchInput && filteredTemplates.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 bg-slate-200 rounded-lg shadow-lg mt-2 z-20"
                    variants={popupVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {filteredTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-green-200 cursor-pointer"
                        onClick={() => handleTemplateSelect(template.name)}
                      >
                        {template.name}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
            {templates.map((template, index) => (
              <div
                key={index}
                ref={(el) => (templateRefs.current[index] = el)}
                className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{template.name}</h2>
                  <p className="text-gray-600 mt-2">{template.description}</p>
                  <button
                    className="mt-4 bg-green-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                    onClick={() => alert(`${template.name} selected!`)}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;