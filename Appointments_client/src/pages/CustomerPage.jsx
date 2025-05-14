import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [newService, setNewService] = useState({
    name: '',
    date: '',
    price: '',
    status: 'pending'
  });
  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showDetailsButton, setShowDetailsButton] = useState(false);

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
          cohortIds: ['cohort1', 'cohort2'],
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
          cohortIds: ['cohort1'],
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
          cohortIds: ['cohort3'],
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
          cohortIds: ['cohort3'],
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
          loadCustomerDetails(selectedCustomer.id);
        }
      }
    };

    fetchCustomers();
  }, [customerId]);

  const loadCustomerDetails = async (id) => {
    // Fetch services for this customer - now using the id parameter
    const fetchServices = async () => {
      // Replace with actual API call
      const mockServices = {
        '1': [
          { id: 's1', name: 'Haircut', date: '2023-10-28', price: 45.00, status: 'completed' },
          { id: 's2', name: 'Coloring', date: '2023-08-15', price: 120.00, status: 'completed' },
          { id: 's3', name: 'Manicure', date: '2023-11-15', price: 35.00, status: 'upcoming' }
        ],
        '2': [
          { id: 's4', name: 'Facial', date: '2023-11-10', price: 75.00, status: 'completed' },
          { id: 's5', name: 'Massage', date: '2023-12-05', price: 90.00, status: 'upcoming' }
        ],
        '3': [
          { id: 's6', name: 'Haircut', date: '2023-09-18', price: 40.00, status: 'completed' }
        ],
        '4': [
          { id: 's7', name: 'Consultation', date: '2023-12-01', price: 0.00, status: 'completed' },
          { id: 's8', name: 'Facial', date: '2023-12-10', price: 75.00, status: 'upcoming' }
        ],
        '5': [
          { id: 's9', name: 'Team Package', date: '2023-11-20', price: 500.00, status: 'completed' },
          { id: 's10', name: 'Team Package', date: '2023-10-15', price: 500.00, status: 'completed' }
        ]
      };
      setServices(mockServices[id] || []);
    };
  
    // Fetch cohorts - now filtered by customer
    const fetchCohorts = async () => {
      // Replace with actual API call
      const mockCohorts = [
        { id: 'cohort1', name: 'Premium Clients', description: 'High-value customers' },
        { id: 'cohort2', name: 'Monthly Subscribers', description: 'Subscription plan members' },
        { id: 'cohort3', name: 'New Customers', description: 'First-time clients' }
      ];
      setCohorts(mockCohorts);
    };
  
    await fetchServices();
    await fetchCohorts();
  };

  const handleCustomerClick = (customer) => {
    navigate(`/customers/${customer.id}`);
    setCustomer(customer);
    loadCustomerDetails(customer.id);
    setActiveTab('details');
    setIsEditing(false);
  };

  const handleBackToList = () => {
    navigate('/customer');
    setCustomer(null);
    setSelectedCustomers([]);
    setShowDetailsButton(false);
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

  const handleAddToCohort = () => {
    if (!selectedCohort) return;
    
    // Here you would typically make an API call to add customer to cohort
    if (!customer.cohortIds.includes(selectedCohort)) {
      const updatedCustomer = {
        ...customer,
        cohortIds: [...customer.cohortIds, selectedCohort]
      };
      setCustomer(updatedCustomer);
      // Update the customers list
      setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
    }
    setSelectedCohort('');
  };

  const handleRemoveFromCohort = (cohortId) => {
    // Here you would typically make an API call to remove customer from cohort
    const updatedCustomer = {
      ...customer,
      cohortIds: customer.cohortIds.filter(id => id !== cohortId)
    };
    setCustomer(updatedCustomer);
    // Update the customers list
    setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
  };

  const handleSelectCustomer = (customerId, isChecked) => {
    if (isChecked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
    setShowDetailsButton(selectedCustomers.length + (isChecked ? 1 : -1) === 1);
  };

  const handleSelectAllCustomers = (isChecked) => {
    if (isChecked) {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
      setShowDetailsButton(filteredCustomers.length === 1);
    } else {
      setSelectedCustomers([]);
      setShowDetailsButton(false);
    }
  };

  const handleShowDetails = () => {
    if (selectedCustomers.length === 1) {
      const selectedCustomer = customers.find(c => c.id === selectedCustomers[0]);
      if (selectedCustomer) {
        handleCustomerClick(selectedCustomer);
      }
    }
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

        {showDetailsButton && (
          <div className="mb-4">
            <button
              onClick={handleShowDetails}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
            >
              Show Details
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={(e) => handleSelectAllCustomers(e.target.checked)}
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
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
                    className={`${selectedCustomers.includes(customer.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      />
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                         {/* <div className="text-sm text-gray-500">{customer.phone}</div> */}
                        </div>
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.email}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
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
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.location}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.orders}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      रु  {customer.lifetimeValue.toFixed(2)}
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Customer Details
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'services' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('cohorts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cohorts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Cohorts
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-grenn-500 focus:border-green-500"
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
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Booked Services</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(service.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">रु{service.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.status === 'completed' ? 'bg-green-100 text-green-800' :
                          service.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cohorts' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Cohorts</h2>
            <p className="mb-4 text-gray-600">Add this customer to cohorts for targeted marketing campaigns.</p>
            
            <div className="flex items-center space-x-2 mb-6">
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">--Select a cohort--</option>
                {cohorts.map(cohort => (
                  <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
                ))}
              </select>
              <button
                onClick={handleAddToCohort}
                disabled={!selectedCohort}
                className={`px-4 py-2 rounded-md transition ${selectedCohort ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Add to Cohort
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Current Cohorts</h3>
              {customer.cohortIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {customer.cohortIds.map(cohortId => {
                    const cohort = cohorts.find(c => c.id === cohortId);
                    return cohort ? (
                      <div key={cohort.id} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-1">
                        <span>{cohort.name}</span>
                        <button 
                          onClick={() => handleRemoveFromCohort(cohort.id)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-gray-500">This customer is not in any cohorts yet.</p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-2">Available Cohorts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cohorts.map(cohort => (
                  <div key={cohort.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-semibold">{cohort.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{cohort.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Lifetime Value</h3>
                <p className="text-2xl font-bold text-blue-900 mt-2">रु{customer.lifetimeValue.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Total Orders</h3>
                <p className="text-2xl font-bold text-green-900 mt-2">{customer.orders}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Last Visit</h3>
                <p className="text-2xl font-bold text-purple-900 mt-2">
                  {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-4">Service History</h3>
              <div className="bg-white p-4 rounded-lg shadow">
                {/* Here you would typically add a chart component */}
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Service history chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;