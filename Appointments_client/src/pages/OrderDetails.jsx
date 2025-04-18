// OrderDetails.jsx
import React from 'react';
import { 
  FaRegCheckCircle, 
  FaRegTimesCircle, 
  FaRegClock,
  FaTruck,
  FaStore,
  FaBoxOpen
} from 'react-icons/fa';
import { FiChevronLeft } from 'react-icons/fi';

const OrderDetails = ({ order, onBack }) => {
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

  const getDeliveryIcon = (method) => {
    if (method.includes('Shipping')) return <FaTruck className="text-blue-500" />;
    if (method.includes('Pickup')) return <FaStore className="text-purple-500" />;
    return <FaBoxOpen className="text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Order Details: {order.id}</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
            <p className="mt-1 text-sm text-gray-900">{order.date}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="mt-1 text-sm text-gray-900">{order.customer}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sales Channel</h3>
            <p className="mt-1 text-sm text-gray-900">{order.salesChannel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
            <div className="mt-1 flex items-center">
              {getStatusIcon(order.paymentStatus)}
              <span className="ml-2 text-sm text-gray-900">{order.paymentStatus}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fulfillment Status</h3>
            <div className="mt-1 flex items-center">
              {getStatusIcon(order.fulfillmentStatus)}
              <span className="ml-2 text-sm text-gray-900">{order.fulfillmentStatus}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Delivery Method</h3>
            <div className="mt-1 flex items-center">
              {getDeliveryIcon(order.deliveryMethod)}
              <span className="ml-2 text-sm text-gray-900">{order.deliveryMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  Order Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Delivery Status</h3>
            <div className="mt-1 flex items-center">
              {getStatusIcon(order.deliveryStatus)}
              <span className="ml-2 text-sm text-gray-900">{order.deliveryStatus}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Label Status</h3>
            <p className="mt-1 text-sm text-gray-900">{order.labelStatus}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Destination</h3>
            <p className="mt-1 text-sm text-gray-900">{order.destination}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Return Status</h3>
            <p className="mt-1 text-sm text-gray-900">{order.returnStatus}</p>
          </div>
          {order.tags && order.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tags</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {order.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;