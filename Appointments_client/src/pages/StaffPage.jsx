import React, { useState } from 'react';
import { FiUser, FiClock, FiKey, FiSettings, FiLogIn, FiLogOut, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Staff = () => {
  // State for form inputs
  const [activeTab, setActiveTab] = useState('profiles');
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    role: 'staff',
    password: '',
    confirmPassword: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Sample staff data - replace with actual data from your backend
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', position: 'Manager', role: 'admin', lastLogin: '2023-05-15 09:30' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', position: 'Cashier', role: 'staff', lastLogin: '2023-05-15 08:45' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-123-4567', position: 'Inventory', role: 'staff', lastLogin: '2023-05-14 14:20' }
  ]);

  // Sample attendance data
  const [attendance, setAttendance] = useState([
    { id: 1, staffId: 1, name: 'John Doe', date: '2023-05-15', clockIn: '08:30', clockOut: '17:15', status: 'present' },
    { id: 2, staffId: 2, name: 'Jane Smith', date: '2023-05-15', clockIn: '08:45', clockOut: '17:00', status: 'present' },
    { id: 3, staffId: 3, name: 'Mike Johnson', date: '2023-05-15', clockIn: '09:00', clockOut: '16:45', status: 'late' }
  ]);

  // Handle form input changes
  const handleStaffFormChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handlers
  const handleStaffSubmit = (e) => {
    e.preventDefault();
    // Validate and submit to backend
    console.log('Staff form submitted:', staffForm);
    // Reset form
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      role: 'staff',
      password: '',
      confirmPassword: ''
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Validate and submit to backend
    console.log('Login form submitted:', loginForm);
    // Reset form
    setLoginForm({ email: '', password: '' });
  };

  // Clock in/out handlers
  const handleClockIn = (staffId) => {
    console.log('Clock in:', staffId);
    // Add to attendance records
  };

  const handleClockOut = (staffId) => {
    console.log('Clock out:', staffId);
    // Update attendance records
  };

  // Delete staff member
  const handleDeleteStaff = (id) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Staff Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'profiles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profiles')}
        >
          <FiUser className="inline mr-2" /> Staff Profiles
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'accounts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('accounts')}
        >
          <FiKey className="inline mr-2" /> Accounts
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('attendance')}
        >
          <FiClock className="inline mr-2" /> Attendance
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('roles')}
        >
          <FiSettings className="inline mr-2" /> Roles & Permissions
        </button>
      </div>
      
      {/* Staff Profiles Tab */}
      {activeTab === 'profiles' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Staff Members</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
              <FiPlus className="mr-2" /> Add Staff
            </button>
          </div>
          
          {/* Staff Creation Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Create Staff Profile</h3>
            <form onSubmit={handleStaffSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={staffForm.name}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={staffForm.email}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={staffForm.phone}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={staffForm.position}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={staffForm.role}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={staffForm.password}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={staffForm.confirmPassword}
                    onChange={handleStaffFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Create Staff Account
              </button>
            </form>
          </div>
          
          {/* Staff List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffMembers.map(staff => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FiUser className="text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${staff.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          staff.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Accounts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FiLogIn className="mr-2" /> Staff Login
              </h3>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Login
                </button>
              </form>
            </div>
            
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Status</h3>
              <div className="space-y-4">
                {staffMembers.map(staff => (
                  <div key={staff.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.email}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Last login: {staff.lastLogin}</p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Attendance</h2>
          
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {staffMembers.map(staff => (
                <div key={staff.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.position}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Clocked In
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => handleClockIn(staff.id)}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm flex items-center"
                    >
                      <FiLogIn className="mr-1" /> Clock In
                    </button>
                    <button 
                      onClick={() => handleClockOut(staff.id)}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm flex items-center"
                    >
                      <FiLogOut className="mr-1" /> Clock Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.clockIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.clockOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                          record.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Roles & Permissions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Role */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Admin</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Full access to all features
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Manage staff accounts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Configure system settings
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  View all reports
                </li>
              </ul>
            </div>
            
            {/* Manager Role */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Manager</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Manage inventory
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  View sales reports
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Approve staff schedules
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Limited staff management
                </li>
              </ul>
            </div>
            
            {/* Staff Role */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Staff</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Clock in/out
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  View assigned tasks
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Update personal profile
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Limited access to reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;