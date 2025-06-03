import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CiBookmarkPlus } from "react-icons/ci";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
} from '@heroicons/react/20/solid';
import NepaliDate from 'nepali-date-converter';

// --- Constants ---
const nepaliDayNames = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const nepaliMonthNames = [
  'बैशाख',
  'जेठ',
  'असार',
  'श्रावण',
  'भदौ',
  'आश्विन',
  'कार्तिक',
  'मंसिर',
  'पुष',
  'माघ',
  'फाल्गुन',
  'चैत्र',
];
const DAYS_IN_WEEK = 7;
const WEEKS_IN_MONTH_VIEW = 6;

// Time-based colors
const timeColors = {
  morning: 'bg-blue-600',
  day: 'bg-green-600',
  evening: 'bg-purple-600'
};

const today = new NepaliDate();
const initialBookings = [
  { 
    id: 1, 
    customer: 'Aaron Poe', 
    service: 'Hair Cut', 
    start: '10:30 AM', 
    end: '11:00 AM', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  },
  { 
    id: 4, 
    customer: 'Alyssa Henry', 
    service: 'Long Hair Cut', 
    start: '1:30 PM', 
    end: '02:30 PM', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  },
  { 
    id: 8, 
    customer: 'Michelle Chan', 
    service: 'Hair Cut', 
    start: '6:00 PM', 
    end: '7:00 PM', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  },
];

// Online booking requests data
const initialOnlineRequests = [
  {
    id: 101,
    customer: 'John Doe',
    service: 'Hair Coloring',
    dateTime: '2023-06-15 02:30 PM',
    status: 'Pending',
    source: 'Online'
  },
  {
    id: 102,
    customer: 'Jane Smith',
    service: 'Manicure',
    dateTime: '2023-06-16 11:00 AM',
    status: 'Approved',
    source: 'Online'
  },
  {
    id: 103,
    customer: 'Mike Johnson',
    service: 'Beard Trim',
    dateTime: '2023-06-14 04:15 PM',
    status: 'Rejected',
    source: 'Manual'
  },
];

// --- Helper Functions ---
const getDaysInNepaliMonth = (year, month) => {
  let date = new NepaliDate(year, month, 1);
  let count = 0;
  while (date.getMonth() === month) {
    count++;
    const jsDate = date.toJsDate();
    jsDate.setDate(jsDate.getDate() + 1);
    date = new NepaliDate(jsDate);
    if (count > 32) break;
  }
  return count;
};

const getTimeOfDay = (timeStr) => {
  const time = timeStr.toLowerCase();
  const hour = parseInt(time.split(':')[0]) + (time.includes('pm') && !time.includes('12:') ? 12 : 0);
  
  if (hour < 12) return 'morning';
  if (hour < 17) return 'day';
  return 'evening';
};

// --- Add Booking Modal ---
const AddBookingModal = ({ isOpen, onClose, onAddBooking, selectedDate, initialBooking }) => {
  const [customer, setCustomer] = useState(initialBooking?.customer || '');
  const [service, setService] = useState(initialBooking?.service || '');
  const [startTime, setStartTime] = useState(initialBooking?.start || '09:00 AM');
  const [endTime, setEndTime] = useState(initialBooking?.end || '10:00 AM');

  useEffect(() => {
    if (initialBooking) {
      setCustomer(initialBooking.customer);
      setService(initialBooking.service);
      setStartTime(initialBooking.start);
      setEndTime(initialBooking.end);
    } else {
      setCustomer('');
      setService('');
      setStartTime('09:00 AM');
      setEndTime('10:00 AM');
    }
  }, [initialBooking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const timeOfDay = getTimeOfDay(startTime);
    const color = timeColors[timeOfDay];
    
    const newBooking = {
      id: initialBooking?.id || Date.now(),
      customer,
      service,
      start: startTime,
      end: endTime,
      color,
      date: selectedDate.date,
      month: selectedDate.month,
      year: selectedDate.year,
    };
    
    onAddBooking(newBooking);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{initialBooking ? 'Edit' : 'Add'} Booking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="9:00 AM"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="10:00 AM"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm bg-gray-300 hover:bg-gray-400 rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-700 text-white rounded-md">
              {initialBooking ? 'Update' : 'Add'} Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddBooking: PropTypes.func.isRequired,
  selectedDate: PropTypes.shape({
    date: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  initialBooking: PropTypes.shape({
    id: PropTypes.number,
    customer: PropTypes.string,
    service: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    date: PropTypes.number,
    month: PropTypes.number,
    year: PropTypes.number,
  }),
};

// --- Booking Item Component ---
const BookingItem = ({ booking, onEdit, onDelete }) => {
  const timeOfDay = getTimeOfDay(booking.start);
  const timeLabel = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
  
  return (
    <div className={`${booking.color} text-white p-2 rounded mb-2 text-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{booking.customer}</div>
          <div>{booking.service}</div>
          <div>{booking.start} - {booking.end}</div>
          <div className="text-xs mt-1">{timeLabel}</div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(booking)}
            className="p-1 rounded-full hover:bg-blue-400"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(booking.id)}
            className="p-1 rounded-full hover:bg-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

BookingItem.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    customer: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// --- Online Booking Requests Table ---
const OnlineBookingRequests = ({ requests, onStatusChange }) => {
  const handleStatusChange = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.service}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.dateTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{request.status}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.source}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleStatusChange(request.id, 'Approved')}
                    className="text-green-500 hover:text-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(request.id, 'Rejected')}
                    className="text-red-500 hover:text-red-700"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OnlineBookingRequests.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customer: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      dateTime: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

// --- Calendar Component ---
const CalendarView = ({ 
  bookings, 
  onAddBooking, 
  onDeleteBooking
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new NepaliDate());
  const [monthGrid, setMonthGrid] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  });
  const [selectedBooking, setSelectedBooking] = useState(null);

  const generateMonthGrid = useCallback((date) => {
    const year = date.getYear();
    const month = date.getMonth();

    const firstDayOfMonth = new NepaliDate(year, month, 1);
    const gregorianFirstDay = firstDayOfMonth.toJsDate();
    const startDayOfWeek = gregorianFirstDay.getDay();

    const daysInMonth = getDaysInNepaliMonth(year, month);
    const grid = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push({ type: 'empty' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDayNepali = new NepaliDate(year, month, i);
      const hasBookings = bookings.some(b => 
        b.date === i && 
        b.month === month && 
        b.year === year
      );
      
      grid.push({
        type: 'day',
        date: i,
        month,
        year,
        nepali: currentDayNepali,
        isToday:
          currentDayNepali.getYear() === today.getYear() &&
          currentDayNepali.getMonth() === today.getMonth() &&
          currentDayNepali.getDate() === today.getDate(),
        hasBookings
      });
    }

    while (grid.length < WEEKS_IN_MONTH_VIEW * DAYS_IN_WEEK) {
      grid.push({ type: 'empty' });
    }

    return grid;
  }, [bookings]);

  useEffect(() => {
    setMonthGrid(generateMonthGrid(viewDate));
  }, [viewDate, generateMonthGrid]);

  const navigateMonth = (direction) => {
    setViewDate((prev) => {
      let newYear = prev.getYear();
      let newMonth = prev.getMonth() + direction;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      return new NepaliDate(newYear, newMonth, 1);
    });
  };

  const goToToday = () => {
    const today = new NepaliDate();
    setViewDate(today);
    setSelectedDate({
      date: today.getDate(),
      month: today.getMonth(),
      year: today.getYear()
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate({
      date: day.date,
      month: day.month,
      year: day.year
    });
  };

  const selectedDateBookings = bookings.filter(b => 
    b.date === selectedDate.date && 
    b.month === selectedDate.month && 
    b.year === selectedDate.year
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 rounded text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {`${nepaliMonthNames[viewDate.getMonth()]} ${viewDate.getYear()}`}
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 rounded text-gray-500 hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          >
            Today
          </button>
        </div>
        <button
          onClick={() => {
            setSelectedBooking(null);
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center text-sm hover:bg-green-700"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Booking
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-gray-500 mb-1">
        {nepaliDayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {monthGrid.map((cell, index) => (
          <div
            key={index}
            className={`bg-white min-h-12 p-1 border border-gray-200 ${
              cell.type === 'empty' ? 'bg-gray-50' : ''
            } ${cell.type === 'day' && cell.date === selectedDate.date && cell.month === selectedDate.month && cell.year === selectedDate.year ? 'ring-2 ring-green-400' : ''}`}
            onClick={() => cell.type === 'day' && handleDateClick(cell)}
          >
            {cell.type === 'day' && (
              <div className="flex flex-col h-full">
                <div
                  className={`self-center text-xs p-1 rounded-full w-6 h-6 flex items-center justify-center ${
                    cell.isToday ? 'bg-black text-white' : ''
                  }`}
                >
                  {cell.date}
                </div>
                {cell.hasBookings && (
                  <div className="flex justify-center mt-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bookings Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">
            Bookings for {selectedDate.date} {nepaliMonthNames[selectedDate.month]} {selectedDate.year}
          </h2>
          <div className="text-sm text-gray-500">
            {selectedDateBookings.length} appointment{selectedDateBookings.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {selectedDateBookings.length > 0 ? (
          <div className="space-y-2">
            {selectedDateBookings.map(booking => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onEdit={(booking) => {
                  setSelectedBooking(booking);
                  setIsModalOpen(true);
                }}
                onDelete={onDeleteBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No bookings for this day
          </div>
        )}
      </div>

      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBooking={(newBooking) => {
          onAddBooking(newBooking);
          setIsModalOpen(false);
        }}
        selectedDate={selectedDate}
        initialBooking={selectedBooking}
      />
    </div>
  );
};

CalendarView.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customer: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    })
  ).isRequired,
  onAddBooking: PropTypes.func.isRequired,
  onDeleteBooking: PropTypes.func.isRequired,
};

// --- Main Component ---
const BookingSystem = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [bookings, setBookings] = useState(initialBookings.map(booking => {
    const timeOfDay = getTimeOfDay(booking.start);
    return {
      ...booking,
      color: timeColors[timeOfDay]
    };
  }));
  const [onlineRequests, setOnlineRequests] = useState(initialOnlineRequests);

  const handleAddBooking = (newBooking) => {
    if (newBooking.id && bookings.some(b => b.id === newBooking.id)) {
      setBookings(bookings.map(b => b.id === newBooking.id ? newBooking : b));
    } else {
      setBookings([...bookings, newBooking]);
    }
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleRequestStatusChange = (id, newStatus) => {
    setOnlineRequests(onlineRequests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('requests')}
        >
          <CiBookmarkPlus className="h-4 w-4 mr-2" />
          Online Booking Requests
        </button>
      </div>

      {activeTab === 'calendar' ? (
        <CalendarView
          bookings={bookings}
          onAddBooking={handleAddBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold mb-4">Online Booking Requests</h1>
          <OnlineBookingRequests 
            requests={onlineRequests} 
            onStatusChange={handleRequestStatusChange} 
          />
        </div>
      )}
    </div>
  );
};

export default BookingSystem;