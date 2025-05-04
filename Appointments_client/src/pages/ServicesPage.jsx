import React, { useState, useEffect } from 'react'; // Added useEffect import
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiInfo, FiX } from 'react-icons/fi';
import axios from 'axios';

const Services = () => {
  // State for form inputs
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    active: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState([]);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:6001/api/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...serviceForm,
        price: parseFloat(serviceForm.price)
      };

      const url = isEditing 
        ? `http://localhost:6001/api/services/${currentServiceId}`
        : 'http://localhost:6001/api/services';
      
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios[method](url, serviceData);
      
      if (response.data.success) {
        fetchServices();
        resetFormAndClose();
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} service. Please try again.`);
    }
  };

  const handleEditClick = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      active: service.active
    });
    setIsEditing(true);
    setCurrentServiceId(service.id);
    setShowServiceModal(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await axios.delete(`http://localhost:6001/api/services/${id}`);
        if (response.data.success) {
          fetchServices();
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const toggleServiceStatus = async (id) => {
    try {
      const service = services.find(s => s.id === id);
      const response = await axios.put(
        `http://localhost:6001/api/services/${id}`,
        { active: !service.active }
      );
      
      if (response.data.success) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  const resetFormAndClose = () => {
    setServiceForm({
      name: '',
      description: '',
      price: '',
      category: '',
      active: true
    });
    setIsEditing(false);
    setCurrentServiceId(null);
    setShowServiceModal(false);
  };

  const openNewServiceModal = () => {
    resetFormAndClose();
    setShowServiceModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Service Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Service Button */}
        <div className="lg:col-span-1">
          <button
            onClick={openNewServiceModal}
            className="w-full bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-md flex items-center justify-center shadow"
          >
            <FiPlus className="mr-2" />
            Add New Service
          </button>
        </div>
        
        {/* Services List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Available Services</h2>
              <div className="text-sm text-gray-500">
                {services.length} {services.length === 1 ? 'service' : 'services'}
              </div>
            </div>
            
            {services.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No services available. Create your first service to get started.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {services.map(service => (
                  <li key={service.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-800 mr-2">{service.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full 
                            ${service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-1.5">रु</span>
                            {service.price.toFixed(2)}
                          </div>
                          {service.category && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FiTag className="mr-1.5" />
                              {service.category}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                         onClick={() => handleEditClick(service)} // Changed from handleEditService
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          onClick={() => toggleServiceStatus(service.id)}
                          className={`p-2 rounded-full hover:bg-gray-100 ${
                            service.active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                          }`}
                          title={service.active ? 'Deactivate' : 'Activate'}
                        >
                          {service.active ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Booking Preview Section */}
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Customer Booking Preview</h2>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      This is how your services will appear to customers when they book online.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.filter(s => s.active).slice(0, 3).map(service => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">रु{service.price.toFixed(2)}</span>
                      <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {services.filter(s => s.active).length === 0 && services.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  No active services available for booking. Activate services to make them visible to customers.
                </div>
              )}

              {services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No services available for preview. Add services to see how they'll appear to customers.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Form Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Service' : 'Create New Service'}
              </h2>
              <button
                onClick={resetFormAndClose}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleServiceSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name*</label>
                <input
                  type="text"
                  name="name"
                  value={serviceForm.name}
                  onChange={handleServiceFormChange}
                  className="w-full px-3 py-2 border border-green-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={serviceForm.description}
                  onChange={handleServiceFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-green-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">रु</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={serviceForm.price}
                    onChange={handleServiceFormChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-green-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={serviceForm.category}
                  onChange={handleServiceFormChange}
                  className="w-full px-3 py-2 border border-green-300 rounded-md"
                />
              </div>
              
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={serviceForm.active}
                  onChange={handleServiceFormChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Available for booking
                </label>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center justify-center"
                >
                  <FiPlus className="mr-2" />
                  {isEditing ? 'Update Service' : 'Add Service'}
                </button>
                
                <button
                  type="button"
                  onClick={resetFormAndClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;