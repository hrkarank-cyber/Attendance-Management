import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LeaveType } from '../types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, applyLeave } = useApp();

  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [startDate, setStartDate] = useState('2026-10-19'); // Next Monday
  const [endDate, setEndDate] = useState('2026-10-19');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDaySession, setHalfDaySession] = useState<'first_half' | 'second_half'>('first_half');
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !currentUser) return null;

  // Calculate days between start and end date
  const calculateDays = (): number => {
    if (isHalfDay) return 0.5;
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      // Skip weekends (0 Sun, 6 Sat)
      if (day !== 0 && day !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  };

  const calculatedDuration = calculateDays();
  const currentQuota = currentUser.leaveBalances[leaveType];
  const availableBalance = currentQuota.total - currentQuota.used;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (calculatedDuration <= 0) {
      setErrorMsg('End date cannot precede the start date.');
      return;
    }

    if (leaveType !== 'unpaid' && availableBalance < calculatedDuration) {
      setErrorMsg(
        `Insufficient ${leaveType} balance. You have ${availableBalance} days available, but requested ${calculatedDuration} day(s).`
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please specify the reason for your leave application.');
      return;
    }

    const res = applyLeave({
      leaveType,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      isHalfDay,
      halfDaySession: isHalfDay ? halfDaySession : undefined,
      totalDays: calculatedDuration,
      reason: reason.trim(),
      emergencyContact: emergencyContact.trim() || undefined,
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg('');
        setReason('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Apply for Leave</h3>
              <p className="text-xs text-slate-500">
                Submit an application for your reporting manager's approval.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Leave Type Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Select Leave Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['paid', 'casual', 'sick', 'unpaid'] as LeaveType[]).map((type) => {
                const bal = currentUser.leaveBalances[type];
                const rem = bal.total - bal.used;
                const isSelected = leaveType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setLeaveType(type);
                      setErrorMsg('');
                    }}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold capitalize text-slate-900">
                      {type === 'paid' ? 'Paid / Annual' : `${type} Leave`}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                      {type === 'unpaid' ? 'Loss of Pay' : `${rem} of ${bal.total} left`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Half day toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-semibold text-slate-800">Half-Day Application</span>
              <p className="text-[11px] text-slate-500">Apply for 0.5 day only</p>
            </div>
            <input
              type="checkbox"
              id="halfday"
              checked={isHalfDay}
              onChange={(e) => setIsHalfDay(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>

          {/* If Half Day, Session Selector */}
          {isHalfDay && (
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">Session:</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="session"
                    checked={halfDaySession === 'first_half'}
                    onChange={() => setHalfDaySession('first_half')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>First Half (Morning)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                  <input
                    type="radio"
                    name="session"
                    checked={halfDaySession === 'second_half'}
                    onChange={() => setHalfDaySession('second_half')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Second Half (Afternoon)</span>
                </label>
              </div>
            </div>
          )}

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHalfDay ? 'Date' : 'Start Date'}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (isHalfDay || new Date(endDate) < new Date(e.target.value)) {
                    setEndDate(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>

            {!isHalfDay && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Calculated Duration Indicator */}
          <div className="flex items-center justify-between px-3 py-2 bg-indigo-50/60 rounded-lg border border-indigo-100 text-indigo-900">
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Calculated Leave Duration:</span>
            </span>
            <span className="font-mono font-bold tabular-nums">
              {calculatedDuration} {calculatedDuration === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason / Justification <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Attending family wedding, doctor visit, personal travel..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Emergency Contact / Colleague Handover (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Phone number or standby colleague name"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
