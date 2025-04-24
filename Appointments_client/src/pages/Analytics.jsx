
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data - in a real app, this would come from an API
  const analyticsData = {
    dailySales: 12450,
    totalOrders: 342,
    ordersFulfilled: 298,
    returningCustomers: 127,
    totalSales: 187230,
    salesBreakdown: [
      { category: 'Electronics', value: 45, color: 'bg-blue-500' },
      { category: 'Clothing', value: 30, color: 'bg-green-500' },
      { category: 'Home Goods', value: 15, color: 'bg-yellow-500' },
      { category: 'Other', value: 10, color: 'bg-purple-500' },
    ],
    topLocations: [
      { city: 'Nepal', orders: 142, growth: 12 },
      { city: 'New York', orders: 98, growth: 8 },
      { city: 'Chicago', orders: 76, growth: 5 },
      { city: 'Australia', orders: 54, growth: 3 },
    ],
    topPages: [
      { page: '/products/electronics', visits: 1240, change: 15 },
      { page: '/', visits: 980, change: -2 },
      { page: '/products/clothing', visits: 760, change: 8 },
      { page: '/about', visits: 430, change: 4 },
    ],
  };

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500 mb-6">Overview of your business performance</p>
      </motion.div>
      
      {/* Summary Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Daily Sales */}
        <motion.div variants={item} className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Daily Sales</h3>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-4">रू {analyticsData.dailySales.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-500 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs yesterday</span>
            </div>
          </div>
        </motion.div>
        
        {/* Total Orders */}
        <motion.div variants={item} className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-4">{analyticsData.totalOrders}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-500 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                8%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last week</span>
            </div>
          </div>
        </motion.div>
        
        {/* Orders Fulfilled */}
        <motion.div variants={item} className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Orders Fulfilled</h3>
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-4">{analyticsData.ordersFulfilled}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((analyticsData.ordersFulfilled / analyticsData.totalOrders) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-2 rounded-full bg-indigo-500"
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">{Math.round((analyticsData.ordersFulfilled / analyticsData.totalOrders) * 100)}% fulfillment rate</p>
            </div>
          </div>
        </motion.div>
        
        {/* Returning Customers */}
        <motion.div variants={item} className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-4">{analyticsData.returningCustomers}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-500 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                15%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-medium">Total Sales</h3>
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">This Month</span>
          </div>
          <p className="text-4xl font-bold text-indigo-600">रू {analyticsData.totalSales.toLocaleString()}</p>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Target</span>
              <span>रू {(analyticsData.totalSales / 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300"
              />
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">75% of target</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Daily Sales</p>
                <p className="font-medium">रू {(analyticsData.totalSales / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Best Day</p>
                <p className="font-medium">रू {(analyticsData.dailySales * 1.5).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Refunds</p>
                <p className="font-medium">रू {(analyticsData.totalSales * 0.03).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Sales Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
        >
          <h3 className="text-gray-800 font-medium mb-6">Sales Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {analyticsData.salesBreakdown.map((category, index) => (
                <div key={index} className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm font-medium text-gray-700">{category.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${category.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className={`h-2 rounded-full ${category.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {analyticsData.salesBreakdown.map((category, index) => {
                  const circumference = 2 * Math.PI * 40;
                  const strokeDashoffset = circumference - (category.value / 100) * circumference;
                  const rotate = index === 0 ? 0 : 
                                index === 1 ? 90 : 
                                index === 2 ? 180 : 270;
                  return (
                    <svg key={index} className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                      <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        cx="50%"
                        cy="50%"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="16"
                        strokeDasharray={circumference}
                        className={`text-gray-100 ${category.color.replace('bg', 'text')}`}
                        style={{ transform: `rotate(${rotate}deg)` }}
                      />
                    </svg>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-800">
                    रू {analyticsData.totalSales.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">Total Sales</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Locations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-medium">Top Selling Locations</h3>
            <button className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topLocations.map((location, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mr-3 
                  ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                    index === 1 ? 'bg-green-100 text-green-600' : 
                    index === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'}`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{location.city}</p>
                  <p className="text-gray-500 text-sm">{location.orders} orders</p>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-2 ${
                    location.growth > 5 ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {location.growth}%
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${location.growth > 5 ? 'text-green-500' : 'text-yellow-500'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Top Landing Pages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-medium">Top Landing Pages</h3>
            <button className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className={`w-10 h-10 flex items-center justify-center rounded-full font-medium mr-3 
                  ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                    index === 1 ? 'bg-green-100 text-green-600' : 
                    index === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'}`}>
                  {index + 1}
                </span>
                <div className="flex-1 truncate">
                  <p className="text-gray-800 font-medium truncate">{page.page}</p>
                  <p className="text-gray-500 text-sm">{page.visits} visits</p>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-2 ${
                    page.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {page.change > 0 ? `+${page.change}` : page.change}%
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${page.change > 0 ? 'text-green-500' : 'text-red-500'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={page.change > 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;