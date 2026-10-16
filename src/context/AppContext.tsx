import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  RegularizationRequest,
  Holiday,
  LeaveType,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_HOLIDAYS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_REGULARIZATION_REQUESTS,
  generateInitialAttendance,
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'workpulse_current_user_id',
  EMPLOYEES: 'workpulse_employees_v1',
  ATTENDANCE: 'workpulse_attendance_v1',
  LEAVES: 'workpulse_leaves_v1',
  REGULARIZATIONS: 'workpulse_regularizations_v1',
  HOLIDAYS: 'workpulse_holidays_v1',
};

export const SYSTEM_TODAY = '2026-10-16'; // System fixed reference date aligned with environment

interface AppContextType {
  currentUser: Employee | null;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  regularizationRequests: RegularizationRequest[];
  holidays: Holiday[];
  todayDate: string;
  login: (loginIdOrEmail: string, pin: string) => { success: boolean; error?: string };
  switchUser: (employeeId: string) => void;
  logout: () => void;
  clockIn: (employeeId: string, mode: 'office' | 'remote') => void;
  clockOut: (employeeId: string) => void;
  startBreak: (employeeId: string, type: string) => void;
  endBreak: (employeeId: string) => void;
  applyLeave: (req: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDaySession?: 'first_half' | 'second_half';
    totalDays: number;
    reason: string;
    emergencyContact?: string;
  }) => { success: boolean; message: string };
  reviewLeave: (leaveId: string, action: 'approved' | 'rejected', comments?: string) => void;
  cancelLeave: (leaveId: string) => void;
  applyRegularization: (req: {
    date: string;
    requestedClockIn: string;
    requestedClockOut: string;
    reason: string;
  }) => void;
  reviewRegularization: (
    reqId: string,
    action: 'approved' | 'rejected',
    comments?: string
  ) => void;
  addEmployee: (newEmp: Omit<Employee, 'id'>) => { success: boolean; employeeId: string };
  resetToDemoData: () => void;
  getTodayAttendance: (empId: string) => AttendanceRecord | undefined;
  getPendingApprovalsCount: (empId: string) => number;
  getSubordinates: (empId: string) => Employee[];
  getEmployee: (empId: string) => Employee | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || null;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return generateInitialAttendance();
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGULARIZATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_REGULARIZATION_REQUESTS;
  });

  const [holidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGULARIZATIONS, JSON.stringify(regularizationRequests));
  }, [regularizationRequests]);

  const currentUser = useMemo(() => {
    return employees.find((e) => e.id === currentUserId) || null;
  }, [employees, currentUserId]);

  const login = (loginIdOrEmail: string, pin: string) => {
    const cleanId = loginIdOrEmail.trim().toLowerCase();
    const found = employees.find(
      (e) =>
        e.id.toLowerCase() === cleanId ||
        e.email.toLowerCase() === cleanId
    );

    if (!found) {
      return { success: false, error: 'Employee ID or Work Email not recognized in company directory.' };
    }

    if (found.pin !== pin.trim()) {
      return { success: false, error: 'Incorrect 4-digit PIN. Please check your credentials.' };
    }

    setCurrentUserId(found.id);
    return { success: true };
  };

  const switchUser = (employeeId: string) => {
    const found = employees.find((e) => e.id === employeeId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const getTodayAttendance = (empId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find((r) => r.employeeId === empId && r.date === SYSTEM_TODAY);
  };

  const clockIn = (empId: string, mode: 'office' | 'remote') => {
    const nowIso = new Date().toISOString();
    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.employeeId === empId && r.date === SYSTEM_TODAY);
      const emp = employees.find((e) => e.id === empId);

      // Determine if late based on shift
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      let status: 'present' | 'late' = 'present';

      if (emp?.shift) {
        const [shiftH, shiftM] = emp.shift.start.split(':').map(Number);
        const shiftMinutes = shiftH * 60 + shiftM + (emp.shift.graceMinutes || 15);
        const arrivalMinutes = currentHour * 60 + currentMin;
        if (arrivalMinutes > shiftMinutes) {
          status = 'late';
        }
      }

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          clockIn: nowIso,
          status: copy[existingIdx].status === 'on_leave' ? 'on_leave' : status,
          workMode: mode,
        };
        return copy;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${empId}-${SYSTEM_TODAY}`,
          employeeId: empId,
          date: SYSTEM_TODAY,
          clockIn: nowIso,
          clockOut: null,
          status,
          workMode: mode,
          breaks: [],
          totalWorkMinutes: 0,
          totalBreakMinutes: 0,
        };
        return [...prev, newRecord];
      }
    });
  };

  const clockOut = (empId: string) => {
    const nowIso = new Date().toISOString();
    setAttendanceRecords((prev) => {
      return prev.map((r) => {
        if (r.employeeId === empId && r.date === SYSTEM_TODAY) {
          // If a break is still ongoing, close it
          const updatedBreaks = r.breaks.map((b) => (b.endTime ? b : { ...b, endTime: nowIso }));
          
          // Calculate work minutes
          let workMinutes = r.totalWorkMinutes;
          if (r.clockIn) {
            const startMs = new Date(r.clockIn).getTime();
            const endMs = new Date(nowIso).getTime();
            const diffMin = Math.max(0, Math.floor((endMs - startMs) / 60000));
            workMinutes = Math.max(0, diffMin - r.totalBreakMinutes);
          }

          return {
            ...r,
            clockOut: nowIso,
            breaks: updatedBreaks,
            totalWorkMinutes: workMinutes,
          };
        }
        return r;
      });
    });
  };

  const startBreak = (empId: string, type: string) => {
    const nowIso = new Date().toISOString();
    setAttendanceRecords((prev) => {
      return prev.map((r) => {
        if (r.employeeId === empId && r.date === SYSTEM_TODAY) {
          const newBreak = {
            id: `brk-${Date.now()}`,
            type,
            startTime: nowIso,
          };
          return {
            ...r,
            breaks: [...r.breaks, newBreak],
          };
        }
        return r;
      });
    });
  };

  const endBreak = (empId: string) => {
    const nowIso = new Date().toISOString();
    setAttendanceRecords((prev) => {
      return prev.map((r) => {
        if (r.employeeId === empId && r.date === SYSTEM_TODAY) {
          let additionalBreakMin = 0;
          const updatedBreaks = r.breaks.map((b) => {
            if (!b.endTime) {
              const startMs = new Date(b.startTime).getTime();
              const endMs = new Date(nowIso).getTime();
              additionalBreakMin = Math.max(1, Math.floor((endMs - startMs) / 60000));
              return { ...b, endTime: nowIso };
            }
            return b;
          });

          return {
            ...r,
            breaks: updatedBreaks,
            totalBreakMinutes: r.totalBreakMinutes + additionalBreakMin,
          };
        }
        return r;
      });
    });
  };

  const applyLeave = (req: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDaySession?: 'first_half' | 'second_half';
    totalDays: number;
    reason: string;
    emergencyContact?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'No employee is currently authenticated.' };
    }

    // Check balance
    const quota = currentUser.leaveBalances[req.leaveType];
    const available = quota.total - quota.used;

    if (req.leaveType !== 'unpaid' && available < req.totalDays) {
      return {
        success: false,
        message: `Insufficient ${req.leaveType} leave balance. Available: ${available} day(s), Requested: ${req.totalDays} day(s).`,
      };
    }

    const newLeave: LeaveRequest = {
      id: `LV-${Date.now().toString().slice(-6)}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: req.leaveType,
      startDate: req.startDate,
      endDate: req.endDate,
      isHalfDay: req.isHalfDay,
      halfDaySession: req.halfDaySession,
      totalDays: req.totalDays,
      reason: req.reason,
      emergencyContact: req.emergencyContact,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);
    return { success: true, message: 'Leave application submitted successfully for manager approval.' };
  };

  const reviewLeave = (leaveId: string, action: 'approved' | 'rejected', comments?: string) => {
    if (!currentUser) return;

    setLeaveRequests((prev) => {
      const target = prev.find((l) => l.id === leaveId);
      if (!target) return prev;

      // If approved, deduct leave balance and update attendance calendar
      if (action === 'approved') {
        setEmployees((empList) => {
          return empList.map((emp) => {
            if (emp.id === target.employeeId) {
              const currentBalance = emp.leaveBalances[target.leaveType];
              return {
                ...emp,
                leaveBalances: {
                  ...emp.leaveBalances,
                  [target.leaveType]: {
                    ...currentBalance,
                    used: currentBalance.used + target.totalDays,
                  },
                },
              };
            }
            return emp;
          });
        });

        // Mark on attendance records if dates are within the recorded range
        setAttendanceRecords((records) => {
          const updated = [...records];
          // We can tag existing dates
          return updated.map((rec) => {
            if (
              rec.employeeId === target.employeeId &&
              rec.date >= target.startDate &&
              rec.date <= target.endDate
            ) {
              return {
                ...rec,
                status: 'on_leave',
                notes: `${target.leaveType.toUpperCase()} Leave approved by ${currentUser.name}`,
              };
            }
            return rec;
          });
        });
      }

      return prev.map((l) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status: action,
            reviewedBy: {
              id: currentUser.id,
              name: currentUser.name,
              reviewedAt: new Date().toISOString(),
              comments: comments || (action === 'approved' ? 'Approved as requested.' : 'Declined.'),
            },
          };
        }
        return l;
      });
    });
  };

  const cancelLeave = (leaveId: string) => {
    setLeaveRequests((prev) => {
      return prev.map((l) => {
        if (l.id === leaveId && l.status === 'pending') {
          return {
            ...l,
            status: 'cancelled',
          };
        }
        return l;
      });
    });
  };

  const applyRegularization = (req: {
    date: string;
    requestedClockIn: string;
    requestedClockOut: string;
    reason: string;
  }) => {
    if (!currentUser) return;
    const newReg: RegularizationRequest = {
      id: `REG-${Date.now().toString().slice(-5)}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: req.date,
      requestedClockIn: req.requestedClockIn,
      requestedClockOut: req.requestedClockOut,
      reason: req.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    setRegularizationRequests((prev) => [newReg, ...prev]);
  };

  const reviewRegularization = (
    reqId: string,
    action: 'approved' | 'rejected',
    comments?: string
  ) => {
    if (!currentUser) return;

    setRegularizationRequests((prev) => {
      const target = prev.find((r) => r.id === reqId);
      if (!target) return prev;

      if (action === 'approved') {
        // Adjust attendance record
        setAttendanceRecords((records) => {
          const recIdx = records.findIndex(
            (r) => r.employeeId === target.employeeId && r.date === target.date
          );
          const [inH, inM] = target.requestedClockIn.split(':').map(Number);
          const [outH, outM] = target.requestedClockOut.split(':').map(Number);
          const workMin = Math.max(0, (outH * 60 + outM) - (inH * 60 + inM) - 45);

          const inIso = `${target.date}T${target.requestedClockIn}:00.000Z`;
          const outIso = `${target.date}T${target.requestedClockOut}:00.000Z`;

          if (recIdx >= 0) {
            const copy = [...records];
            copy[recIdx] = {
              ...copy[recIdx],
              clockIn: inIso,
              clockOut: outIso,
              status: 'present',
              totalWorkMinutes: workMin,
              notes: `Regularized by ${currentUser.name}: ${comments || 'Approved'}`,
            };
            return copy;
          } else {
            return [
              ...records,
              {
                id: `att-${target.employeeId}-${target.date}`,
                employeeId: target.employeeId,
                date: target.date,
                clockIn: inIso,
                clockOut: outIso,
                status: 'present',
                workMode: 'office',
                breaks: [],
                totalWorkMinutes: workMin,
                totalBreakMinutes: 45,
                notes: `Regularized by ${currentUser.name}: ${comments || 'Approved'}`,
              },
            ];
          }
        });
      }

      return prev.map((r) => {
        if (r.id === reqId) {
          return {
            ...r,
            status: action,
            reviewedBy: {
              id: currentUser.id,
              name: currentUser.name,
              reviewedAt: new Date().toISOString(),
              comments,
            },
          };
        }
        return r;
      });
    });
  };

  const addEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const nextNum = employees.length + 1001;
    const employeeId = `EMP-${nextNum}`;
    const newEmp: Employee = {
      ...newEmpData,
      id: employeeId,
    };
    setEmployees((prev) => [...prev, newEmp]);
    return { success: true, employeeId };
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.REGULARIZATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendanceRecords(generateInitialAttendance());
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setRegularizationRequests(INITIAL_REGULARIZATION_REQUESTS);
    setCurrentUserId('EMP-1001');
  };

  const getSubordinates = (empId: string): Employee[] => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return [];
    if (emp.role === 'admin') {
      // HR Admin can view & approve all employees except themselves
      return employees.filter((e) => e.id !== empId);
    }
    if (emp.role === 'manager') {
      // Direct reports + same department team members
      return employees.filter((e) => e.reportsToId === empId || (e.department === emp.department && e.id !== empId));
    }
    return [];
  };

  const getPendingApprovalsCount = (empId: string): number => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp || emp.role === 'employee') return 0;

    const subIds = getSubordinates(empId).map((s) => s.id);
    const pendingLeaves = leaveRequests.filter(
      (l) => l.status === 'pending' && (emp.role === 'admin' || subIds.includes(l.employeeId))
    ).length;

    const pendingRegs = regularizationRequests.filter(
      (r) => r.status === 'pending' && (emp.role === 'admin' || subIds.includes(r.employeeId))
    ).length;

    return pendingLeaves + pendingRegs;
  };

  const getEmployee = (empId: string): Employee | undefined => {
    return employees.find((e) => e.id === empId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        employees,
        attendanceRecords,
        leaveRequests,
        regularizationRequests,
        holidays,
        todayDate: SYSTEM_TODAY,
        login,
        switchUser,
        logout,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        applyLeave,
        reviewLeave,
        cancelLeave,
        applyRegularization,
        reviewRegularization,
        addEmployee,
        resetToDemoData,
        getTodayAttendance,
        getPendingApprovalsCount,
        getSubordinates,
        getEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
