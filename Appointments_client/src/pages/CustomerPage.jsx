import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    // Fetch all customers data
    const fetchCustomers = async () => {
      // Replace with actual API call
      const mockCustomers = [
        {
          id: '1',
          name: 'Niranjan chaudhary',
          email: 'cdyniranjan7321@.com',
          phone: '+977 9869148791',
          address: 'ranipauwa, pokhara, Nepal',
          joinDate: '2023-01-15',
          notes: 'Prefers morning appointments. Allergic to peanuts.',
          lifetimeValue: 1250.00,
          lastVisit: '2023-10-28',
          subscription: 'Premium',
          orders: 5,
          location: 'Pokhara'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+977 984567-8901',
          address: 'putali sadak, kathmandu, Nepal',
          joinDate: '2023-03-22',
          notes: 'Loyal customer, refers many friends.',
          lifetimeValue: 890.00,
          lastVisit: '2023-11-05',
          subscription: 'Basic',
          orders: 3,
          location: 'kathmandu'
        },
        {
          id: '3',
          name: 'Ram Thapa',
          email: 'ram@example.com',
          phone: '+977 981234-5678',
          address: 'NewRoad, pokhara, Nepal',
          joinDate: '2023-05-10',
          notes: 'Prefers email communication.',
          lifetimeValue: 450.00,
          lastVisit: '2023-09-18',
          subscription: 'None',
          orders: 1,
          location: 'kaski'
        },
        {
          id: '4',
          name: 'Emily Wilson',
          email: 'emily@example.com',
          phone: '+1 (555) 789-0123',
          address: '321 Elm St, Anywhere, USA',
          joinDate: '2023-07-30',
          notes: 'New customer, interested in premium services.',
          lifetimeValue: 320.00,
          lastVisit: '2023-12-01',
          subscription: 'Trial',
          orders: 2,
          location: 'Houston'
        },
      ];
      setCustomers(mockCustomers);
      
      // If customerId is present in URL, load that customer
      if (customerId) {
        const selectedCustomer = mockCustomers.find(c => c.id === customerId);
        if (selectedCustomer) {
          setCustomer(selectedCustomer);
        }
      }
    };

    fetchCustomers();
  }, [customerId]);

  const handleCustomerClick = (customer) => {
    navigate(`/customers/${customer.id}`);
    setCustomer(customer);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    navigate('/customer');
    setCustomer(null);
    setSelectedCustomers([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the customer data
    console.log('Saving customer:', customer);
    setIsEditing(false);
    // Update the customers list with the edited customer
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
  };

  const handleSelectCustomer = (customerId, e) => {
    e.stopPropagation(); // Prevent triggering the row click
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId) 
        : [...prev, customerId]
    );
  };

  const handleSelectAllCustomers = (e) => {
    e.stopPropagation();
    setSelectedCustomers(
      e.target.checked 
        ? filteredCustomers.map(c => c.id) 
        : []
    );
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show customer list if no customer is selected
  if (!customerId) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={handleSelectAllCustomers}
                      checked={
                        selectedCustomers.length > 0 && 
                        selectedCustomers.length === filteredCustomers.length
                      }
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Spent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id}
                    className={`${selectedCustomers.includes(customer.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        customer.subscription === 'Basic' ? 'bg-blue-100 text-blue-800' :
                        customer.subscription === 'Enterprise' ? 'bg-green-100 text-green-800' :
                        customer.subscription === 'Trial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      रु {customer.lifetimeValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Show customer details if a customer is selected
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackToList}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {customer.name}</p>
                <p><span className="font-medium">Email:</span> {customer.email}</p>
                <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                <p><span className="font-medium">Address:</span> {customer.address}</p>
                <p><span className="font-medium">Location:</span> {customer.location}</p>
                <p><span className="font-medium">Subscription:</span> 
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' :
                    customer.subscription === 'Basic' ? 'bg-blue-100 text-blue-800' :
                    customer.subscription === 'Enterprise' ? 'bg-green-100 text-green-800' :
                    customer.subscription === 'Trial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.subscription}
                  </span>
                </p>
                <p><span className="font-medium">Member Since:</span> {new Date(customer.joinDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={customer.notes}
                  onChange={handleInputChange}
                  rows="5"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;