
import React, { useState } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiPrinter, 
  FiDownload, 
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight
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
  const [newOrder, setNewOrder] = useState({
    customer: '',
    salesChannel: 'Online Store',
    items: [{ name: '', quantity: 1, price: 0 }],
    paymentStatus: 'Pending',
    deliveryMethod: 'Standard Shipping'
  });

  // Toggle order details expansion
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Create new manual order
  const handleCreateOrder = () => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Details</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-2" /> Print
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-2" /> Export
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700"
            onClick={() => setShowCreateOrder(true)}
          >
            <FiPlus className="mr-2" /> Create Order
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Search orders..."
          />
        </div>
        <button className="ml-2 flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <FiFilter className="mr-2" /> Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th scope="col" className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className="hover:bg-green-200 cursor-pointer" 
                  onClick={() => toggleExpand(order.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.salesChannel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getStatusIcon(order.paymentStatus)}
                      <span className="ml-1">{order.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getStatusIcon(order.fulfillmentStatus)}
                      <span className="ml-1">{order.fulfillmentStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getDeliveryIcon(order.deliveryMethod)}
                      <span className="ml-1">{order.deliveryStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="9" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                          <ul className="border rounded-md divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                              <li key={index} className="px-4 py-3 flex justify-between">
                                <span>{item.name}</span>
                                <span>{item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Details</h3>
                          <div className="border rounded-md p-4">
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> results
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiChevronLeft />
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Create Manual Order</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
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

                <div className="sm:col-span-3">
                  <label htmlFor="salesChannel" className="block text-sm font-medium text-gray-700">
                    Sales Channel
                  </label>
                  <select
                    id="salesChannel"
                    name="salesChannel"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    value={newOrder.salesChannel}
                    onChange={(e) => setNewOrder({...newOrder, salesChannel: e.target.value})}
                  >
                    <option>Online Store</option>
                    <option>POS</option>
                    <option>Phone Order</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({...newOrder, paymentStatus: e.target.value})}
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Partially Paid</option>
                    <option>Refunded</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700">
                    Delivery Method
                  </label>
                  <select
                    id="deliveryMethod"
                    name="deliveryMethod"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
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
                    <div key={index} className="grid grid-cols-12 gap-4 mb-3">
                      <div className="col-span-6">
                        <input
                          type="text"
                          placeholder="Item name"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
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
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={addNewItem}
                  >
                    <FiPlus className="-ml-0.5 mr-1.5 h-4 w-4" /> Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
                onClick={() => setShowCreateOrder(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleCreateOrder}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;