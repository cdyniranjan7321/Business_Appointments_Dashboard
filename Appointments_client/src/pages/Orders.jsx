import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { FiSearch, FiFilter, FiPlus, FiPrinter, FiDownload, FiChevronLeft, FiChevronRight, FiEdit2, FiCopy, 
  FiTrash2, FiArrowLeft, FiUser, FiCreditCard, FiTruck, FiShoppingBag, FiInfo, FiMoreHorizontal, FiEye,
} from 'react-icons/fi';

import { 
  FaRegCheckCircle, FaRegTimesCircle, FaRegClock, FaTruck, FaStore, FaBoxOpen
} from 'react-icons/fa';

import * as XLSX from 'xlsx';

const Orders = () => {
  // State declarations
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    customer: '',
    salesChannel: 'Online Store',
    items: [{ name: '', quantity: 1, price: 0 }],
    paymentStatus: 'Pending',
    deliveryMethod: 'Standard Shipping'
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    paymentStatus: '',
    fulfillmentStatus: '',
    deliveryMethod: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const menuRef = useRef(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://business-appointments-dashboard-klvo.onrender.com/api/orders');
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Utility function to format numbers as Nepali currency
  const formatNPR = (amount) => {
    return `रु ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    // Search term filtering
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
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
      if (!matchesSearch) return false;
    }

    // Apply filters
    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false;
    if (filters.fulfillmentStatus && order.fulfillmentStatus !== filters.fulfillmentStatus) return false;
    if (filters.deliveryMethod && order.deliveryMethod !== filters.deliveryMethod) return false;
    
    // Date range filter
    if (filters.dateFrom && new Date(order.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(order.date) > new Date(filters.dateTo)) return false;
    
    // Amount range filter
    if (filters.minAmount && order.total < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && order.total > parseFloat(filters.maxAmount)) return false;

    return true;
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

  // Toggle action menu
  const toggleMenu = (e, orderId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === orderId ? null : orderId);
  };

  // Toggle item selection
  const toggleItemSelection = (orderId, e) => {
    e.stopPropagation();
    setSelectedItems(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // Select all items
  const selectAllItems = (e) => {
    e.stopPropagation();
    if (selectedItems.length === filteredOrders.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredOrders.map(order => order.id));
    }
  };

  // Delete order
const handleDeleteOrder = async (orderId) => {
  try {
    // Find the full order to get the MongoDB _id
    const orderToDelete = orders.find(o => o.id === orderId);
    if (!orderToDelete) {
      throw new Error('Order not found');
    }

    // Use the MongoDB _id for deletion
    const response = await axios.delete(
      `https://business-appointments-dashboard-klvo.onrender.com/api/orders/${orderToDelete._id || orderId}`
    );
    
    if (response.data.success) {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setSelectedItems(prevItems => prevItems.filter(id => id !== orderId));
      setError(null);
    } else {
      throw new Error(response.data.message || 'Failed to delete order');
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    setError(`Failed to delete order: ${err.message}`);
  }
};

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected orders?`)) {
        const deletePromises = selectedItems.map(id => 
          axios.delete(`https://business-appointments-dashboard-klvo.onrender.com/api/orders/${id}`)
        );
        
        await Promise.all(deletePromises);
        setOrders(orders.filter(order => !selectedItems.includes(order.id)));
        setSelectedItems([]);
      }
    } catch (err) {
      console.error('Error during bulk delete:', err);
      setError('Failed to delete some orders. Please try again.');
    }
  };

  // Duplicate order
const handleDuplicateOrder = async (order) => {
  try {
    // Create a clean copy without the original ID
    const { _id, id, shortId, ...orderData } = order;
    const response = await axios.post('https://business-appointments-dashboard-klvo.onrender.com/api/orders', {
      ...orderData,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'Pending',
      fulfillmentStatus: 'Unfulfilled',
      deliveryStatus: 'Processing',
      labelStatus: 'Not Printed',
      tags: [...(order.tags || []), 'Copied']
    });

    if (response.data.success) {
      setOrders(prevOrders => [{
        ...response.data.order,
        id: response.data.order.shortId || response.data.order.id
      }, ...prevOrders]);
      setError(null);
    } else {
      throw new Error(response.data.message || 'Failed to duplicate order');
    }
  } catch (err) {
    console.error('Error duplicating order:', err);
    setError(`Failed to duplicate order: ${err.message}`);
  }
};

  // Start editing order
  const handleEditOrder = async (order) => {
    try {
      setEditingOrder(order);
      setNewOrder({
        customer: order.customer,
        salesChannel: order.salesChannel,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentStatus: order.paymentStatus,
        deliveryMethod: order.deliveryMethod
      });
      setShowCreateOrder(true);
      setError(null);
    } catch (err) {
      console.error('Error preparing order for edit:', err);
      setError('Failed to prepare order for editing. Please try again.');
    }
  };

  // Print order
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Order ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; margin-top: 10px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Order #${order.id}</h1>
              <p>Date: ${order.date}</p>
            </div>
            <div>
              <p>Customer: ${order.customer}</p>
              <p>Channel: ${order.salesChannel}</p>
            </div>
          </div>
          
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatNPR(item.price)}</td>
                  <td>${formatNPR(item.quantity * item.price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">Order Total: ${formatNPR(order.total)}</div>
          
          <h2>Order Details</h2>
          <table>
            <tr>
              <td>Payment Status</td>
              <td>${order.paymentStatus}</td>
            </tr>
            <tr>
              <td>Fulfillment Status</td>
              <td>${order.fulfillmentStatus}</td>
            </tr>
            <tr>
              <td>Delivery Method</td>
              <td>${order.deliveryMethod}</td>
            </tr>
            <tr>
              <td>Delivery Status</td>
              <td>${order.deliveryStatus}</td>
            </tr>
            ${order.destination ? `
            <tr>
              <td>Destination</td>
              <td>${order.destination}</td>
            </tr>
            ` : ''}
            ${order.tags && order.tags.length > 0 ? `
            <tr>
              <td>Tags</td>
              <td>${order.tags.join(', ')}</td>
            </tr>
            ` : ''}
          </table>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    setOpenMenuId(null);
  };

  // Print all filtered orders
  const handlePrintAll = () => {
    const ordersToPrint = selectedItems.length > 0 
      ? filteredOrders.filter(order => selectedItems.includes(order.id))
      : filteredOrders;
  
    if (ordersToPrint.length === 0) {
      alert('No orders selected to print');
      return;
    }
  
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .order { page-break-inside: avoid; margin-bottom: 30px; }
            .order-header { display: flex; justify-content: space-between; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Orders Report</h1>
          <p class="no-print">Generated on ${new Date().toLocaleString()}</p>
          <p>Total Orders: ${ordersToPrint.length} ${selectedItems.length > 0 ? '(Selected)' : ''}</p>
          
          ${ordersToPrint.map(order => `
            <div class="order">
              <div class="order-header">
                <h2>Order #${order.id}</h2>
                <p>Date: ${order.date}</p>
              </div>
              <p>Customer: ${order.customer} | Channel: ${order.salesChannel}</p>
              
              <h3>Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${formatNPR(item.price)}</td>
                      <td>${formatNPR(item.quantity * item.price)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Order Total:</strong></td>
                    <td><strong>${formatNPR(order.total)}</strong></td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Status</h3>
              <table>
                <tr>
                  <td>Payment Status</td>
                  <td>${order.paymentStatus}</td>
                </tr>
                <tr>
                  <td>Fulfillment Status</td>
                  <td>${order.fulfillmentStatus}</td>
                </tr>
                <tr>
                  <td>Delivery Method</td>
                  <td>${order.deliveryMethod}</td>
                </tr>
                <tr>
                  <td>Delivery Status</td>
                  <td>${order.deliveryStatus}</td>
                </tr>
              </table>
            </div>
          `).join('')}
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Print Report</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Export orders to Excel
  const handleExportOrders = () => {
    const ordersToExport = selectedItems.length > 0 
      ? filteredOrders.filter(order => selectedItems.includes(order.id))
      : filteredOrders;
  
    if (ordersToExport.length === 0) {
      alert('No orders selected to export');
      return;
    }
  
    // Prepare data for export
    const exportData = ordersToExport.map(order => ({
      'Order ID': order.id,
      'Date': order.date,
      'Customer': order.customer,
      'Sales Channel': order.salesChannel,
      'Total (NPR)': order.total,
      'Payment Status': order.paymentStatus,
      'Fulfillment Status': order.fulfillmentStatus,
      'Delivery Method': order.deliveryMethod,
      'Delivery Status': order.deliveryStatus,
      'Items Count': order.items.length,
      'Items': order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      'Destination': order.destination,
      'Tags': order.tags?.join(', ') || ''
    }));
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
    // Generate Excel file and download
    const fileName = selectedItems.length > 0 
      ? `selected_orders_export_${new Date().toISOString().split('T')[0]}.xlsx`
      : `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
  };

 // Create or update order
const handleCreateOrder = async () => {
  try {
    // Validate at least one item has a name
    const validItems = newOrder.items.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    // Prepare order data
    const orderData = {
      customer: newOrder.customer || 'Walk-in Customer',
      salesChannel: newOrder.salesChannel,
      items: validItems,
      paymentStatus: newOrder.paymentStatus,
      deliveryMethod: newOrder.deliveryMethod,
      total: validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    let response;
    if (editingOrder) {
      // Update existing order - use shortId if available, otherwise use _id
      const orderId = editingOrder.shortId || editingOrder.id;
      response = await axios.put(
        `https://business-appointments-dashboard-klvo.onrender.com/api/orders/${orderId}`, 
        orderData
      );
      
      if (response.data.success) {
        const updatedOrder = response.data.order;
        setOrders(prevOrders => 
          prevOrders.map(order => 
            (order.id === editingOrder.id || order.shortId === editingOrder.shortId) 
              ? { ...updatedOrder, id: updatedOrder.shortId || updatedOrder.id }
              : order
          )
        );
      }
    } else {
      // Create new order
      response = await axios.post(
        'https://business-appointments-dashboard-klvo.onrender.com/api/orders', 
        orderData
      );
      
      if (response.data.success) {
        const newOrder = response.data.order;
        setOrders(prevOrders => [{
          ...newOrder,
          id: newOrder.shortId || newOrder.id
        }, ...prevOrders]);
      }
    }

    // Reset form
    setShowCreateOrder(false);
    setNewOrder({
      customer: '',
      salesChannel: 'Online Store',
      items: [{ name: '', quantity: 1, price: 0 }],
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard Shipping'
    });
    setEditingOrder(null);
    setError(null);

  } catch (err) {
    console.error('Order submission error:', err);
    let errorMessage = 'Failed to save order. Please try again.';
    
    if (err.response) {
      if (err.response.data.errors) {
        errorMessage = err.response.data.errors.map(e => e.msg).join(', ');
      } else if (err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  }
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

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      paymentStatus: '',
      fulfillmentStatus: '',
      deliveryMethod: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  // View order details
const viewOrderDetails = (orderId) => {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    setSelectedOrder(order);
  }
}

  // Close order details view
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto p-6"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white shadow-xl overflow-hidden rounded-xl p-6 max-w-6xl mx-auto"
        >
          <button 
            onClick={closeOrderDetails}
            className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2 transition-transform duration-200 hover:-translate-x-1" /> 
            Back to Orders
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800">Order: {selectedOrder.shortId || selectedOrder.id.substring(0, 6)}</h1> 
              {/* Or if you want to show the full ID in the details view (which might be better for a detailed view), you could do: {selectedOrder.shortId || selectedOrder.id} */}
              <p className="text-gray-600 mt-1">Placed on {selectedOrder.date}</p>
            </motion.div>
            <motion.div 
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <button 
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                onClick={() => handlePrintOrder(selectedOrder)}
              >
                <FiPrinter className="mr-2" /> Print
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FiUser />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 ml-3">Customer</h2>
              </div>
              <p className="text-gray-800 font-medium">{selectedOrder.customer}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedOrder.salesChannel}</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiCreditCard />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 ml-3">Payment</h2>
              </div>
              <div className="flex items-center">
                {getStatusIcon(selectedOrder.paymentStatus)}
                <span className="ml-2 font-medium">{selectedOrder.paymentStatus}</span>
              </div>
              <p className="text-lg font-bold text-gray-800 mt-2">{formatNPR(selectedOrder.total)}</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <FiTruck />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 ml-3">Delivery</h2>
              </div>
              <div className="flex items-center">
                {getDeliveryIcon(selectedOrder.deliveryMethod)}
                <span className="ml-2 font-medium">{selectedOrder.deliveryMethod}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{selectedOrder.deliveryStatus}</p>
            </motion.div>
          </div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="mb-10"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FiShoppingBag className="mr-2 text-blue-500" /> Order Items
            </h2>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {formatNPR(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNPR(item.quantity * item.price)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                      {formatNPR(selectedOrder.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTruck className="mr-2 text-indigo-500" /> Shipping Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-800">{selectedOrder.destination}</p>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Label Status: {selectedOrder.labelStatus}</span>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="mt-3 pt-3 border-t border-indigo-100">
                    <p className="text-sm font-medium text-gray-700">Tracking Number:</p>
                    <p className="text-sm text-indigo-600 font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiInfo className="mr-2 text-amber-500" /> Additional Information
              </h2>
              <div className="space-y-3">
                {selectedOrder.tags && selectedOrder.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tags:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">Return Status:</p>
                  <p className="text-sm text-gray-800 mt-1">{selectedOrder.returnStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {selectedOrder.notes || "No additional notes"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-6">
          {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Details</h1>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
           <div className="relative group">
       <button 
         className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200"
         onClick={handlePrintAll}
       >
        <FiPrinter className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Print</span>
       </button>
         <span className="absolute z-10 w-auto p-2 m-2 min-w-max left-0 rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
           Print {selectedItems.length > 0 ? 'Selected' : 'All'} Orders
         </span>
      </div>
    
         {/* New Actions Dropdown */}
      <div className="relative group" ref={menuRef}>
  <button 
    className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200"
    onClick={() => setOpenMenuId(openMenuId === 'actions' ? null : 'actions')}
    disabled={selectedItems.length === 0}
  >
    <FiMoreHorizontal className="mr-1 md:mr-2" /> <span className="hidden sm:inline">More actions</span>
  </button>
     <span className="absolute z-10 w-auto p-2 m-2 min-w-max left-0 rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
          Actions {selectedItems.length > 0 ? 'Selected' : 'All'} Orders
     </span>
  
  {openMenuId === 'actions' && (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
    <div className="py-1">
      <button
        className={`flex items-center w-full text-left px-4 py-2 text-sm ${selectedItems.length === 1 ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
        onClick={() => {
          if (selectedItems.length === 1) {
            viewOrderDetails(selectedItems[0]);
          }
          setOpenMenuId(null);
        }}
        disabled={selectedItems.length !== 1}
      >
        <FiEye className="mr-2" /> View Details
      </button>
      <button
        className={`flex items-center w-full text-left px-4 py-2 text-sm ${selectedItems.length === 1 ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
        onClick={() => {
          if (selectedItems.length === 1) {
            const orderToEdit = orders.find(order => order.id === selectedItems[0]);
            if (orderToEdit) handleEditOrder(orderToEdit);
          }
          setOpenMenuId(null);
        }}
        disabled={selectedItems.length !== 1}
      >
        <FiEdit2 className="mr-2" /> Update
      </button>
      <button
        className={`flex items-center w-full text-left px-4 py-2 text-sm ${selectedItems.length === 1 ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
        onClick={() => {
          if (selectedItems.length === 1) {
            const orderToDuplicate = orders.find(order => order.id === selectedItems[0]);
            if (orderToDuplicate) handleDuplicateOrder(orderToDuplicate);
          }
          setOpenMenuId(null);
        }}
        disabled={selectedItems.length !== 1}
      >
        <FiCopy className="mr-2" /> Duplicate
      </button>
      <button
        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-800"
        onClick={() => {
          handleBulkDelete();
          setOpenMenuId(null);
        }}
      >
        <FiTrash2 className="mr-2" /> Delete
      </button>
    </div>
  </div>
)}
</div>
    
    <div className="relative group">
      <button 
        className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200"
        onClick={handleExportOrders}
      >
        <FiDownload className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Export</span>
      </button>
      <span className="absolute z-10 w-auto p-2 m-2 min-w-max left-0 rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
        Export {selectedItems.length > 0 ? 'Selected' : 'All'} Orders
      </span>
    </div>
    
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
        <div className="relative w-full md:w-auto">
          <button 
            className="w-full md:w-auto flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-1 md:mr-2" /> <span>Filter</span>
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment Status</label>
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.fulfillmentStatus}
                    onChange={(e) => setFilters({...filters, fulfillmentStatus: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Unfulfilled">Unfulfilled</option>
                    <option value="Partially Fulfilled">Partially Fulfilled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.deliveryMethod}
                    onChange={(e) => setFilters({...filters, deliveryMethod: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="Standard Shipping">Standard Shipping</option>
                    <option value="Express Shipping">Express Shipping</option>
                    <option value="In-Store Pickup">In-Store Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-400"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-700"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
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
              {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
           <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
            <input
             type="checkbox"
             className="order-checkbox h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
             checked={selectedItems.length === filteredOrders.length && filteredOrders.length > 0}
             onChange={selectAllItems}
            />
          </div>
        </th>
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
  </tr>
</thead>

{/* Table Rows */}
<tbody className="bg-white divide-y divide-gray-200">
  {filteredOrders.map((order) => (
    <tr 
      key={order.id}
      className="hover:bg-green-200 cursor-pointer"
      onClick={() => viewOrderDetails(order.id)} // Add this onClikk handler
    >
      <td 
        className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
        >
        <div className="flex items-center">
          <input
            type="checkbox"
            className="order-checkbox h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            checked={selectedItems.includes(order.id)}
            onChange={(e) => toggleItemSelection(order.id, e)}
          />
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.shortId || order.id.substring(0, 6)} {/* Show shortId if available, otherwise first 6 chars */}
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
        {formatNPR(order.total)}
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
    </tr>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> results
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-1 md:px-3 md:py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white">
            <FiChevronLeft />
          </button>
          <button className="p-1 md:px-3 md:py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white">
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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Items (Prices in NPR)</h3>
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
                      <div className="col-span-6 sm:col-span-4 flex items-center border border-gray-300 rounded-md shadow-sm">
                        <span className="pl-3 pr-2 text-gray-500">रु</span>
                         <input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="flex-1 py-2 pr-3 border-0 focus:ring-0 focus:outline-none sm:text-sm"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                        />
                     </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                className="bg-white py-2 px-3 md:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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