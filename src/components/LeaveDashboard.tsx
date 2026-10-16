import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
} from 'lucide-react';
import { LeaveStatus, LeaveType } from '../types';

interface LeaveDashboardProps {
  onOpenApplyLeave: () => void;
}

export const LeaveDashboard: React.FC<LeaveDashboardProps> = ({ onOpenApplyLeave }) => {
  const { currentUser, leaveRequests, cancelLeave } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Filter this employee's leave requests
  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentUser.id);

  const filteredLeaves = myLeaves.filter((l) => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.reason.toLowerCase().includes(q) ||
        l.leaveType.toLowerCase().includes(q) ||
        l.startDate.includes(q) ||
        l.endDate.includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const quotas: { key: LeaveType; label: string; desc: string }[] = [
    { key: 'paid', label: 'Paid / Annual Leave', desc: 'Planned vacations and holidays' },
    { key: 'sick', label: 'Sick & Medical Leave', desc: 'Illness, health & doctor visits' },
    { key: 'casual', label: 'Casual / Personal Leave', desc: 'Personal work & short emergencies' },
    { key: 'unpaid', label: 'Unpaid Leave (LOP)', desc: 'Leave without pay' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quotas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Annual Leave Balances & Entitlements
              </h2>
              <p className="text-xs text-slate-500">
                Employee: {currentUser.name} ({currentUser.id}) · Quota Year 2026
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApplyLeave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>

        {/* 4 Quota Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-2 sm:p-4">
          {quotas.map(({ key, label, desc }) => {
            const quota = currentUser.leaveBalances[key];
            const remaining = quota.total - quota.used;
            const pctUsed = quota.total > 0 ? (quota.used / quota.total) * 100 : 0;

            return (
              <div key={key} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{label}</span>
                  {key !== 'unpaid' && (
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {quota.used} used
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-2xl font-bold text-slate-900">
                    {key === 'unpaid' ? quota.used : remaining}
                  </span>
                  {key !== 'unpaid' && (
                    <span className="text-xs text-slate-500">/ {quota.total} available</span>
                  )}
                  {key === 'unpaid' && <span className="text-xs text-slate-500">days taken</span>}
                </div>

                {key !== 'unpaid' ? (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, pctUsed)}%` }}
                    />
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">Subject to manager approval</div>
                )}

                <p className="text-[11px] text-slate-500 pt-1">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Application History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">My Leave Applications</h3>
            <p className="text-xs text-slate-500">
              Track the progress, approval status, and remarks of your leave requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search reason or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {['all', 'pending', 'approved', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    filterStatus === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Body */}
        {filteredLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No leave requests found</p>
            <p className="text-xs text-slate-400 mt-1">
              You haven't submitted any leave requests matching this filter.
            </p>
            <button
              onClick={onOpenApplyLeave}
              className="mt-4 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Apply for Leave Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">Leave Period</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Reason & Notes</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Reviewer Details</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeaves.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Type */}
                    <td className="px-6 py-4 font-semibold text-slate-900 capitalize">
                      {item.leaveType} Leave
                      {item.isHalfDay && (
                        <span className="block text-[11px] text-slate-500 font-normal">
                          Half-day ({item.halfDaySession?.replace('_', ' ')})
                        </span>
                      )}
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4 font-mono tabular-nums">
                      <div>{item.startDate}</div>
                      {!item.isHalfDay && item.startDate !== item.endDate && (
                        <div className="text-slate-400 text-[11px]">to {item.endDate}</div>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 font-mono tabular-nums font-semibold text-slate-900">
                      {item.totalDays} {item.totalDays === 1 ? 'day' : 'days'}
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-800" title={item.reason}>
                        {item.reason}
                      </p>
                      {item.emergencyContact && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          Contact: {item.emergencyContact}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>

                    {/* Reviewer remarks */}
                    <td className="px-6 py-4">
                      {item.reviewedBy ? (
                        <div>
                          <div className="font-medium text-slate-900">{item.reviewedBy.name}</div>
                          {item.reviewedBy.comments && (
                            <p className="text-[11px] text-slate-500 italic truncate max-w-[180px]">
                              "{item.reviewedBy.comments}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Awaiting review</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => cancelLeave(item.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
