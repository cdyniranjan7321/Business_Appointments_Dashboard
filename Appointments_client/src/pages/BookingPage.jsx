import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
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

// --- Initial Data ---
const staff = [
  { id: 1, name: 'Rob Olson', color: 'bg-blue-500' },
  { id: 2, name: 'Alaina Tyrer', color: 'bg-green-500' },
  { id: 3, name: 'Wendy Xu', color: 'bg-purple-500' },
];

const today = new NepaliDate();
const initialBookings = [
  { 
    id: 1, 
    staffId: 1, 
    customer: 'Aaron Poe', 
    service: 'Hair Cut', 
    start: '10:30 AM', 
    end: '11:00 AM', 
    color: 'bg-blue-600', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  },
  { 
    id: 4, 
    staffId: 2, 
    customer: 'Alyssa Henry', 
    service: 'Long Hair Cut', 
    start: '9:30 AM', 
    end: '10:30 AM', 
    color: 'bg-green-600', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
  },
  { 
    id: 8, 
    staffId: 3, 
    customer: 'Michelle Chan', 
    service: 'Hair Cut', 
    start: '10:00 AM', 
    end: '11:00 AM', 
    color: 'bg-purple-600', 
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getYear()
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

// --- Add Booking Modal ---
const AddBookingModal = ({ isOpen, onClose, onAddBooking, staffList, selectedDate, initialBooking }) => {
  const [customer, setCustomer] = useState(initialBooking?.customer || '');
  const [service, setService] = useState(initialBooking?.service || '');
  const [staffMember, setStaffMember] = useState(initialBooking?.staffId || staffList[0]?.id);
  const [startTime, setStartTime] = useState(initialBooking?.start || '09:00 AM');
  const [endTime, setEndTime] = useState(initialBooking?.end || '09:30 AM');

  useEffect(() => {
    if (initialBooking) {
      setCustomer(initialBooking.customer);
      setService(initialBooking.service);
      setStaffMember(initialBooking.staffId);
      setStartTime(initialBooking.start);
      setEndTime(initialBooking.end);
    } else {
      setCustomer('');
      setService('');
      setStaffMember(staffList[0]?.id);
      setStartTime('09:00 AM');
      setEndTime('09:30 AM');
    }
  }, [initialBooking, staffList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!staffMember) return;
    
    const selectedStaff = staffList.find(s => s.id === parseInt(staffMember));
    if (!selectedStaff) return;
    
    const newBooking = {
      id: initialBooking?.id || Date.now(),
      staffId: parseInt(staffMember),
      customer,
      service,
      start: startTime,
      end: endTime,
      color: selectedStaff.color.replace('500', '600'),
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5" />
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
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Staff Member</label>
            <select
              value={staffMember}
              onChange={(e) => setStaffMember(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            >
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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
                placeholder="9:30 AM"
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

// --- Booking Item Component ---
const BookingItem = ({ booking, staffList, onEdit, onDelete }) => {
  const staffMember = staffList.find(s => s.id === booking.staffId);
  
  return (
    <div className={`${booking.color} text-white p-2 rounded mb-2 text-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{booking.customer}</div>
          <div>{booking.service}</div>
          <div>{booking.start} - {booking.end}</div>
          {staffMember && <div className="text-xs mt-1">{staffMember.name}</div>}
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(booking)}
            className="p-1 rounded-full hover:bg-black/10"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(booking.id)}
            className="p-1 rounded-full hover:bg-black/10"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Calendar Component ---
const Calendar = () => {
  const [bookings, setBookings] = useState(initialBookings);
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

  const handleAddBooking = (newBooking) => {
    if (selectedBooking) {
      setBookings(bookings.map(b => b.id === selectedBooking.id ? newBooking : b));
    } else {
      setBookings([...bookings, newBooking]);
    }
    setSelectedBooking(null);
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

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
            } ${cell.type === 'day' && cell.date === selectedDate.date && cell.month === selectedDate.month && cell.year === selectedDate.year ? 'ring-2 ring-green-500' : ''}`}
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
                staffList={staff}
                onEdit={handleEditBooking}
                onDelete={handleDeleteBooking}
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
        onAddBooking={handleAddBooking}
        staffList={staff}
        selectedDate={selectedDate}
        initialBooking={selectedBooking}
      />
    </div>
  );
};

export default Calendar;