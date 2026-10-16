import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Coffee,
  CheckCircle2,
  AlertCircle,
  X,
  FileEdit,
} from 'lucide-react';
import { AttendanceRecord } from '../types';

interface AttendanceCalendarProps {
  onOpenRegularization: (selectedDate?: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ onOpenRegularization }) => {
  const { currentUser, attendanceRecords, holidays, todayDate } = useApp();

  // Calendar year and month (0-indexed: 9 is October)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedDayRecord, setSelectedDayRecord] = useState<{
    dateStr: string;
    record?: AttendanceRecord;
    holiday?: { name: string; type: string };
  } | null>(null);

  if (!currentUser) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Days calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sunday

  // Filter current user's records for this month
  const currentMonthRecords = attendanceRecords.filter((r) => {
    if (r.employeeId !== currentUser.id) return false;
    const parts = r.date.split('-');
    return parseInt(parts[0], 10) === selectedYear && parseInt(parts[1], 10) === selectedMonth + 1;
  });

  // Calculate monthly stats
  const presentDays = currentMonthRecords.filter((r) => r.status === 'present').length;
  const lateDays = currentMonthRecords.filter((r) => r.status === 'late').length;
  const halfDays = currentMonthRecords.filter((r) => r.status === 'half_day').length;
  const leaveDays = currentMonthRecords.filter((r) => r.status === 'on_leave').length;
  const totalWorkedMinutes = currentMonthRecords.reduce((acc, curr) => acc + (curr.totalWorkMinutes || 0), 0);
  const avgHours = (presentDays + lateDays + halfDays) > 0
    ? (totalWorkedMinutes / (presentDays + lateDays + halfDays) / 60).toFixed(1)
    : '0.0';

  const formatTime = (iso?: string | null) => {
    if (!iso) return '--:--';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Monthly Attendance Ledger & Punch History
            </h3>
            <p className="text-xs text-slate-500">
              View daily check-ins, punctuality metrics, and work duration.
            </p>
          </div>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-800 font-mono">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-100 bg-slate-50/50 text-xs">
        <div className="p-4 border-r border-slate-100">
          <div className="text-slate-500 text-[11px]">Days Present</div>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
            {presentDays}
          </div>
        </div>
        <div className="p-4 border-r border-slate-100">
          <div className="text-slate-500 text-[11px]">Late Arrivals</div>
          <div className="text-lg font-bold font-mono tabular-nums text-amber-600 mt-0.5">
            {lateDays}
          </div>
        </div>
        <div className="p-4 border-r border-slate-100">
          <div className="text-slate-500 text-[11px]">Half-Days</div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-700 mt-0.5">
            {halfDays}
          </div>
        </div>
        <div className="p-4 border-r border-slate-100">
          <div className="text-slate-500 text-[11px]">Approved Leaves</div>
          <div className="text-lg font-bold font-mono tabular-nums text-indigo-600 mt-0.5">
            {leaveDays}
          </div>
        </div>
        <div className="p-4">
          <div className="text-slate-500 text-[11px]">Avg Daily Work Hours</div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
            {avgHours} hrs
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-semibold text-slate-600 py-2.5 bg-slate-50">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[90px] p-2 bg-slate-50/30" />
        ))}

        {/* Days in Month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dayPad = day < 10 ? `0${day}` : `${day}`;
          const monthPad = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : `${selectedMonth + 1}`;
          const dateStr = `${selectedYear}-${monthPad}-${dayPad}`;
          const isToday = dateStr === todayDate;

          const record = currentMonthRecords.find((r) => r.date === dateStr);
          const holiday = holidays.find((h) => h.date === dateStr);
          const dateObj = new Date(selectedYear, selectedMonth, day);
          const dayOfWeek = dateObj.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDayRecord({ dateStr, record, holiday })}
              className={`min-h-[96px] p-2 transition-colors cursor-pointer group hover:bg-slate-50/80 relative ${
                isToday ? 'bg-indigo-50/40' : isWeekend ? 'bg-slate-50/40 text-slate-400' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-mono tabular-nums font-semibold text-xs ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center -ml-1'
                      : 'text-slate-700'
                  }`}
                >
                  {day}
                </span>

                {isToday && (
                  <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">
                    Today
                  </span>
                )}
              </div>

              {/* Status Badges in Calendar Day */}
              <div className="space-y-1">
                {holiday && (
                  <div className="text-[11px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded truncate" title={holiday.name}>
                    {holiday.name}
                  </div>
                )}

                {record && record.status === 'present' && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center justify-between">
                    <span>Present</span>
                    <span className="font-mono tabular-nums text-[10px]">
                      {(record.totalWorkMinutes / 60).toFixed(1)}h
                    </span>
                  </div>
                )}

                {record && record.status === 'late' && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded flex items-center justify-between">
                    <span>Late</span>
                    <span className="font-mono tabular-nums text-[10px]">
                      {(record.totalWorkMinutes / 60).toFixed(1)}h
                    </span>
                  </div>
                )}

                {record && record.status === 'half_day' && (
                  <div className="text-[11px] text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded flex items-center justify-between">
                    <span>Half Day</span>
                    <span className="font-mono tabular-nums text-[10px]">
                      {(record.totalWorkMinutes / 60).toFixed(1)}h
                    </span>
                  </div>
                )}

                {record && record.status === 'on_leave' && (
                  <div className="text-[11px] text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded truncate">
                    On Leave
                  </div>
                )}

                {isWeekend && !holiday && (
                  <div className="text-[10px] text-slate-400 mt-1">Weekend</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDayRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Attendance Details · {selectedDayRecord.dateStr}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDayRecord(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {selectedDayRecord.holiday && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900">
                  <div className="font-semibold text-sm">{selectedDayRecord.holiday.name}</div>
                  <div className="text-xs text-purple-700 mt-0.5 capitalize">
                    {selectedDayRecord.holiday.type} Official Company Holiday
                  </div>
                </div>
              )}

              {selectedDayRecord.record ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Clock In</div>
                      <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                        {formatTime(selectedDayRecord.record.clockIn)}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Clock Out</div>
                      <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                        {formatTime(selectedDayRecord.record.clockOut)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Total Work Duration</div>
                      <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                        {Math.floor(selectedDayRecord.record.totalWorkMinutes / 60)}h {selectedDayRecord.record.totalWorkMinutes % 60}m
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Status & Mode</div>
                      <div className="text-sm font-semibold capitalize text-slate-900 mt-0.5">
                        {selectedDayRecord.record.status.replace('_', ' ')} · {selectedDayRecord.record.workMode}
                      </div>
                    </div>
                  </div>

                  {selectedDayRecord.record.notes && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                      <span className="font-semibold">Note: </span>
                      {selectedDayRecord.record.notes}
                    </div>
                  )}

                  {selectedDayRecord.record.breaks.length > 0 && (
                    <div>
                      <div className="font-semibold text-slate-700 mb-1.5">Breaks Logged:</div>
                      <div className="space-y-1">
                        {selectedDayRecord.record.breaks.map((b, i) => (
                          <div key={b.id || i} className="flex justify-between bg-slate-50 p-2 rounded">
                            <span className="capitalize">{b.type} Break</span>
                            <span className="font-mono tabular-nums text-slate-600">
                              {formatTime(b.startTime)} - {formatTime(b.endTime)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  No check-in record found for this date.
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const date = selectedDayRecord.dateStr;
                  setSelectedDayRecord(null);
                  onOpenRegularization(date);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Request Regularization for this Date</span>
              </button>
              <button
                onClick={() => setSelectedDayRecord(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
