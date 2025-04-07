
import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiPrinter, 
  FiDownload, 
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiCopy,
  FiTrash2
} from 'react-icons/fi';
import { 
  FaRegCheckCircle, 
  FaRegTimesCircle, 
  FaRegClock,
  FaTruck,
  FaStore,
  FaBoxOpen
} from 'react-icons/fa';

const Orders = () => {
  // Sample order data
  const initialOrders = [
    {
      id: 'ORD-1001',
      date: '2023-05-15',
      customer: 'John Doe',
      salesChannel: 'Online Store',
      total: 125.99,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Fulfilled',
      items: [
        { name: 'T-Shirt', quantity: 2, price: 25.99 },
        { name: 'Jeans', quantity: 1, price: 74.00 }
      ],
      deliveryStatus: 'Delivered',
      deliveryMethod: 'Standard Shipping',
      tags: ['VIP', 'Repeat Customer'],
      destination: '123 Main St, Anytown, USA',
      labelStatus: 'Printed',
      returnStatus: 'None'
    },
    {
      id: 'ORD-1002',
      date: '2023-05-16',
      customer: 'Jane Smith',
      salesChannel: 'POS',
      total: 89.50,
      paymentStatus: 'Pending',
      fulfillmentStatus: 'Unfulfilled',
      items: [
        { name: 'Sneakers', quantity: 1, price: 89.50 }
      ],
      deliveryStatus: 'Processing',
      deliveryMethod: 'In-Store Pickup',
      tags: ['New Customer'],
      destination: 'Store Pickup',
      labelStatus: 'Not Needed',
      returnStatus: 'None'
    },
    {
      id: 'ORD-1003',
      date: '2023-05-17',
      customer: 'Mike Johnson',
      salesChannel: 'Phone Order',
      total: 210.75,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Partially Fulfilled',
      items: [
        { name: 'Jacket', quantity: 1, price: 129.99 },
        { name: 'Hat', quantity: 1, price: 24.99 },
        { name: 'Gloves', quantity: 2, price: 27.89 }
      ],
      deliveryStatus: 'Shipped',
      deliveryMethod: 'Express Shipping',
      tags: ['Wholesale'],
      destination: '456 Business Ave, Industry City, USA',
      labelStatus: 'Printed',
      returnStatus: 'None'
    }
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [searchTerm, setSearchTerm ] = useState('');
  const [newOrder, setNewOrder] = useState({
    customer: '',
    salesChannel: 'Online Store',
    items: [{ name: '', quantity: 1, price: 0 }],
    paymentStatus: 'Pending',
    deliveryMethod: 'Standard Shipping'
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const menuRef = useRef(null);


    // Filter orders based on search term(Improved search function)
   const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true; // Show all orders when search is empty
    
    const searchLower = searchTerm.toLowerCase();
    
    // Check each field for a match
    return (
      (order.id && order.id.toLowerCase().includes(searchLower)) ||
      (order.customer && order.customer.toLowerCase().includes(searchLower)) ||
      (order.salesChannel && order.salesChannel.toLowerCase().includes(searchLower)) ||
      (order.paymentStatus && order.paymentStatus.toLowerCase().includes(searchLower)) ||
      (order.fulfillmentStatus && order.fulfillmentStatus.toLowerCase().includes(searchLower)) ||
      (order.deliveryMethod && order.deliveryMethod.toLowerCase().includes(searchLower)) ||
      (order.items && order.items.some(item => 
        item.name && item.name.toLowerCase().includes(searchLower)
      )) ||
      (order.total && order.total.toString().includes(searchTerm))
    );
  });
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle order details expansion
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    setOpenMenuId(null);
  };

  // Toggle action menu
  const toggleMenu = (e, orderId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === orderId ? null : orderId);
  };

  // Delete order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
    setOpenMenuId(null);
  };

  // Duplicate order
  const handleDuplicateOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${1000 + orders.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'Pending',
      fulfillmentStatus: 'Unfulfilled',
      deliveryStatus: 'Processing',
      labelStatus: 'Not Printed',
      tags: [...order.tags, 'Copied']
    };
    setOrders([newOrder, ...orders]);
    setOpenMenuId(null);
  };

  // Start editing order
  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({
      customer: order.customer,
      salesChannel: order.salesChannel,
      items: order.items,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod
    });
    setShowCreateOrder(true);
    setOpenMenuId(null);
  };

  // Print order (simulated)
  const handlePrintOrder = (order) => {
    // In a real app, this would generate a PDF or open print dialog
    console.log("Printing order:", order.id);
    alert(`Printing order ${order.id}`);
    setOpenMenuId(null);
  };

  // Create or update order
  const handleCreateOrder = () => {
    if (editingOrder) {
      // Update existing order
      const updatedOrders = orders.map(order => 
        order.id === editingOrder.id ? {
          ...order,
          customer: newOrder.customer || 'Walk-in Customer',
          salesChannel: newOrder.salesChannel,
          items: newOrder.items,
          paymentStatus: newOrder.paymentStatus,
          deliveryMethod: newOrder.deliveryMethod,
          total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        } : order
      );
      setOrders(updatedOrders);
      setEditingOrder(null);
    } else {
      // Create new order
      const order = {
        id: `ORD-${1000 + orders.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        customer: newOrder.customer || 'Walk-in Customer',
        salesChannel: newOrder.salesChannel,
        total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentStatus: newOrder.paymentStatus,
        fulfillmentStatus: 'Unfulfilled',
        items: newOrder.items,
        deliveryStatus: 'Processing',
        deliveryMethod: newOrder.deliveryMethod,
        tags: ['Manual'],
        destination: newOrder.deliveryMethod.includes('Shipping') ? '' : 'Store Pickup',
        labelStatus: 'Not Printed',
        returnStatus: 'None'
      };
      setOrders([order, ...orders]);
    }
    
    setShowCreateOrder(false);
    setNewOrder({
      customer: '',
      salesChannel: 'Online Store',
      items: [{ name: '', quantity: 1, price: 0 }],
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard Shipping'
    });
  };

  // Add new item to manual order
  const addNewItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', quantity: 1, price: 0 }]
    });
  };

  // Update item in manual order
  const updateItem = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'fulfilled':
      case 'delivered':
        return <FaRegCheckCircle className="text-green-500" />;
      case 'pending':
      case 'processing':
        return <FaRegClock className="text-yellow-500" />;
      case 'unfulfilled':
        return <FaRegTimesCircle className="text-red-500" />;
      default:
        return <FaRegClock className="text-yellow-500" />;
    }
  };

  // Get delivery method icon
  const getDeliveryIcon = (method) => {
    if (method.includes('Shipping')) return <FaTruck className="text-blue-500" />;
    if (method.includes('Pickup')) return <FaStore className="text-purple-500" />;
    return <FaBoxOpen className="text-gray-500" />;
  };

  return (
   <div className="fixed inset-0 bg-gray-100 overflow-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Details</h1>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white hover:bg-green-700"
            onClick={() => {
              setEditingOrder(null);
              setShowCreateOrder(true);
            }}
          >
            <FiPlus className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Create Order</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <FiFilter className="mr-1 md:mr-2" /> <span>Filter</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
      {filteredOrders.length === 0 ? (
        <div className="p-4 text-center text-red-500">
        No orders found matching your search criteria.
      </div>
    ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Customer
                </th>
                <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Channel
                </th>
                <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Payment
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Fulfillment
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Delivery
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className="hover:bg-green-200 cursor-pointer" 
                    onClick={() => toggleExpand(order.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {order.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {order.customer}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {order.salesChannel}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(order.paymentStatus)}
                        <span className="ml-1 hidden md:inline">{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(order.fulfillmentStatus)}
                        <span className="ml-1 hidden lg:inline">{order.fulfillmentStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <div className="flex items-center">
                        {getDeliveryIcon(order.deliveryMethod)}
                        <span className="ml-1">{order.deliveryStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div ref={menuRef}>
                        <button 
                          className="text-black hover:text-red-600 focus:outline-none"
                          onClick={(e) => toggleMenu(e, order.id)}
                        >
                          <FiMoreVertical />
                        </button>
                        
                        {openMenuId === order.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOrder(order);
                                }}
                              >
                                <FiEdit2 className="mr-2" /> Update
                              </button>
                              <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateOrder(order);
                                }}
                              >
                                <FiCopy className="mr-2" /> Duplicate
                              </button>
                              <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrintOrder(order);
                                }}
                              >
                                <FiPrinter className="mr-2" /> Print
                              </button>
                              <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(order.id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="9" className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                            <ul className="border rounded-md divide-y divide-gray-200">
                              {order.items.map((item, index) => (
                                <li key={index} className="px-3 py-2 flex justify-between text-sm">
                                  <span>{item.name}</span>
                                  <span>{item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Details</h3>
                            <div className="border rounded-md p-3 text-sm">
                              <p className="mb-1"><span className="font-medium">Delivery Method:</span> {order.deliveryMethod}</p>
                              <p className="mb-1"><span className="font-medium">Destination:</span> {order.destination}</p>
                              <p className="mb-1"><span className="font-medium">Label Status:</span> {order.labelStatus}</p>
                              {order.tags && order.tags.length > 0 && (
                                <p className="mb-1">
                                  <span className="font-medium">Tags:</span> {order.tags.join(', ')}
                                </p>
                              )}
                              <p><span className="font-medium">Return Status:</span> {order.returnStatus}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
    )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
        <div>
          <p className="text-xs md:text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> results
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-1 md:px-3 md:py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiChevronLeft />
          </button>
          <button className="p-1 md:px-3 md:py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {editingOrder ? `Edit Order ${editingOrder.id}` : 'Create Manual Order'}
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6 md:col-span-3">
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customer"
                    id="customer"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-6 md:col-span-3">
                  <label htmlFor="salesChannel" className="block text-sm font-medium text-gray-700">
                    Sales Channel
                  </label>
                  <select
                    id="salesChannel"
                    name="salesChannel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={newOrder.salesChannel}
                    onChange={(e) => setNewOrder({...newOrder, salesChannel: e.target.value})}
                  >
                    <option>Online Store</option>
                    <option>POS</option>
                    <option>Phone Order</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div className="sm:col-span-6 md:col-span-3">
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({...newOrder, paymentStatus: e.target.value})}
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Partially Paid</option>
                    <option>Refunded</option>
                  </select>
                </div>

                <div className="sm:col-span-6 md:col-span-3">
                  <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700">
                    Delivery Method
                  </label>
                  <select
                    id="deliveryMethod"
                    name="deliveryMethod"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={newOrder.deliveryMethod}
                    onChange={(e) => setNewOrder({...newOrder, deliveryMethod: e.target.value})}
                  >
                    <option>Standard Shipping</option>
                    <option>Express Shipping</option>
                    <option>In-Store Pickup</option>
                    <option>Local Delivery</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          placeholder="Item name"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <input
                          type="number"
                          placeholder="Price"
                          step="0.01"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={addNewItem}
                  >
                    <FiPlus className="-ml-0.5 mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 md:px-6 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                className="bg-white py-2 px-3 md:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setShowCreateOrder(false);
                  setEditingOrder(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-3 md:px-4 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleCreateOrder}
              >
                {editingOrder ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;