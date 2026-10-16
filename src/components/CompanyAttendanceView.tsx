import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Download,
  Building,
  Laptop,
  CheckCircle2,
  Clock,
  Coffee,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';

export const CompanyAttendanceView: React.FC = () => {
  const { employees, attendanceRecords, todayDate } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique departments
  const departments = ['all', ...Array.from(new Set(employees.map((e) => e.department)))];

  // Today's attendance records
  const todayRecords = attendanceRecords.filter((r) => r.date === todayDate);

  // Compute organization KPI statistics
  const totalEmployees = employees.length;
  const presentEmployees = todayRecords.filter(
    (r) => (r.status === 'present' || r.status === 'late') && r.clockIn
  ).length;
  const lateEmployees = todayRecords.filter((r) => r.status === 'late').length;
  const onLeaveEmployees = todayRecords.filter((r) => r.status === 'on_leave').length;
  const remoteEmployees = todayRecords.filter((r) => r.workMode === 'remote' && r.clockIn).length;

  const attendanceRate = totalEmployees > 0 ? ((presentEmployees / totalEmployees) * 100).toFixed(0) : '0';

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getEmpTodayRecord = (empId: string): AttendanceRecord | undefined => {
    return todayRecords.find((r) => r.employeeId === empId);
  };

  // CSV Export for today's attendance
  const exportAttendanceCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Department',
      'Designation',
      'Date',
      'Status',
      'Work Mode',
      'Clock In',
      'Clock Out',
      'Total Work Minutes',
      'Break Minutes',
      'Notes',
    ];

    const rows = employees.map((emp) => {
      const rec = getEmpTodayRecord(emp.id);
      return [
        emp.id,
        `"${emp.name}"`,
        `"${emp.department}"`,
        `"${emp.designation}"`,
        todayDate,
        rec?.status || 'not_checked_in',
        rec?.workMode || emp.workType,
        rec?.clockIn ? new Date(rec.clockIn).toLocaleTimeString() : '',
        rec?.clockOut ? new Date(rec.clockOut).toLocaleTimeString() : '',
        rec?.totalWorkMinutes || 0,
        rec?.totalBreakMinutes || 0,
        `"${rec?.notes || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${todayDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Organization Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Organisation Attendance Roster & Live Status
              </h2>
              <p className="text-xs text-slate-500">
                Track real-time company punch activity, shift presence, and departmental coverage for {todayDate}.
              </p>
            </div>
          </div>

          <button
            onClick={exportAttendanceCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Daily CSV Report</span>
          </button>
        </div>

        {/* Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-100 bg-slate-50/50 text-xs">
          <div className="p-4 border-r border-slate-100">
            <div className="text-slate-500 text-[11px]">Total Headcount</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {totalEmployees}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active Staff</div>
          </div>

          <div className="p-4 border-r border-slate-100">
            <div className="text-slate-500 text-[11px]">Present Today</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
              {presentEmployees}{' '}
              <span className="text-xs font-normal text-slate-500">({attendanceRate}%)</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Clocked in</div>
          </div>

          <div className="p-4 border-r border-slate-100">
            <div className="text-slate-500 text-[11px]">Late Arrivals</div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-600 mt-0.5">
              {lateEmployees}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">After grace period</div>
          </div>

          <div className="p-4 border-r border-slate-100">
            <div className="text-slate-500 text-[11px]">On Leave</div>
            <div className="text-xl font-bold font-mono tabular-nums text-blue-600 mt-0.5">
              {onLeaveEmployees}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Approved absence</div>
          </div>

          <div className="p-4">
            <div className="text-slate-500 text-[11px]">Working Remote</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {remoteEmployees}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">WFH today</div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-4">
          {/* Department tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium capitalize transition-colors ${
                  selectedDept === dept
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search name, ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Employee Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Department & Role</th>
                <th className="px-6 py-3">Attendance Status</th>
                <th className="px-6 py-3">Clock In</th>
                <th className="px-6 py-3">Clock Out</th>
                <th className="px-6 py-3">Hours Logged</th>
                <th className="px-6 py-3">Work Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.map((emp) => {
                const rec = getEmpTodayRecord(emp.id);
                const hasClockedIn = Boolean(rec?.clockIn);
                const isWorking = Boolean(rec?.clockIn && !rec?.clockOut);
                const activeBreak = rec?.breaks.find((b) => !b.endTime);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Employee Profile */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover bg-slate-200 border border-slate-300 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{emp.name}</div>
                          <div className="font-mono tabular-nums text-slate-500 text-[11px]">
                            {emp.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-slate-900">{emp.designation}</div>
                      <div className="text-slate-500 text-[11px]">{emp.department}</div>
                    </td>

                    {/* Attendance Status */}
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      {activeBreak ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <Coffee className="w-3 h-3" />
                          On Break ({activeBreak.type})
                        </span>
                      ) : rec?.status === 'late' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          Late Arrival
                        </span>
                      ) : isWorking ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Working Active
                        </span>
                      ) : rec?.status === 'on_leave' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          On Leave
                        </span>
                      ) : rec?.clockOut ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Shift Finished
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                          Not Punched In
                        </span>
                      )}
                    </td>

                    {/* Clock In */}
                    <td className="px-6 py-3.5 font-mono tabular-nums">
                      {rec?.clockIn
                        ? new Date(rec.clockIn).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>

                    {/* Clock Out */}
                    <td className="px-6 py-3.5 font-mono tabular-nums">
                      {rec?.clockOut
                        ? new Date(rec.clockOut).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : isWorking
                        ? 'In Progress'
                        : '—'}
                    </td>

                    {/* Hours Logged */}
                    <td className="px-6 py-3.5 font-mono tabular-nums font-semibold text-slate-900">
                      {rec && rec.totalWorkMinutes > 0
                        ? `${Math.floor(rec.totalWorkMinutes / 60)}h ${rec.totalWorkMinutes % 60}m`
                        : '—'}
                    </td>

                    {/* Work Mode */}
                    <td className="px-6 py-3.5 capitalize">
                      <span className="flex items-center gap-1 text-slate-600">
                        {rec?.workMode === 'remote' ? (
                          <>
                            <Laptop className="w-3.5 h-3.5 text-slate-400" />
                            <span>Remote</span>
                          </>
                        ) : (
                          <>
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>Office</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
