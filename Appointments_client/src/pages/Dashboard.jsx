import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [errorUserData, setErrorUserData] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Animation states
  const [contentLoaded, setContentLoaded] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    // Check if user came from signup flow
    if (location.state?.fromSignup) {
      setIsNewUser(true);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }

    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        navigate('/login');
        return;
      }

      try {
        setLoadingUserData(true);
        setErrorUserData(null);

        const response = await fetch(`https://business-appointments-dashboard-klvo.onrender.com/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        setUserData(data.user);
        setTimeout(() => setContentLoaded(true), 100);
        setTimeout(() => setStatsLoaded(true), 300);
      } catch (err) {
        setErrorUserData(err.message);
        console.error("Error fetching user data:", err);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('isVerified');
        localStorage.removeItem('businessName');
        navigate('/login');
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [navigate, location.state]);

  if (loadingUserData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700 animate-pulse">Loading your dashboard...</h2>
          <p className="text-gray-500 mt-2">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  if (errorUserData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-700 mb-4">{errorUserData}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Mock stats data - replace with your actual data
  const stats = [
    { name: 'Total Appointments', value: isNewUser ? 0 : 24, change: isNewUser ? '0%' : '+12%', changeType: isNewUser ? 'neutral' : 'positive' },
    { name: 'New Customers', value: isNewUser ? 1 : 8, change: isNewUser ? '+100%' : '+5%', changeType: 'positive' },
    { name: 'Revenue', value: isNewUser ? 'रु 0' : 'रु 4,230', change: isNewUser ? '0%' : '-2%', changeType: isNewUser ? 'neutral' : 'negative' },
    { name: 'Satisfaction', value: isNewUser ? '--' : '92%', change: isNewUser ? '--' : '+3%', changeType: isNewUser ? 'neutral' : 'positive' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userData={userData} />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} userData={userData} />

        {/* Dashboard Content */}
        <div className="p-6 pt-16 overflow-y-auto h-full">
          {/* Welcome Section */}
          <div className={`transition-all duration-500 transform ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl font-bold text-gray-800">
              {isNewUser ? (
                <>
                  Welcome, <span className="text-blue-600">{userData?.businessName || userData?.name || 'User'}</span>! 👋
                  <p className="mt-2 text-lg text-gray-600">We're thrilled to have you on board!</p>
                </>
              ) : (
                <>
                  Welcome back, <span className="text-blue-600">{userData?.businessName || userData?.name || 'User'}</span>!
                  <p className="mt-2 text-gray-600">Here's what's happening with your business today.</p>
                </>
              )}
            </h2>
            
            {isNewUser && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Get started with your dashboard</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>• Set up your business profile</p>
                      <p>• Add your services and availability</p>
                      <p>• Invite your first clients</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className={`mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 transition-all duration-700 delay-100 ${statsLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {stats.map((stat, index) => (
              <div 
                key={stat.name}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  {stat.change !== '--' && (
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  )}
                </div>
                {stat.name !== 'Satisfaction' && (
                  <div className="mt-4">
                    <div className={`h-2 rounded-full overflow-hidden ${
                      stat.changeType === 'positive' ? 'bg-green-100' : 
                      stat.changeType === 'negative' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <div 
                        className={`h-full ${
                          stat.changeType === 'positive' ? 'bg-green-500' : 
                          stat.changeType === 'negative' ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(parseInt(stat.change)))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New User Guide or Recent Activity */}
          {isNewUser ? (
            <div className={`mt-8 bg-white rounded-xl shadow-sm p-6 transition-all duration-500 delay-200 ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Complete Profile</h4>
                  <p className="mt-1 text-sm text-gray-600">Add your business details to get started</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Add Services</h4>
                  <p className="mt-1 text-sm text-gray-600">Create your service offerings</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Set Availability</h4>
                  <p className="mt-1 text-sm text-gray-600">Define when you're available for appointments</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`mt-8 bg-white rounded-xl shadow-sm p-6 transition-all duration-500 delay-200 ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">View all</button>
              </div>
              
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">New appointment scheduled</p>
                      <p className="text-sm text-gray-500">Customer #{item} booked a session for tomorrow</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`mt-8 grid gap-4 grid-cols-2 md:grid-cols-4 transition-all duration-500 delay-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex flex-col items-center">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">New Appointment</span>
            </button>
            
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-green-50 hover:border-green-200 transition-all duration-200 flex flex-col items-center">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Add Client</span>
            </button>
            
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 flex flex-col items-center">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Reports</span>
            </button>
            
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-yellow-50 hover:border-yellow-200 transition-all duration-200 flex flex-col items-center">
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}