import React, { useState, useEffect } from 'react';
import { Car, Clock, MapPin, Calendar, CreditCard, CheckCircle2, Menu, Bell, Search, Filter, ChevronDown } from 'lucide-react';

const ParkingApp = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [view, setView] = useState('floor1');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const parkingLayout = {
    rows: [
      {
        section: 'A',
        slots: [
          { id: 'A-101', status: 'occupied', timeRemaining: '1h 23m' },
          { id: 'A-102', status: 'occupied', timeRemaining: '45m' },
          { id: 'A-103', status: 'available', price: 5.00, type: 'standard' },
          { id: 'A-104', status: 'available', price: 5.00, type: 'standard' },
          { id: 'A-105', status: 'occupied', timeRemaining: '2h 15m' },
          { id: 'A-106', status: 'occupied', timeRemaining: '30m' },
        ]
      },
      {
        section: 'B',
        slots: [
          { id: 'B-201', status: 'available', price: 8.00, type: 'premium' },
          { id: 'B-202', status: 'available', price: 8.00, type: 'premium' },
          { id: 'B-203', status: 'available', price: 8.00, type: 'premium' },
        ]
      },
      {
        section: 'C',
        slots: [
          { id: 'C-301', status: 'occupied', timeRemaining: '1h 50m' },
          { id: 'C-302', status: 'available', price: 6.00, type: 'standard' },
          { id: 'C-303', status: 'occupied', timeRemaining: '3h 10m' },
        ]
      },
      {
        section: 'D',
        slots: [
          { id: 'D-401', status: 'occupied', timeRemaining: '40m' },
          { id: 'D-402', status: 'occupied', timeRemaining: '1h 05m' },
          { id: 'D-403', status: 'occupied', timeRemaining: '2h 30m' },
          { id: 'D-404', status: 'available', price: 5.00, type: 'standard' },
          { id: 'D-405', status: 'occupied', timeRemaining: '55m' },
          { id: 'D-406', status: 'occupied', timeRemaining: '1h 40m' },
        ]
      }
    ]
  };

  const availableSlots = parkingLayout.rows.reduce((count, row) => 
    count + row.slots.filter(s => s.status === 'available').length, 0
  );

  const totalSlots = parkingLayout.rows.reduce((count, row) => count + row.slots.length, 0);

  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
    }
  };

  const handleBookNow = () => {
    if (selectedSlot) {
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingConfirmed(false);
      setSelectedSlot(null);
    }, 2500);
  };

  const ParkingSlot = ({ slot, isVertical = false }) => {
    const isSelected = selectedSlot?.id === slot.id;
    const isAvailable = slot.status === 'available';
    const isPremium = slot.type === 'premium';
    
    return (
      <div
        onClick={() => handleSlotClick(slot)}
        className={`
          ${isVertical ? 'w-20 h-32' : 'w-32 h-20'}
          rounded border-2 transition-all duration-200
          flex flex-col items-center justify-center p-2 relative
          ${isAvailable 
            ? isSelected 
              ? 'bg-blue-50 border-blue-500 shadow-md cursor-pointer' 
              : isPremium
                ? 'bg-white border-indigo-300 hover:border-indigo-400 cursor-pointer hover:shadow-sm'
                : 'bg-white border-gray-300 hover:border-gray-400 cursor-pointer hover:shadow-sm'
            : 'bg-gray-100 border-gray-300 cursor-not-allowed'
          }
        `}
      >
        {!isAvailable ? (
          <>
            <Car className="text-gray-400 mb-1" size={20} strokeWidth={1.5} />
            <span className="text-gray-600 text-xs font-medium">{slot.id}</span>
            <span className="text-gray-500 text-xs mt-1">{slot.timeRemaining}</span>
          </>
        ) : (
          <>
            {isPremium && (
              <span className="absolute top-1 right-1 text-indigo-500 text-xs font-semibold px-1.5 py-0.5 bg-indigo-50 rounded">P</span>
            )}
            <span className="text-gray-700 text-sm font-semibold mb-1">{slot.id}</span>
            <span className="text-green-600 text-xs font-medium">${slot.price.toFixed(2)}/hr</span>
            {isSelected && (
              <CheckCircle2 className="text-blue-500 absolute bottom-1" size={16} />
            )}
          </>
        )}
      </div>
    );
  };

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
        {!bookingConfirmed ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <h3 className="text-xl font-semibold text-white">Confirm Booking</h3>
              <p className="text-blue-100 text-sm mt-1">Review your parking reservation</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Parking Space</p>
                    <p className="text-gray-900 text-2xl font-bold">{selectedSlot?.id}</p>
                  </div>
                  {selectedSlot?.type === 'premium' && (
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>Al Khaburah Mall - Ground Floor, Section {selectedSlot?.id.charAt(0)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Calendar size={14} />
                    <span>Start Time</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Clock size={14} />
                    <span>Duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium"
                    >
                      −
                    </button>
                    <span className="text-gray-900 font-semibold w-16 text-center">{duration} hrs</span>
                    <button 
                      onClick={() => setDuration(duration + 1)}
                      className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Parking Rate</span>
                  <span className="text-gray-900 font-medium">${selectedSlot?.price.toFixed(2)}/hr</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900 font-medium">{duration} hours</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">Total Amount</span>
                    <span className="text-blue-600 text-2xl font-bold">${((selectedSlot?.price || 0) * duration).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600">Space {selectedSlot?.id} has been reserved</p>
            <p className="text-sm text-gray-500 mt-3">Confirmation sent to your email</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">ParkSmart</h1>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</a>
                <a href="#" className="text-blue-600 font-medium">Find Parking</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">My Bookings</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Al Khaburah Mall Parking</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Al Khaburah, Oman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Open 24/7</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Availability</div>
              <div className="text-3xl font-bold text-gray-900">{availableSlots}<span className="text-gray-400 text-xl">/{totalSlots}</span></div>
              <div className="text-sm text-green-600 font-medium mt-1">{Math.round((availableSlots / totalSlots) * 100)}% Available</div>
            </div>
          </div>
        </div>

        {/* Filters & Info Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              <span>Ground Floor</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white border-2 border-gray-400 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 border-2 border-gray-300 rounded"></div>
              <span className="text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-50 border-2 border-indigo-300 rounded"></div>
              <span className="text-gray-600">Premium</span>
            </div>
          </div>
        </div>

        {/* Parking Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-12">
            {/* Section A */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Section A</h3>
                <span className="text-sm text-gray-500">Standard Parking</span>
              </div>
              <div className="flex justify-start gap-3 flex-wrap">
                {parkingLayout.rows[0].slots.map((slot) => (
                  <ParkingSlot key={slot.id} slot={slot} isVertical={true} />
                ))}
              </div>
            </div>

            {/* Section B - Premium */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Section B</h3>
                <span className="text-sm text-indigo-600 font-medium">Premium Parking - Covered Area</span>
              </div>
              <div className="flex justify-center gap-4">
                {parkingLayout.rows[1].slots.map((slot) => (
                  <ParkingSlot key={slot.id} slot={slot} isVertical={true} />
                ))}
              </div>
            </div>

            {/* Section C */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Section C</h3>
                <span className="text-sm text-gray-500">Standard Parking</span>
              </div>
              <div className="flex justify-center gap-3">
                {parkingLayout.rows[2].slots.map((slot) => (
                  <ParkingSlot key={slot.id} slot={slot} />
                ))}
              </div>
            </div>

            {/* Section D */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Section D</h3>
                <span className="text-sm text-gray-500">Standard Parking</span>
              </div>
              <div className="flex justify-start gap-3 flex-wrap">
                {parkingLayout.rows[3].slots.map((slot) => (
                  <ParkingSlot key={slot.id} slot={slot} isVertical={true} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        {selectedSlot && (
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={handleBookNow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>Book Space {selectedSlot.id}</span>
              <span className="text-blue-100">→</span>
            </button>
          </div>
        )}
      </div>

      {showBookingModal && <BookingModal />}
    </div>
  );
};

export default ParkingApp;