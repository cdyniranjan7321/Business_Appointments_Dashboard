import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import template1 from "../assets/template1.png";
import template2 from "../assets/template2.png";
import template3 from "../assets/template 3.jpg";
import template4 from "../assets/template4.png";
import template5 from "../assets/template5.png";
import Hover from "../assets/Hover.webp";
import vantage from "../assets/vantage.webp";
import canopy from "../assets/canopy.webp";
import loft from "../assets/loft.webp";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


const TemplatePreview = ({ template, onClose }) => {
  const navigate = useNavigate();

  const handleCreateWebsite = () => {
    navigate('/builder', { state: { selectedTemplate: template } });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{template.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 mb-4">{template.description}</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => window.open("https://barber-website-xi.vercel.app/", "_blank")}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Template
                </button>
                
                <button
                  onClick={handleCreateWebsite}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Website with this Template
                </button>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Template Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Responsive design</li>
                    <li>Easy customization</li>
                    <li>Modern UI/UX</li>
                    <li>Fast loading</li>
                    <li>SEO optimized</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Apps = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const templateRefs = useRef([]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    const filtered = templates.filter((template) =>
      template.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (templateName) => {
    setSearchInput(templateName);
    setFilteredTemplates([]);
  };

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

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    if (template.name === "Template 2") {
      setShowPreview(true);
    } else {
      alert(`${template.name} was clicked!`);
    }
  };

  const handleCreateWebsite = () => {
    // Here you would typically implement the website creation logic
    // For now, we'll just show an alert and close the preview
    alert(`Creating a new website with ${selectedTemplate.name}`);
    setShowPreview(false);
    
    // In a real app, you might:
    // 1. Create a new project in your database
    // 2. Redirect to a website builder page
    // 3. Initialize the template for editing
  };

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
        } transition-all duration-300 z-10`}
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
                  src={Hover}
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
                className="bg-white rounded-lg shadow-md overflow-hidden mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleTemplateClick(template)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(template);
                    }}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <TemplatePreview
            template={selectedTemplate}
            onClose={() => setShowPreview(false)}
            onCreateWebsite={handleCreateWebsite}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Apps;

TemplatePreview.propTypes = {
  template: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateWebsite: PropTypes.func.isRequired,
};