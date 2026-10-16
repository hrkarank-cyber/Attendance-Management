export type UserRole = 'admin' | 'manager' | 'employee';

export interface LeaveQuota {
  total: number;
  used: number;
}

export interface Employee {
  id: string; // e.g. "EMP-1001"
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar: string;
  pin: string;
  phone: string;
  joinDate: string;
  reportsToId?: string; // ID of the manager
  workType: 'office' | 'hybrid' | 'remote';
  shift: {
    name: string;
    start: string; // "09:00"
    end: string;   // "18:00"
    graceMinutes: number; // e.g. 15
  };
  leaveBalances: {
    paid: LeaveQuota;
    sick: LeaveQuota;
    casual: LeaveQuota;
    unpaid: LeaveQuota;
  };
}

export type AttendanceStatus = 
  | 'present' 
  | 'late' 
  | 'half_day' 
  | 'on_leave' 
  | 'absent' 
  | 'weekend' 
  | 'holiday';

export interface AttendanceBreak {
  id: string;
  type: string; // 'lunch' | 'coffee' | 'meeting' | 'other'
  startTime: string; // ISO
  endTime?: string;  // ISO
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  clockIn: string | null;  // ISO string
  clockOut: string | null; // ISO string
  status: AttendanceStatus;
  workMode: 'office' | 'remote' | 'hybrid';
  breaks: AttendanceBreak[];
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  notes?: string;
}

export type LeaveType = 'paid' | 'sick' | 'casual' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  isHalfDay: boolean;
  halfDaySession?: 'first_half' | 'second_half';
  totalDays: number;
  reason: string;
  emergencyContact?: string;
  status: LeaveStatus;
  appliedAt: string; // ISO
  reviewedBy?: {
    id: string;
    name: string;
    reviewedAt: string;
    comments?: string;
  };
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  requestedClockIn: string; // "09:00"
  requestedClockOut: string; // "18:00"
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: {
    id: string;
    name: string;
    reviewedAt: string;
    comments?: string;
  };
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: 'mandatory' | 'optional';
}
