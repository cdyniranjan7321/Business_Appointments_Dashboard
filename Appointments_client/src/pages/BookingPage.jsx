import { useState, } from 'react';
import { FiCalendar, FiUser, FiPlus, FiCheck, FiX, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

const Booking = () => {
  // State for form inputs
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    staffId: '',
    date: '',
    time: '',
    notes: '',
    status: 'confirmed'
  });

  const [activeTab, setActiveTab] = useState('new');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Sample data - replace with actual data from your backend
  const [services] = useState([
    { id: 1, name: 'Haircut', duration: 30, price: 2500 },
    { id: 2, name: 'Manicure', duration: 45, price: 3500 },
    { id: 3, name: 'Massage', duration: 60, price: 8000 }
  ]);

  const [staffMembers] = useState([
    { id: 1, name: 'John Doe', position: 'Stylist' },
    { id: 2, name: 'Jane Smith', position: 'Nail Technician' },
    { id: 3, name: 'Mike Johnson', position: 'Massage Therapist' }
  ]);

  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      bookingNumber: 'BK-1001', 
      customerName: 'Sarah Williams', 
      customerPhone: '555-123-4567', 
      service: 'Haircut', 
      staff: 'John Doe', 
      date: '2023-06-15', 
      time: '10:00', 
      duration: 30, 
      price: 2500, 
      status: 'confirmed',
      source: 'online',
      createdAt: '2023-06-10 09:30'
    },
    { 
      id: 2, 
      bookingNumber: 'BK-1002', 
      customerName: 'Michael Brown', 
      customerPhone: '555-987-6543', 
      service: 'Manicure', 
      staff: 'Jane Smith', 
      date: '2023-06-15', 
      time: '14:30', 
      duration: 45, 
      price: 3500, 
      status: 'pending',
      source: 'online',
      createdAt: '2023-06-11 11:15'
    },
    { 
      id: 3, 
      bookingNumber: 'BK-1003', 
      customerName: 'Lisa Taylor', 
      customerPhone: '555-456-7890', 
      service: 'Massage', 
      staff: 'Mike Johnson', 
      date: '2023-06-16', 
      time: '11:00', 
      duration: 60, 
      price: 8000, 
      status: 'completed',
      source: 'manual',
      createdAt: '2023-06-12 15:45'
    }
  ]);

  // Calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Generate calendar days
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Generate time slots for selected date
  const generateTimeSlots = (date) => {
    if (!date) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings.filter(b => b.date === dateStr);
    const slots = [];
    const businessHours = { start: 9, end: 17 }; // 9AM to 5PM
    const slotDuration = 15; // minutes

    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if slot is booked
        const isBooked = dayBookings.some(booking => {
          const bookingTime = parseISO(`${dateStr}T${booking.time}:00`);
          const slotTime = parseISO(`${dateStr}T${time}:00`);
          const bookingEnd = new Date(bookingTime.getTime() + booking.duration * 60000);
          return slotTime >= bookingTime && slotTime < bookingEnd;
        });
        
        slots.push({
          time,
          isBooked,
          isSelected: bookingForm.time === time && bookingForm.date === dateStr
        });
      }
    }
    
    return slots;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    setBookingForm(prev => ({ ...prev, date: dateStr }));
    setAvailableSlots(generateTimeSlots(date));
  };

  // Handle slot selection
  const handleSlotSelect = (time) => {
    setBookingForm(prev => ({ ...prev, time }));
    setAvailableSlots(availableSlots.map(slot => ({
      ...slot,
      isSelected: slot.time === time
    })));
  };

  // Handle form input changes
  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
      id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
      bookingNumber: `BK-${1000 + (bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1)}`,
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail,
      service: services.find(s => s.id === parseInt(bookingForm.serviceId))?.name || '',
      staff: staffMembers.find(s => s.id === parseInt(bookingForm.staffId))?.name || '',
      date: bookingForm.date,
      time: bookingForm.time,
      duration: services.find(s => s.id === parseInt(bookingForm.serviceId))?.duration || 0,
      price: services.find(s => s.id === parseInt(bookingForm.serviceId))?.price || 0,
      status: bookingForm.status,
      source: 'manual',
      createdAt: new Date().toISOString(),
      notes: bookingForm.notes
    };
    
    setBookings([newBooking, ...bookings]);
    
    // Reset form
    setBookingForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceId: '',
      staffId: '',
      date: '',
      time: '',
      notes: '',
      status: 'confirmed'
    });
    setSelectedDate(null);
    setAvailableSlots([]);
  };

  // Update booking status
  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Modified Booking Details section with calendar
  const renderBookingDetails = () => (
    <div className="md:col-span-2">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <FiCalendar className="mr-2" /> Booking Details
      </h3>
      
      {/* Calendar View */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="text-gray-600" />
          </button>
          <h4 className="text-md font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h4>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronRight className="text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dayBookings = bookings.filter(b => 
              isSameDay(parseISO(b.date), day)
            );
            
            return (
              <div
                key={day.toString()}
                onClick={() => handleDateSelect(day)}
                className={`p-2 h-12 border rounded-md cursor-pointer text-center transition-colors
                  ${!isSameMonth(day, currentMonth) ? 'bg-gray-50 text-gray-400' : ''}
                  ${isSameDay(day, selectedDate) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="text-sm">
                  {format(day, 'd')}
                </div>
                {dayBookings.length > 0 && (
                  <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-blue-500"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Time Slot Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Available Times for {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot.time}
                onClick={() => handleSlotSelect(slot.time)}
                disabled={slot.isBooked}
                className={`p-2 rounded-md text-center text-sm font-medium transition-colors
                  ${slot.isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${slot.isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Service and Staff Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service*</label>
          <select
            name="serviceId"
            value={bookingForm.serviceId}
            onChange={handleBookingFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} (रु {service.price})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
          <select
            name="staffId"
            value={bookingForm.staffId}
            onChange={handleBookingFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Any Available</option>
            {staffMembers.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('new')}
        >
          <FiPlus className="inline mr-2" /> New Booking
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('requests')}
        >
          <FiCalendar className="inline mr-2" /> Booking Requests
        </button>
      </div>
      
      {/* New Booking Form */}
      {activeTab === 'new' && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Manual Booking</h2>
          
          <form onSubmit={handleBookingSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="customerName"
                      value={bookingForm.customerName}
                      onChange={handleBookingFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={bookingForm.customerPhone}
                      onChange={handleBookingFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={bookingForm.customerEmail}
                      onChange={handleBookingFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Booking Details - Now with Calendar */}
              {renderBookingDetails()}
              
              {/* Additional Information */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={bookingForm.status}
                      onChange={handleBookingFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={bookingForm.notes}
                      onChange={handleBookingFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center"
              >
                <FiCheck className="mr-2" /> Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Booking Requests */}
      {activeTab === 'requests' && (
        <div>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FiFilter className="text-gray-400 mr-2" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.service}</div>
                          <div className="text-sm text-gray-500">रु {booking.price} • {booking.duration} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.staff}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.source === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.source.charAt(0).toUpperCase() + booking.source.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Confirm"
                                >
                                  <FiCheck />
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel"
                                >
                                  <FiX />
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Completed"
                              >
                                <FiCheck />
                              </button>
                            )}
                            {(booking.status === 'confirmed' || booking.status === 'pending') && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel"
                                >
                                <FiX />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;