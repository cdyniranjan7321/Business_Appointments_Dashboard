
import { useState } from 'react';
import { FiMoreHorizontal, FiDownload, FiUpload, FiPlus, FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';

const ProductPages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Max & Molly Smart ID Cat Collar - Cherry Bloom',
      status: 'active',
      inventory: 0,
      salesChannels: 6,
      markets: 2,
      category: 'Pet Collars & Harnesses',
      type: 'Clothing',
      photo: 'https://example.com/cat-collar.jpg'
    },
    {
      id: 2,
      name: 'Max & Molly Bandana for Cats & Dogs - Donuts',
      status: 'active',
      inventory: 344,
      salesChannels: 6,
      markets: 2,
      category: 'Pet Apparel',
      type: 'Clothing',
      photo: 'https://example.com/bandana.jpg'
    },
    {
      id: 3,
      name: 'Fellway Pheromone for Cats - 48ml Refill Bottle',
      status: 'active',
      inventory: 7,
      salesChannels: 6,
      markets: 2,
      category: 'Cat Supplies',
      type: '',
      photo: 'https://example.com/pheromone.jpg'
    },
    {
      id: 4,
      name: 'West Paw Hurley Fetch',
      status: 'draft',
      inventory: '',
      salesChannels: '',
      markets: '',
      category: '',
      type: '',
      photo: 'https://example.com/fetch-toy.jpg'
    }
  ];

  // Filter products based on active tab and search query
  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && product.status === 'active') ||
                      (activeTab === 'draft' && product.status === 'draft') ||
                      (activeTab === 'archived' && product.status === 'archived');
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-6"> {/* p-6 bg-white rounded-lg shadow-sm */}
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white">
            <FiDownload className="mr-2" /> Import
          </button>
          <button className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white">
            <FiUpload className="mr-2" /> Export
          </button>
          <button className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-white">
            <FiMoreHorizontal className="mr-2" /> More actions
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center hover:bg-green-700">
            <FiPlus className="mr-2" /> Add product
          </button>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className=" bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-black lowercase font-medium">Products by sell-through rate</div>
          <div className="text-xl font-semibold mt-1">1.5%</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-black uppercase font-medium">Products by days of inventory remaining</div>
          <div className="text-xl font-semibold mt-1">10 days</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-black uppercase font-medium">ABC product analysis</div>
          <div className="text-sm mt-1"><span className="font-semibold">$8.6K</span> A-grade</div>
          <div className="text-sm"><span className="font-semibold">$0</span> B-grade</div>
          <div className="text-sm"><span className="font-semibold">$2M</span> C-grade</div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Main Content */}
      <div className="mt-4">
        {/* Top Navigation Tabs and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-1 border-b border-gray-200 pb-1">
            <button 
              className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'all' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'active' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'draft' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft
            </button>
            <button 
              className={`px-3 py-2 text-sm rounded-t-md ${activeTab === 'archived' ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('archived')}
            >
              Archived
            </button>
            <button 
              className="px-3 py-2 text-sm rounded-t-md text-blue-600 hover:bg-blue-50"
            >
              <FiPlus className="inline mr-1" /> Add
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50">
              <FiFilter className="mr-2" /> Filters
            </button>
            <button className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50">
              Sort <FiChevronDown className="ml-2" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 font-medium mb-3 px-2">
          <div className="col-span-1 flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          <div className="col-span-4">Product</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Inventory</div>
          <div className="col-span-1">Sales channels</div>
          <div className="col-span-1">Markets</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Type</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-12 gap-4 text-sm border-b border-gray-100 pb-3 px-2 hover:bg-green-200 items-center">
              <div className="col-span-1 flex items-center">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div className="col-span-4 flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 overflow-hidden flex-shrink-0">
                  {product.photo && (
                    <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="truncate">{product.name}</span>
              </div>
              <div className="col-span-1">
                {product.status && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' ? 'bg-green-200 text-green-800' : 
                    product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>
              <div className="col-span-1">
                {product.inventory !== '' ? `${product.inventory} in stock` : ''}
              </div>
              <div className="col-span-1">
                {product.salesChannels || ''}
              </div>
              <div className="col-span-1">
                {product.markets || ''}
              </div>
              <div className="col-span-2">
                {product.category || ''}
              </div>
              <div className="col-span-1">
                {product.type || ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPages;