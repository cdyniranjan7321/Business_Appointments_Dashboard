import { useState } from 'react';
import { FiCopy, FiMail, FiPhone, FiShare2 } from 'react-icons/fi';

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([
    {
      id: '1',
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      minOrder: 50,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      usageLimit: 100,
      used: 42,
      active: true
    },
    {
      id: '2',
      code: 'FREESHIP',
      type: 'fixed',
      value: 5.99,
      minOrder: 0,
      startDate: '2023-05-15',
      endDate: '2023-12-31',
      usageLimit: null,
      used: 18,
      active: true
    },
    {
      id: '3',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrder: 0,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      usageLimit: 500,
      used: 327,
      active: true
    }
  ]);

  const [newDiscount, setNewDiscount] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    active: true
  });

  const [shareData, setShareData] = useState({
    discountId: '',
    method: 'email',
    email: '',
    phone: '',
    message: 'Check out this discount code for our store!'
  });

  const [activeTab, setActiveTab] = useState('manage');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const handleCreateDiscount = (e) => {
    e.preventDefault();
    const discount = {
      ...newDiscount,
      id: Date.now().toString(),
      value: parseFloat(newDiscount.value),
      minOrder: newDiscount.minOrder ? parseFloat(newDiscount.minOrder) : 0,
      usageLimit: newDiscount.usageLimit ? parseInt(newDiscount.usageLimit) : null,
      used: 0
    };
    setDiscounts([...discounts, discount]);
    setNewDiscount({
      code: '',
      type: 'percentage',
      value: '',
      minOrder: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      active: true
    });
    setShowCreateModal(false);
  };

  const handleShareDiscount = (e) => {
    e.preventDefault();
    // Here you would typically send the discount via email/SMS API
    console.log('Sharing discount:', shareData);
    setShowShareModal(false);
    alert(`Discount shared via ${shareData.method}!`);
  };

  const toggleDiscountStatus = (id) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    ));
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition flex items-center"
          >
            Create Discount
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Discounts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usage History
          </button>
        </nav>
      </div>

      {/* Manage Discounts Tab */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{discount.code}</span>
                      <button
                        onClick={() => copyToClipboard(discount.code)}
                        className="ml-2 text-gray-500 hover:text-blue-600"
                        title="Copy to clipboard"
                      >
                        <FiCopy />
                      </button>
                      {copiedCode === discount.code && (
                        <span className="ml-2 text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {discount.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                    {discount.minOrder > 0 && (
                      <div className="text-xs text-gray-400">Min order: ${discount.minOrder}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.used}{discount.usageLimit ? `/${discount.usageLimit}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      discount.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discount.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setShareData({ ...shareData, discountId: discount.id });
                          setShowShareModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Share"
                      >
                        <FiShare2 />
                      </button>
                      <button
                        onClick={() => toggleDiscountStatus(discount.id)}
                        className={`${
                          discount.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                        }`}
                        title={discount.active ? 'Deactivate' : 'Activate'}
                      >
                        {discount.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Usage History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Discount Usage History</h2>
          <p className="text-gray-500">This would display detailed usage history of each discount code.</p>
          {/* In a real implementation, you would show a table of discount redemptions */}
        </div>
      )}

      {/* Create Discount Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Discount</h2>
              <form onSubmit={handleCreateDiscount}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                    <input
                      type="text"
                      value={newDiscount.code}
                      onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                      placeholder="e.g. SUMMER20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={newDiscount.type}
                        onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {newDiscount.type === 'percentage' ? 'Percentage' : 'Amount'}
                      </label>
                      <div className="relative">
                        {newDiscount.type === 'percentage' ? (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={newDiscount.value}
                            onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                            placeholder="10"
                          />
                        ) : (
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={newDiscount.value}
                              onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                              placeholder="5.99"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newDiscount.minOrder}
                        onChange={(e) => setNewDiscount({ ...newDiscount, minOrder: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="0 (no minimum)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newDiscount.startDate}
                        onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={newDiscount.endDate}
                        onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (optional)</label>
                    <input
                      type="number"
                      min="1"
                      value={newDiscount.usageLimit}
                      onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={newDiscount.active}
                      onChange={(e) => setNewDiscount({ ...newDiscount, active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Create Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Share Discount Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Discount Code</h2>
              <form onSubmit={handleShareDiscount}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Share Method</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setShareData({ ...shareData, method: 'email' })}
                        className={`flex items-center px-4 py-2 rounded-md ${
                          shareData.method === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <FiMail className="mr-2" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setShareData({ ...shareData, method: 'sms' })}
                        className={`flex items-center px-4 py-2 rounded-md ${
                          shareData.method === 'sms' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <FiPhone className="mr-2" />
                        SMS
                      </button>
                    </div>
                  </div>
                  {shareData.method === 'email' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={shareData.email}
                        onChange={(e) => setShareData({ ...shareData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                        placeholder="customer@example.com"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={shareData.phone}
                        onChange={(e) => setShareData({ ...shareData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                        placeholder="+1234567890"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={shareData.message}
                      onChange={(e) => setShareData({ ...shareData, message: e.target.value })}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Discount Code:</strong> {discounts.find(d => d.id === shareData.discountId)?.code}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Value:</strong> {(() => {
                        const discount = discounts.find(d => d.id === shareData.discountId);
                        return discount?.type === 'percentage' 
                          ? `${discount.value}% off` 
                          : `$${discount.value.toFixed(2)} off`;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Share Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsPage;