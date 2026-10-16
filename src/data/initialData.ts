import { Employee, AttendanceRecord, LeaveRequest, RegularizationRequest, Holiday } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Karan K.',
    email: 'hr.karank@gmail.com',
    role: 'admin',
    department: 'Human Resources',
    designation: 'Head of People & Operations',
    avatar: '/src/assets/images/avatar_karan_hr_1792171674421.jpg',
    pin: '1001',
    phone: '+1 (555) 019-2834',
    joinDate: '2023-01-15',
    workType: 'office',
    shift: {
      name: 'General Day Shift',
      start: '09:00',
      end: '18:00',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 18, used: 4 },
      sick: { total: 12, used: 2 },
      casual: { total: 10, used: 3 },
      unpaid: { total: 0, used: 0 },
    },
  },
  {
    id: 'EMP-1002',
    name: 'Elena Rostova',
    email: 'elena.r@company.org',
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Manager',
    avatar: '/src/assets/images/avatar_elena_manager_1792171674472.jpg',
    pin: '1002',
    phone: '+1 (555) 014-9921',
    joinDate: '2023-03-01',
    reportsToId: 'EMP-1001',
    workType: 'hybrid',
    shift: {
      name: 'General Day Shift',
      start: '09:00',
      end: '18:00',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 18, used: 6 },
      sick: { total: 12, used: 1 },
      casual: { total: 10, used: 4 },
      unpaid: { total: 0, used: 0 },
    },
  },
  {
    id: 'EMP-1003',
    name: 'David Chen',
    email: 'david.c@company.org',
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    avatar: '/src/assets/images/avatar_david_dev_1792171675389.jpg',
    pin: '1003',
    phone: '+1 (555) 018-7742',
    joinDate: '2023-08-10',
    reportsToId: 'EMP-1002',
    workType: 'hybrid',
    shift: {
      name: 'General Day Shift',
      start: '09:00',
      end: '18:00',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 18, used: 5 },
      sick: { total: 12, used: 2 },
      casual: { total: 10, used: 3 },
      unpaid: { total: 0, used: 0 },
    },
  },
  {
    id: 'EMP-1004',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.org',
    role: 'employee',
    department: 'Product & Design',
    designation: 'Lead UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pin: '1004',
    phone: '+1 (555) 012-3490',
    joinDate: '2023-11-20',
    reportsToId: 'EMP-1002',
    workType: 'remote',
    shift: {
      name: 'Flexible Shift',
      start: '09:30',
      end: '18:30',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 18, used: 8 },
      sick: { total: 12, used: 3 },
      casual: { total: 10, used: 2 },
      unpaid: { total: 0, used: 0 },
    },
  },
  {
    id: 'EMP-1005',
    name: 'Marcus Vance',
    email: 'marcus.v@company.org',
    role: 'manager',
    department: 'Operations',
    designation: 'Operations Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    pin: '1005',
    phone: '+1 (555) 016-4431',
    joinDate: '2022-09-01',
    reportsToId: 'EMP-1001',
    workType: 'office',
    shift: {
      name: 'General Day Shift',
      start: '09:00',
      end: '18:00',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 20, used: 4 },
      sick: { total: 12, used: 0 },
      casual: { total: 10, used: 2 },
      unpaid: { total: 0, used: 0 },
    },
  },
  {
    id: 'EMP-1006',
    name: 'Priya Sharma',
    email: 'priya.s@company.org',
    role: 'employee',
    department: 'Operations',
    designation: 'Operations Specialist',
    avatar: '/src/assets/images/avatar_priya_ops_1792171674710.jpg',
    pin: '1006',
    phone: '+1 (555) 019-8812',
    joinDate: '2024-02-15',
    reportsToId: 'EMP-1005',
    workType: 'office',
    shift: {
      name: 'General Day Shift',
      start: '09:00',
      end: '18:00',
      graceMinutes: 15,
    },
    leaveBalances: {
      paid: { total: 15, used: 2 },
      sick: { total: 10, used: 1 },
      casual: { total: 8, used: 1 },
      unpaid: { total: 0, used: 0 },
    },
  },
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  { id: 'hol-1', name: 'New Year Day', date: '2026-01-01', type: 'mandatory' },
  { id: 'hol-2', name: 'Republic Day', date: '2026-01-26', type: 'mandatory' },
  { id: 'hol-3', name: 'Good Friday', date: '2026-04-03', type: 'mandatory' },
  { id: 'hol-4', name: 'Labor Day', date: '2026-05-01', type: 'mandatory' },
  { id: 'hol-5', name: 'Independence Day', date: '2026-08-15', type: 'mandatory' },
  { id: 'hol-6', name: 'Gandhi Jayanti', date: '2026-10-02', type: 'mandatory' },
  { id: 'hol-7', name: 'Dussehra / Autumn Holiday', date: '2026-10-20', type: 'mandatory' },
  { id: 'hol-8', name: 'Diwali Festival', date: '2026-11-08', type: 'mandatory' },
  { id: 'hol-9', name: 'Christmas Day', date: '2026-12-25', type: 'mandatory' },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LV-2026-001',
    employeeId: 'EMP-1003',
    employeeName: 'David Chen',
    department: 'Engineering',
    leaveType: 'casual',
    startDate: '2026-10-19',
    endDate: '2026-10-20',
    isHalfDay: false,
    totalDays: 2,
    reason: 'Family event and personal work out of station.',
    emergencyContact: '+1 (555) 018-7742',
    status: 'pending',
    appliedAt: '2026-10-15T14:30:00.000Z',
  },
  {
    id: 'LV-2026-002',
    employeeId: 'EMP-1004',
    employeeName: 'Sarah Jenkins',
    department: 'Product & Design',
    leaveType: 'paid',
    startDate: '2026-10-26',
    endDate: '2026-10-29',
    isHalfDay: false,
    totalDays: 4,
    reason: 'Annual family vacation trip booked in advance.',
    emergencyContact: '+1 (555) 012-3490',
    status: 'pending',
    appliedAt: '2026-10-14T09:15:00.000Z',
  },
  {
    id: 'LV-2026-003',
    employeeId: 'EMP-1006',
    employeeName: 'Priya Sharma',
    department: 'Operations',
    leaveType: 'sick',
    startDate: '2026-10-21',
    endDate: '2026-10-21',
    isHalfDay: true,
    halfDaySession: 'second_half',
    totalDays: 0.5,
    reason: 'Doctor scheduled ophthalmology consultation.',
    status: 'pending',
    appliedAt: '2026-10-16T08:45:00.000Z',
  },
  {
    id: 'LV-2026-004',
    employeeId: 'EMP-1003',
    employeeName: 'David Chen',
    department: 'Engineering',
    leaveType: 'sick',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    isHalfDay: false,
    totalDays: 2,
    reason: 'Severe viral fever and physician recommended bed rest.',
    status: 'approved',
    appliedAt: '2026-10-04T19:20:00.000Z',
    reviewedBy: {
      id: 'EMP-1002',
      name: 'Elena Rostova',
      reviewedAt: '2026-10-04T20:10:00.000Z',
      comments: 'Take care David, rest well and take meds.',
    },
  },
  {
    id: 'LV-2026-005',
    employeeId: 'EMP-1002',
    employeeName: 'Elena Rostova',
    department: 'Engineering',
    leaveType: 'paid',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    isHalfDay: false,
    totalDays: 5,
    reason: 'Personal travel and family commitment.',
    status: 'approved',
    appliedAt: '2026-09-02T10:00:00.000Z',
    reviewedBy: {
      id: 'EMP-1001',
      name: 'Karan K.',
      reviewedAt: '2026-09-02T11:45:00.000Z',
      comments: 'Approved. David will be stand-in lead during this period.',
    },
  },
];

export const INITIAL_REGULARIZATION_REQUESTS: RegularizationRequest[] = [
  {
    id: 'REG-2026-01',
    employeeId: 'EMP-1003',
    employeeName: 'David Chen',
    date: '2026-10-13',
    requestedClockIn: '09:05',
    requestedClockOut: '18:15',
    reason: 'Office badge scanner reader was malfunctioning at turnstile gate.',
    status: 'pending',
    appliedAt: '2026-10-14T08:40:00.000Z',
  },
];

// Helper to generate realistic historical attendance for October 2026 up to today (Oct 16, 2026)
export function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const empIds = ['EMP-1001', 'EMP-1002', 'EMP-1003', 'EMP-1004', 'EMP-1005', 'EMP-1006'];

  // Current date context: Oct 16, 2026 (Friday)
  for (let day = 1; day <= 16; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-10-${dayStr}`;
    const dateObj = new Date(2026, 9, day);
    const dayOfWeek = dateObj.getDay(); // 0 is Sun, 6 is Sat

    empIds.forEach((empId) => {
      // Oct 2 is Gandhi Jayanti (Holiday)
      if (day === 2) {
        records.push({
          id: `att-${empId}-${dateStr}`,
          employeeId: empId,
          date: dateStr,
          clockIn: null,
          clockOut: null,
          status: 'holiday',
          workMode: 'office',
          breaks: [],
          totalWorkMinutes: 0,
          totalBreakMinutes: 0,
        });
        return;
      }

      // Weekend
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        records.push({
          id: `att-${empId}-${dateStr}`,
          employeeId: empId,
          date: dateStr,
          clockIn: null,
          clockOut: null,
          status: 'weekend',
          workMode: 'office',
          breaks: [],
          totalWorkMinutes: 0,
          totalBreakMinutes: 0,
        });
        return;
      }

      // Special cases: David Chen was on approved sick leave Oct 5-6
      if (empId === 'EMP-1003' && (day === 5 || day === 6)) {
        records.push({
          id: `att-${empId}-${dateStr}`,
          employeeId: empId,
          date: dateStr,
          clockIn: null,
          clockOut: null,
          status: 'on_leave',
          workMode: 'office',
          breaks: [],
          totalWorkMinutes: 0,
          totalBreakMinutes: 0,
          notes: 'Sick Leave (Approved)',
        });
        return;
      }

      // Today (Oct 16)
      if (day === 16) {
        if (empId === 'EMP-1001') {
          // Karan K. clocked in at 08:52 AM, currently active
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T08:52:00.000Z',
            clockOut: null,
            status: 'present',
            workMode: 'office',
            breaks: [
              {
                id: 'brk-1001-1',
                type: 'coffee',
                startTime: '2026-10-16T11:00:00.000Z',
                endTime: '2026-10-16T11:15:00.000Z',
              },
            ],
            totalWorkMinutes: 190,
            totalBreakMinutes: 15,
          });
        } else if (empId === 'EMP-1002') {
          // Elena clocked in 09:05 AM
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T09:05:00.000Z',
            clockOut: null,
            status: 'present',
            workMode: 'office',
            breaks: [],
            totalWorkMinutes: 180,
            totalBreakMinutes: 0,
          });
        } else if (empId === 'EMP-1003') {
          // David Chen clocked in at 09:25 AM (Late)
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T09:25:00.000Z',
            clockOut: null,
            status: 'late',
            workMode: 'hybrid',
            breaks: [
              {
                id: 'brk-1003-1',
                type: 'coffee',
                startTime: '2026-10-16T11:20:00.000Z',
                endTime: '2026-10-16T11:32:00.000Z',
              },
            ],
            totalWorkMinutes: 160,
            totalBreakMinutes: 12,
            notes: 'Late arrival: Subway signal delay',
          });
        } else if (empId === 'EMP-1004') {
          // Sarah Jenkins clocked in 09:30 AM (Remote)
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T09:30:00.000Z',
            clockOut: null,
            status: 'present',
            workMode: 'remote',
            breaks: [],
            totalWorkMinutes: 150,
            totalBreakMinutes: 0,
          });
        } else if (empId === 'EMP-1005') {
          // Marcus Vance clocked in 08:48 AM
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T08:48:00.000Z',
            clockOut: null,
            status: 'present',
            workMode: 'office',
            breaks: [],
            totalWorkMinutes: 195,
            totalBreakMinutes: 0,
          });
        } else {
          // Priya Sharma clocked in 09:00 AM
          records.push({
            id: `att-${empId}-${dateStr}`,
            employeeId: empId,
            date: dateStr,
            clockIn: '2026-10-16T09:00:00.000Z',
            clockOut: null,
            status: 'present',
            workMode: 'office',
            breaks: [],
            totalWorkMinutes: 180,
            totalBreakMinutes: 0,
          });
        }
        return;
      }

      // Past regular days (Oct 1 - Oct 15)
      // Deterministic variation so each employee has realistic past records
      const hash = (day * 13 + empId.charCodeAt(empId.length - 1)) % 10;
      let status: 'present' | 'late' | 'half_day' = 'present';
      let inMin = 50 + (hash % 20); // 8:50 to 9:10
      let outMin = 18 * 60 + ((hash * 7) % 35); // 18:00 to 18:35
      let inHour = 8;
      if (inMin >= 60) {
        inHour = 9;
        inMin = inMin - 60;
      }

      if (hash === 9) {
        // Late arrival
        status = 'late';
        inHour = 9;
        inMin = 25 + (hash % 15);
      } else if (hash === 8 && day === 9) {
        // Half day
        status = 'half_day';
        outMin = 13 * 60 + 30;
      }

      const inHourStr = inHour < 10 ? `0${inHour}` : `${inHour}`;
      const inMinStr = inMin < 10 ? `0${inMin}` : `${inMin}`;
      const clockInIso = `${dateStr}T${inHourStr}:${inMinStr}:00.000Z`;

      const outHour = Math.floor(outMin / 60);
      const outMinRemainder = outMin % 60;
      const outHourStr = outHour < 10 ? `0${outHour}` : `${outHour}`;
      const outMinStr = outMinRemainder < 10 ? `0${outMinRemainder}` : `${outMinRemainder}`;
      const clockOutIso = `${dateStr}T${outHourStr}:${outMinStr}:00.000Z`;

      const breakMin = 45;
      const totalWorkMin = (outHour * 60 + outMinRemainder) - (inHour * 60 + inMin) - breakMin;

      records.push({
        id: `att-${empId}-${dateStr}`,
        employeeId: empId,
        date: dateStr,
        clockIn: clockInIso,
        clockOut: clockOutIso,
        status,
        workMode: (empId === 'EMP-1004' || (hash % 3 === 0 && empId === 'EMP-1003')) ? 'remote' : 'office',
        breaks: [
          {
            id: `brk-${empId}-${day}-1`,
            type: 'lunch',
            startTime: `${dateStr}T13:00:00.000Z`,
            endTime: `${dateStr}T13:45:00.000Z`,
          },
        ],
        totalWorkMinutes: Math.max(0, totalWorkMin),
        totalBreakMinutes: breakMin,
      });
    });
  }

  return records;
}
