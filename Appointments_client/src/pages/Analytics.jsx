import React from 'react';

const Analytics = () => {
  // Sample data - in a real app, this would come from an API
  const analyticsData = {
    dailySales: 12450,
    totalOrders: 342,
    ordersFulfilled: 298,
    returningCustomers: 127,
    totalSales: 187230,
    salesBreakdown: [
      { category: 'Electronics', value: 45 },
      { category: 'Clothing', value: 30 },
      { category: 'Home Goods', value: 15 },
      { category: 'Other', value: 10 },
    ],
    topLocations: [
      { city: 'Nepal', orders: 142 },
      { city: 'China', orders: 98 },
      { city: 'New York', orders: 76 },
      { city: 'Australia', orders: 54 },
    ],
    topPages: [
      { page: '/products/electronics', visits: 1240 },
      { page: '/', visits: 980 },
      { page: '/products/clothing', visits: 760 },
      { page: '/about', visits: 430 },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Daily Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Daily Sales</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">${analyticsData.dailySales.toLocaleString()}</p>
          <p className="text-green-500 text-sm mt-1">↑ 12% from yesterday</p>
        </div>
        
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{analyticsData.totalOrders}</p>
          <p className="text-green-500 text-sm mt-1">↑ 8% from last week</p>
        </div>
        
        {/* Orders Fulfilled */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Orders Fulfilled</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{analyticsData.ordersFulfilled}</p>
          <p className="text-gray-500 text-sm mt-1">{Math.round((analyticsData.ordersFulfilled / analyticsData.totalOrders) * 100)}% fulfillment rate</p>
        </div>
        
        {/* Returning Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{analyticsData.returningCustomers}</p>
          <p className="text-green-500 text-sm mt-1">↑ 15% from last month</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-gray-800 font-medium mb-4">Total Sales</h3>
          <p className="text-4xl font-bold text-indigo-600">${analyticsData.totalSales.toLocaleString()}</p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">75% of monthly target</p>
        </div>
        
        {/* Sales Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-gray-800 font-medium mb-4">Sales Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {analyticsData.salesBreakdown.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-medium text-gray-700">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`} 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Locations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-medium mb-4">Top Selling Locations</h3>
          <div className="space-y-4">
            {analyticsData.topLocations.map((location, index) => (
              <div key={index} className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full font-medium mr-3">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{location.city}</p>
                  <p className="text-gray-500 text-sm">{location.orders} orders</p>
                </div>
                <span className="text-gray-800 font-medium">{Math.round((location.orders / analyticsData.totalOrders) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Landing Pages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-medium mb-4">Top Landing Pages</h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full font-medium mr-3">
                  {index + 1}
                </span>
                <div className="flex-1 truncate">
                  <p className="text-gray-800 font-medium truncate">{page.page}</p>
                  <p className="text-gray-500 text-sm">{page.visits} visits</p>
                </div>
                <span className="text-gray-800 font-medium">
                  {Math.round((page.visits / analyticsData.topPages.reduce((acc, curr) => acc + curr.visits, 0)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;