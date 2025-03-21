
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

     {/* Main Content */}
     <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <div className="p-6 pt-16">
          <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
          <p className="mt-2 text-gray-700">Here is your main content.</p>
        </div>
      </div>
    </div>
  );
}
