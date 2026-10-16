import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Check, ShieldCheck, Briefcase, User } from 'lucide-react';

interface SwitchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddEmployee?: () => void;
}

export const SwitchUserModal: React.FC<SwitchUserModalProps> = ({
  isOpen,
  onClose,
  onOpenAddEmployee,
}) => {
  const { employees, currentUser, login, switchUser } = useApp();
  const [activeTab, setActiveTab] = useState<'quick' | 'login'>('quick');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(loginId, pin);
    if (res.success) {
      setLoginId('');
      setPin('');
      onClose();
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickSwitch = (empId: string) => {
    switchUser(empId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Employee Authentication & Session
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in with your employee login ID or switch profiles to test leave approval hierarchies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => {
              setActiveTab('quick');
              setErrorMsg('');
            }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors mr-6 ${
              activeTab === 'quick'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Organisation Employees ({employees.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Enter Login ID & PIN
          </button>
        </div>

        {/* Tab 1: Quick Switch Directory */}
        {activeTab === 'quick' && (
          <div className="p-6">
            <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
              <span>Select an employee profile to instantly assume their portal:</span>
              {onOpenAddEmployee && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddEmployee();
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-xs underline"
                >
                  + Add New Employee
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {employees.map((emp) => {
                const isCurrent = currentUser?.id === emp.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => handleQuickSwitch(emp.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-200 border border-slate-300"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {emp.name}
                          </span>
                          <span className="font-mono text-xs tabular-nums text-slate-500">
                            {emp.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{emp.designation}</span>
                          <span>·</span>
                          <span>{emp.department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          emp.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : emp.role === 'manager'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {emp.role === 'admin'
                          ? 'HR Admin'
                          : emp.role === 'manager'
                          ? 'Approver / Mgr'
                          : 'Staff'}
                      </span>

                      {isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-xs text-indigo-600 font-medium hover:underline">
                          Select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Manual Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleManualLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employee Login ID or Work Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. EMP-1001 or hr.karank@gmail.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hint: You can use any existing employee ID (EMP-1001 to EMP-1006).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                4-Digit Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono tracking-widest text-base"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Default PIN matches numeric digits of ID (e.g. 1001, 1002, 1003).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
              >
                Sign In to Employee Portal
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Role-Based Access Control Active</span>
          </div>
          <span className="font-mono tabular-nums text-[11px]">System: Oct 16, 2026</span>
        </div>
      </div>
    </div>
  );
};
