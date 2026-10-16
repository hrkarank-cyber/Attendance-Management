import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { employees, addEmployee } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [reportsToId, setReportsToId] = useState('EMP-1002');
  const [pin, setPin] = useState('1234');
  const [workType, setWorkType] = useState<'office' | 'hybrid' | 'remote'>('hybrid');
  const [paidQuota, setPaidQuota] = useState(18);
  const [sickQuota, setSickQuota] = useState(12);
  const [casualQuota, setCasualQuota] = useState(10);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const managers = employees.filter((e) => e.role === 'admin' || e.role === 'manager');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !designation) return;

    const res = addEmployee({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      designation: designation.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      pin: pin.trim(),
      phone: '+1 (555) 000-0000',
      joinDate: new Date().toISOString().split('T')[0],
      reportsToId: role === 'admin' ? undefined : reportsToId,
      workType,
      shift: {
        name: 'General Day Shift',
        start: '09:00',
        end: '18:00',
        graceMinutes: 15,
      },
      leaveBalances: {
        paid: { total: paidQuota, used: 0 },
        sick: { total: sickQuota, used: 0 },
        casual: { total: casualQuota, used: 0 },
        unpaid: { total: 0, used: 0 },
      },
    });

    if (res.success) {
      setSuccessInfo(
        `Employee created successfully! Assigned Login ID: ${res.employeeId} (PIN: ${pin}). They can now log in, clock in, and apply for leaves!`
      );
      setTimeout(() => {
        setSuccessInfo(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Add New Employee</h3>
              <p className="text-slate-500 text-[11px]">
                Create a corporate account with dedicated Login ID and leave quota.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="alex.m@company.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="e.g. Backend Engineer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="employee">Staff Employee</option>
                <option value="manager">Approver / Manager</option>
                <option value="admin">HR Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reporting Manager</label>
              <select
                value={reportsToId}
                onChange={(e) => setReportsToId(e.target.value)}
                disabled={role === 'admin'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default 4-Digit PIN</label>
              <input
                type="text"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Leave Quota Allocation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Annual Leave Entitlements
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 text-[11px]">Paid / Annual (days)</span>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={paidQuota}
                  onChange={(e) => setPaidQuota(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Sick Leave (days)</span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={sickQuota}
                  onChange={(e) => setSickQuota(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Casual Leave (days)</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={casualQuota}
                  onChange={(e) => setCasualQuota(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
            >
              Create Employee Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
