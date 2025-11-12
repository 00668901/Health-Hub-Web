import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface MedicalCalendarProps {
  onDateClick?: (date: Date) => void;
  role: 'admin' | 'doctor' | 'patient';
}

interface Event {
  id: string;
  date: Date;
  title: string;
  patient: string;
  doctor: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
}

const mockEvents: Event[] = [
  { id: '1', date: new Date(2025, 9, 25), title: 'Konsultasi', patient: 'Budi Santoso', doctor: 'Dr. Sarah', time: '09:00', status: 'scheduled' },
  { id: '2', date: new Date(2025, 9, 25), title: 'Kontrol', patient: 'Siti Nurhaliza', doctor: 'Dr. Ahmad', time: '10:30', status: 'completed' },
  { id: '3', date: new Date(2025, 9, 26), title: 'Operasi', patient: 'Andi Wijaya', doctor: 'Dr. Budi', time: '14:00', status: 'scheduled' },
  { id: '4', date: new Date(2025, 9, 27), title: 'Konsultasi', patient: 'Maya Putri', doctor: 'Dr. Linda', time: '11:00', status: 'pending' },
];

export default function MedicalCalendar({ onDateClick, role }: MedicalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return mockEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h3 className="text-gray-900 ml-2">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hari Ini
          </Button>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              Bulan
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              Minggu
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Names */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const events = getEventsForDate(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                onClick={() => day && onDateClick && onDateClick(day)}
                className={`min-h-[100px] border-b border-r border-gray-200 p-2 ${
                  day ? 'bg-white hover:bg-blue-50 cursor-pointer transition-colors' : 'bg-gray-50'
                } ${index % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm ${isTodayDate ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(event.status)} text-white truncate`}
                          title={`${event.time} - ${event.patient}`}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-600 pl-2">
                          +{events.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
