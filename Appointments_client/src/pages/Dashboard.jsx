import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null); // <-- ADD this state
  const [loadingUserData, setLoadingUserData] = useState(true); // <-- ADD this state
  const [errorUserData, setErrorUserData] = useState(null); // <-- ADD this state
  const navigate = useNavigate(); // <-- ADD this hook

  
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // <-- ADD this useEffect block to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); // Get the token

      if (!userId || !token) {
        // If no user ID or token, redirect to login
        navigate('/login');
        return;
      }

      try {
        setLoadingUserData(true);
        setErrorUserData(null);

        // Fetch user data from your backend
        // Make sure this URL matches your Render backend URL and the new endpoint
        const response = await fetch(`https://business-appointments-dashboard-klvo.onrender.com/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- IMPORTANT: Include the JWT token
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        setUserData(data.user); // Assuming your API returns user data in `data.user`
      } catch (err) {
        setErrorUserData(err.message);
        console.error("Error fetching user data:", err);
        // Optionally clear local storage and redirect to login on fetch error
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('isVerified');
        localStorage.removeItem('businessName'); // clear if you stored it
        navigate('/login');
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [navigate]); // navigate is a dependency of useEffect

  // <-- ADD conditional rendering for loading and error states
  if (loadingUserData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading dashboard...
      </div>
    );
  }

  if (errorUserData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {errorUserData}. Please try logging in again.
      </div>
    );
  }

  // Render the dashboard with user-specific data (only if userData is available)
  return (
    <div className="flex h-screen">

      {/* Sidebar - PASS userData prop */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userData={userData} />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>

        {/* Header - PASS userData prop */}
        <Navbar toggleSidebar={toggleSidebar} userData={userData} />

        {/* Dashboard Content */}
        <div className="p-6 pt-16">
          {/* Display user's name or business name from userData */}
          <h2 className="text-2xl font-bold">Welcome, {userData?.businessName || userData?.name || 'User'}!</h2>
          <p className="mt-2 text-gray-700">Here is your personalized dashboard content.</p>

          {/* Example of displaying other user-specific data */}
          {userData && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold">Your Business Details:</h3>
              <p>Email: {userData.emailOrPhone}</p>
              {/* Add more fields here from userData that you want to display */}
              {userData.someCustomField && (
                <p>Custom Info: {userData.someCustomField}</p>
              )}
            </div>
          )}

          {/* Placeholder for other dynamic dashboard components */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="font-semibold text-lg">Appointments Overview</h3>
              <p className="text-gray-600">You have X appointments scheduled this week.</p>
              {/* Fetch and display user's actual appointment count */}
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="font-semibold text-lg">Recent Orders</h3>
              <p className="text-gray-600">Last order: Order #1234 on June 15.</p>
              {/* Fetch and display user's actual recent orders */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add PropTypes for userData if you are using prop-types globally
// Dashboard.propTypes = {
// No direct props here, but if you add them later
// };
