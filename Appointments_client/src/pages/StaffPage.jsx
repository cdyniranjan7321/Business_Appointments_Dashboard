import React, { useEffect, useState } from 'react';
import { FiUser, FiClock, FiKey, FiSettings, FiLogIn, FiLogOut, FiPlus, FiEdit2, FiTrash2, 
  FiCheck, FiX, FiLock } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    confirmPassword: '',
    pin: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    pin: '',
    usePin: false
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState(null);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showStaffFormModal, setShowStaffFormModal] = useState(false);

  // Staff and attendance data
  const [staffMembers, setStaffMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:6001/api/staff');
      setStaffMembers(res.data.staff);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch staff');
      toast.error(err.response?.data?.error || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  fetchStaff();
}, []);

useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:6001/api/staff/attendance');
      setAttendance(res.data.attendance);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  fetchAttendance();
}, []);

  const handleStaffFormChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStaffSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    
    if (!staffForm.pin && staffForm.password !== staffForm.confirmPassword) {
      throw new Error("Passwords don't match!");
    }

    if (staffForm.pin && !/^\d{4}$/.test(staffForm.pin)) {
      throw new Error("PIN must be 4 digits!");
    }

    if (editMode) {
      const res = await axios.put(`/api/staff/${currentStaffId}`, staffForm);
      setStaffMembers(staffMembers.map(staff => 
        staff.id === currentStaffId ? res.data.staff : staff
      ));
      toast.success('Staff updated successfully');
    } else {
      const res = await axios.post('http://localhost:6001/api/staff', staffForm);
      setStaffMembers([...staffMembers, res.data.staff]);
      toast.success('Staff added successfully');
    }

    // Reset form
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      role: 'staff',
      password: '',
      confirmPassword: '',
      pin: ''
    });
    setEditMode(false);
    setCurrentStaffId(null);
    setShowStaffFormModal(false);
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    toast.error(err.response?.data?.error || err.message);
  } finally {
    setLoading(false);
  }
};

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axios.post('http://localhost:6001/api/staff/login', loginForm);
    toast.success(`Welcome back, ${res.data.staff.name}!`);
    
    setStaffMembers(staffMembers.map(s => 
      s.id === res.data.staff.id ? { ...s, lastLogin: new Date().toLocaleString() } : s
    ));
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed');
    toast.error(err.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
    setLoginForm({ email: '', password: '', pin: '', usePin: false });
  }
};

  const handleEditStaff = (staff) => {
    setStaffForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      position: staff.position,
      role: staff.role,
      password: '',
      confirmPassword: '',
      pin: staff.pin || ''
    });
    setEditMode(true);
    setCurrentStaffId(staff.id);
    setShowStaffFormModal(true);
  };

  const handleClockIn = async (staffId) => {
  try {
    await axios.post('http://localhost:6001/api/staff/attendance', { 
      staffId, 
      action: 'clockIn' 
    });
    
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5);
    
    const existingRecord = attendance.find(a => 
      a.staffId === staffId && a.date === currentDate
    );
    
    if (existingRecord) {
      setAttendance(attendance.map(a => 
        a.id === existingRecord.id ? { 
          ...a, 
          clockIn: timeString,
          status: getAttendanceStatus(timeString)
        } : a
      ));
    } else {
      const staff = staffMembers.find(s => s.id === staffId);
      const newAttendanceRecord = {
        id: attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
        staffId,
        name: staff.name,
        date: currentDate,
        clockIn: timeString,
        clockOut: '',
        status: getAttendanceStatus(timeString)
      };
      setAttendance([...attendance, newAttendanceRecord]);
    }
    toast.success('Clocked in successfully');
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to clock in');
  }
};

const handleClockOut = async (staffId) => {
  try {
    await axios.post('http://localhost:6001/api/staff/attendance', { 
      staffId, 
      action: 'clockOut' 
    });
    
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5);
    
    setAttendance(attendance.map(a => 
      a.staffId === staffId && a.date === currentDate ? { 
        ...a, 
        clockOut: timeString 
      } : a
    ));
    toast.success('Clocked out successfully');
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to clock out');
  }
};

  const getAttendanceStatus = (clockInTime) => {
    const [hours, minutes] = clockInTime.split(':').map(Number);
    if (hours > 8 || (hours === 8 && minutes > 0)) return 'late';
    return 'present';
  };

  const handleDeleteStaff = async (id) => {
  if (window.confirm('Are you sure you want to delete this staff member?')) {
    try {
      await axios.delete(`http://localhost:6001/api/staff/${id}`);
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
      setAttendance(attendance.filter(record => record.staffId !== id));
      toast.success('Staff member deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete staff');
    }
  }
};

  const handleResetPassword = async (id) => {
  const staff = staffMembers.find(s => s.id === id);
  const resetType = window.confirm("Reset password? Click OK for password, Cancel for PIN");
  
  try {
    if (resetType) {
      const newPassword = prompt("Enter new password for this staff member:");
      if (newPassword) {
        await axios.put(`http://localhost:6001/api/staff/${id}`, { password: newPassword });
        setStaffMembers(staffMembers.map(s => 
          s.id === id ? { ...s, password: newPassword } : s
        ));
        toast.success(`Password for ${staff.name} has been reset.`);
      }
    } else {
      const newPin = prompt("Enter new 4-digit PIN for this staff member:");
      if (newPin && /^\d{4}$/.test(newPin)) {
        await axios.put(`http://localhost:6001/api/staff/${id}`, { pin: newPin });
        setStaffMembers(staffMembers.map(s => 
          s.id === id ? { ...s, pin: newPin } : s
        ));
        toast.success(`PIN for ${staff.name} has been reset.`);
      } else {
        toast.error("PIN must be 4 digits!");
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to reset credentials');
  }
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
            <button 
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              onClick={() => {
                setEditMode(false);
                setStaffForm({
                  name: '',
                  email: '',
                  phone: '',
                  position: '',
                  role: 'staff',
                  password: '',
                  confirmPassword: '',
                  pin: ''
                });
                setShowStaffFormModal(true);
              }}
            >
              <FiPlus className="mr-2" /> Add Staff
            </button>
          </div>
          

          {/* Staff Form Modal */}
{showStaffFormModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center sticky top-0 bg-white p-6 pb-0">
        <h3 className="text-lg font-medium text-gray-800">
          {editMode ? 'Edit Staff Profile' : 'Create Staff Profile'}
        </h3>
        <button 
          onClick={() => {
            setShowStaffFormModal(false);
            setEditMode(false);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="text-xl" />
        </button>
      </div>
      <form onSubmit={handleStaffSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={staffForm.name}
              onChange={handleStaffFormChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md"
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
              className="w-full px-3 py-2 border border-green-300 rounded-md"
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
              className="w-full px-3 py-2 border border-green-300 rounded-md"
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
              className="w-full px-3 py-2 border border-green-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={staffForm.role}
              onChange={handleStaffFormChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md"
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="staff">Software Developer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={staffForm.password}
              onChange={handleStaffFormChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md"
              required={!staffForm.pin}
              disabled={!!staffForm.pin}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={staffForm.confirmPassword}
              onChange={handleStaffFormChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md"
              required={!staffForm.pin}
              disabled={!!staffForm.pin}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiLock className="inline mr-1" /> 
              PIN (4 digits, optional - can be used instead of password)
            </label>
            <input
              type="password"
              name="pin"
              value={staffForm.pin}
              onChange={handleStaffFormChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md"
              maxLength="4"
              pattern="\d{4}"
              placeholder="Enter 4-digit PIN (optional)"
            />
          </div>
        </div>
        <div className="mt-6 flex space-x-4 sticky bottom-0 bg-white pt-4 pb-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          >
            {editMode ? 'Update Staff' : 'Create Staff'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowStaffFormModal(false);
              setEditMode(false);
            }}
            className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
          
          {/* Staff List */}
          {staffMembers.length > 0 ? (
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
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => handleEditStaff(staff)}
                        >
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
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Staff Members Found</h3>
              <p className="text-gray-500 mb-4">Add your first staff member to get started</p>
            </div>
          )}
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
                    className="w-full px-3 py-2 border border-green-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="usePin"
                    checked={loginForm.usePin}
                    onChange={() => setLoginForm(prev => ({ ...prev, usePin: !prev.usePin }))}
                    className="mr-2"
                  />
                  <label htmlFor="usePin" className="text-sm text-gray-700">
                    Login with PIN instead of password
                  </label>
                </div>
                
                {loginForm.usePin ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                    <input
                      type="password"
                      name="pin"
                      value={loginForm.pin}
                      onChange={handleLoginFormChange}
                      className="w-full px-3 py-2 border border-green-300 rounded-md"
                      maxLength="4"
                      pattern="\d{4}"
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginFormChange}
                      className="w-full px-3 py-2 border border-green-300 rounded-md"
                      required
                    />
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                >
                  Login
                </button>
              </form>
            </div>
            
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Status</h3>
              {staffMembers.length > 0 ? (
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
                          <button 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            onClick={() => handleResetPassword(staff.id)}
                          >
                            Reset Password/PIN
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">No staff accounts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Attendance</h2>
          
          {/* Current Status */}
          {staffMembers.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Attendance ({currentDate})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {staffMembers.map(staff => {
                    const todayRecord = attendance.find(a => 
                      a.staffId === staff.id && a.date === currentDate
                    );
                    
                    return (
                      <div key={staff.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-500">{staff.position}</p>
                          </div>
                          {todayRecord?.clockIn ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
                              <FiCheck className="mr-1" /> Clocked In at {todayRecord.clockIn}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 flex items-center">
                              <FiX className="mr-1" /> Not Clocked In
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button 
                            onClick={() => handleClockIn(staff.id)}
                            disabled={todayRecord?.clockIn}
                            className={`px-3 py-1 rounded text-sm flex items-center 
                              ${todayRecord?.clockIn ? 
                                'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                                'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                          >
                            <FiLogIn className="mr-1" /> Clock In
                          </button>
                          <button 
                            onClick={() => handleClockOut(staff.id)}
                            disabled={!todayRecord?.clockIn || todayRecord?.clockOut}
                            className={`px-3 py-1 rounded text-sm flex items-center 
                              ${!todayRecord?.clockIn || todayRecord?.clockOut ? 
                                'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                                'bg-red-100 text-red-800 hover:bg-red-200'}`}
                          >
                            <FiLogOut className="mr-1" /> Clock Out
                          </button>
                        </div>
                        {todayRecord?.clockOut && (
                          <div className="mt-2 text-sm text-gray-600">
                            Clocked out at {todayRecord.clockOut}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Attendance Records */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Attendance History</h3>
                  <div className="flex items-center">
                    <label htmlFor="date-filter" className="mr-2 text-sm text-gray-600">Filter by date:</label>
                    <input 
                      type="date" 
                      id="date-filter" 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                {attendance.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendance.map(record => {
                        let hoursWorked = 'N/A';
                        if (record.clockIn && record.clockOut) {
                          const [inHour, inMin] = record.clockIn.split(':').map(Number);
                          const [outHour, outMin] = record.clockOut.split(':').map(Number);
                          const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
                          hoursWorked = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
                        }
                        
                        return (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{record.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.clockIn || '--:--'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.clockOut || '--:--'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                                  record.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {hoursWorked}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500">No attendance records found</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Staff Members Found</h3>
              <p className="text-gray-500 mb-4">Add staff members to track attendance</p>
              <button 
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center mx-auto"
                onClick={() => setActiveTab('profiles')}
              >
                <FiPlus className="mr-2" /> Add Staff
              </button>
            </div>
          )}
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
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Manage roles and permissions
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Assigned to: {staffMembers.filter(s => s.role === 'admin').length} staff</p>
              </div>
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
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Process refunds and discounts
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Assigned to: {staffMembers.filter(s => s.role === 'manager').length} staff</p>
              </div>
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
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Process sales transactions
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Assigned to: {staffMembers.filter(s => s.role === 'staff').length} staff</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;