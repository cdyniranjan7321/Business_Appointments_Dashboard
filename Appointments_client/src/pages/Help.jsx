import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Help() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // FAQ state
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create a new appointment?",
      answer: "Navigate to the Appointments section and click the 'New Appointment' button. Fill in the details and save."
    },
    {
      question: "How can I manage my products?",
      answer: "Go to the Products section where you can add, edit, or remove products from your inventory."
    },
    {
      question: "Where can I see my business analytics?",
      answer: "The Analytics section provides detailed reports about your business performance."
    },
    {
      question: "How do I change my account settings?",
      answer: "Account settings can be modified in the Settings section accessible from the sidebar."
    },
    {
      question: "What payment methods are supported?",
      answer: "We currently support credit cards, PayPal, and bank transfers for premium features."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Help Content */}
        <div className="p-6 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Help Center</h2>
            
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FB434]"
                />
                <button className="absolute right-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6FB434] flex justify-between items-center"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeIndex === index && (
                      <div className="px-4 py-3 bg-white">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found for your search.</p>
                </div>
              )}
            </div>

            {/* Contact Support Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Email Support</h4>
                  <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                  <a 
                    href="mailto:support@businessapp.com" 
                    className="inline-block px-4 py-2 bg-[#6FB434] text-white rounded-md hover:bg-green-700"
                  >
                    Email Us
                  </a>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Live Chat</h4>
                  <p className="text-gray-600 mb-4">Chat with our support team in real-time during business hours.</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => alert('Live chat would open here')}
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="#" 
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => { e.preventDefault(); alert('Video tutorials would open here'); }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Video Tutorials</span>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => { e.preventDefault(); alert('User guide would open here'); }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">User Guide</span>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => { e.preventDefault(); alert('Community forum would open here'); }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <span className="font-medium">Community Forum</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}