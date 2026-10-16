import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Check,
  X,
  FileCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { LeaveRequest, RegularizationRequest } from '../types';

export const LeaveApprovals: React.FC = () => {
  const {
    currentUser,
    leaveRequests,
    regularizationRequests,
    reviewLeave,
    reviewRegularization,
    getSubordinates,
    getEmployee,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'leaves' | 'regularizations'>('leaves');
  const [filterMode, setFilterMode] = useState<'pending' | 'processed'>('pending');

  // Review modal state
  const [selectedLeave, setSelectedLeave] = useState<{
    request: LeaveRequest;
    action: 'approved' | 'rejected';
  } | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');

  // Regularization review state
  const [selectedReg, setSelectedReg] = useState<{
    request: RegularizationRequest;
    action: 'approved' | 'rejected';
  } | null>(null);
  const [regComment, setRegComment] = useState('');

  if (!currentUser) return null;

  const isHR = currentUser.role === 'admin';
  const subordinates = getSubordinates(currentUser.id);
  const subIds = subordinates.map((s) => s.id);

  // Filter requests that current user has authority to approve:
  // - HR Admin can approve anyone
  // - Managers can approve their team / subordinates
  const actionableLeaves = leaveRequests.filter((l) => {
    // Cannot approve own leave unless admin with no manager
    if (l.employeeId === currentUser.id) return false;
    if (isHR) return true;
    return subIds.includes(l.employeeId);
  });

  const pendingLeaves = actionableLeaves.filter((l) => l.status === 'pending');
  const processedLeaves = actionableLeaves.filter((l) => l.status !== 'pending');

  const actionableRegs = regularizationRequests.filter((r) => {
    if (r.employeeId === currentUser.id) return false;
    if (isHR) return true;
    return subIds.includes(r.employeeId);
  });

  const pendingRegs = actionableRegs.filter((r) => r.status === 'pending');
  const processedRegs = actionableRegs.filter((r) => r.status !== 'pending');

  // Check if other team members in same department have approved leaves during requested period
  const getOverlappingTeamLeaves = (req: LeaveRequest) => {
    return leaveRequests.filter(
      (l) =>
        l.id !== req.id &&
        l.department === req.department &&
        l.status === 'approved' &&
        !(l.endDate < req.startDate || l.startDate > req.endDate)
    );
  };

  const handleConfirmLeaveReview = () => {
    if (!selectedLeave) return;
    reviewLeave(selectedLeave.request.id, selectedLeave.action, reviewerComment.trim() || undefined);
    setSelectedLeave(null);
    setReviewerComment('');
  };

  const handleConfirmRegReview = () => {
    if (!selectedReg) return;
    reviewRegularization(selectedReg.request.id, selectedReg.action, regComment.trim() || undefined);
    setSelectedReg(null);
    setRegComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Approvals & Authorization Inbox
              </h2>
              <p className="text-xs text-slate-500">
                Logged in as: <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.designation}) · Authority:{' '}
                {isHR ? 'Full HR Authority (All Employees)' : 'Department & Team Approver'}
              </p>
            </div>
          </div>

          {/* Section Selector: Leaves vs Regularization */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setActiveSection('leaves')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeSection === 'leaves'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Leave Applications</span>
                {pendingLeaves.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {pendingLeaves.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSection('regularizations')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeSection === 'regularizations'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Punch Adjustments</span>
                {pendingRegs.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {pendingRegs.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter sub-tab (Pending vs Processed) */}
        <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Authorization ({activeSection === 'leaves' ? pendingLeaves.length : pendingRegs.length})
            </button>
            <button
              onClick={() => setFilterMode('processed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'processed'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Action History ({activeSection === 'leaves' ? processedLeaves.length : processedRegs.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Direct Subordinates managed: {subordinates.length}
          </span>
        </div>
      </div>

      {/* SECTION 1: LEAVE REQUESTS */}
      {activeSection === 'leaves' && (
        <div className="space-y-4">
          {(filterMode === 'pending' ? pendingLeaves : processedLeaves).length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">
                {filterMode === 'pending' ? 'All caught up!' : 'No processed records yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {filterMode === 'pending'
                  ? 'There are no pending employee leave requests requiring your authorization at this time.'
                  : 'Requests you review will appear here with your comments and timestamp.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(filterMode === 'pending' ? pendingLeaves : processedLeaves).map((req) => {
                const emp = getEmployee(req.employeeId);
                const overlapping = getOverlappingTeamLeaves(req);
                const quota = emp?.leaveBalances[req.leaveType];
                const available = quota ? quota.total - quota.used : 0;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Employee Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            emp?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={req.employeeName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-300"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {req.employeeName}
                            </span>
                            <span className="font-mono text-xs tabular-nums text-slate-500">
                              {req.employeeId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {emp?.designation || req.department} · {req.department}
                          </p>
                        </div>
                      </div>

                      {/* Request Status / Action buttons */}
                      <div className="flex items-center gap-2">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedLeave({ request: req, action: 'approved' });
                                setReviewerComment('Approved.');
                              }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeave({ request: req, action: 'rejected' });
                                setReviewerComment('');
                              }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-lg transition-colors border border-rose-200 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${
                                req.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {req.status === 'approved' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              {req.status}
                            </span>
                            {req.reviewedBy && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                by {req.reviewedBy.name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle details strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                      <div>
                        <div className="text-slate-500 text-[11px]">Leave Category</div>
                        <div className="font-semibold text-slate-900 capitalize mt-0.5">
                          {req.leaveType} Leave
                        </div>
                        {quota && (
                          <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                            Available: {available} / {quota.total} days
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-slate-500 text-[11px]">Requested Span</div>
                        <div className="font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                          {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {req.isHalfDay
                            ? `Half Day (${req.halfDaySession?.replace('_', ' ')})`
                            : `${req.totalDays} full working days`}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500 text-[11px]">Reason Provided by Employee</div>
                        <p className="font-medium text-slate-800 mt-0.5">{req.reason}</p>
                        {req.emergencyContact && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Emergency contact: {req.emergencyContact}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Department overlap warning */}
                    {overlapping.length > 0 && req.status === 'pending' && (
                      <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-semibold">Team Schedule Overlap: </span>
                          <span>
                            {overlapping.map((o) => o.employeeName).join(', ')} already has approved leave during these dates.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Review comment display if processed */}
                    {req.reviewedBy?.comments && (
                      <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-slate-800">Reviewer Note: </span>
                          <span>{req.reviewedBy.comments}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: ATTENDANCE REGULARIZATION REQUESTS */}
      {activeSection === 'regularizations' && (
        <div className="space-y-4">
          {(filterMode === 'pending' ? pendingRegs : processedRegs).length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">No adjustment requests</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No attendance regularization requests found in this view.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(filterMode === 'pending' ? pendingRegs : processedRegs).map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {reg.employeeName}
                        </span>
                        <span className="font-mono tabular-nums text-slate-500 text-xs">
                          {reg.employeeId}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Requested punch adjustment for date:{' '}
                        <span className="font-semibold text-slate-700 font-mono">{reg.date}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {reg.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedReg({ request: reg, action: 'approved' });
                              setRegComment('Punch adjusted as verified.');
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Adjustment</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReg({ request: reg, action: 'rejected' });
                              setRegComment('');
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-lg transition-colors border border-rose-200 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded font-semibold capitalize ${
                            reg.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {reg.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px]">Requested Clock In</span>
                      <div className="font-mono font-semibold text-slate-800">
                        {reg.requestedClockIn}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Requested Clock Out</span>
                      <div className="font-mono font-semibold text-slate-800">
                        {reg.requestedClockOut}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Employee Explanation</span>
                      <div className="text-slate-800 font-medium">{reg.reason}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leave Approval Dialog */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 capitalize">
                {selectedLeave.action} Leave Request
              </h4>
              <button
                onClick={() => setSelectedLeave(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <div className="font-semibold text-slate-900">
                  {selectedLeave.request.employeeName} ({selectedLeave.request.department})
                </div>
                <div className="text-slate-600">
                  {selectedLeave.request.totalDays} day(s) · {selectedLeave.request.leaveType} Leave
                </div>
                <div className="text-slate-500 font-mono">
                  {selectedLeave.request.startDate} to {selectedLeave.request.endDate}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Reviewer Remarks / Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder={
                    selectedLeave.action === 'approved'
                      ? 'Add any handover notes or remarks...'
                      : 'State reason for rejection...'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLeave(null)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeaveReview}
                  className={`px-4 py-2 text-white font-medium rounded-lg shadow-xs transition-colors ${
                    selectedLeave.action === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {selectedLeave.action === 'approved' ? 'Approval' : 'Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regularization Dialog */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 capitalize">
                {selectedReg.action} Punch Adjustment
              </h4>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-semibold text-slate-900">
                  {selectedReg.request.employeeName}
                </div>
                <div className="text-slate-600 font-mono">Date: {selectedReg.request.date}</div>
                <div className="text-slate-500 font-mono">
                  Adjustment: {selectedReg.request.requestedClockIn} to {selectedReg.request.requestedClockOut}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Approval Comment
                </label>
                <input
                  type="text"
                  value={regComment}
                  onChange={(e) => setRegComment(e.target.value)}
                  placeholder="e.g. Verified with security gate log"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRegReview}
                  className={`px-4 py-2 text-white font-medium rounded-lg shadow-xs transition-colors ${
                    selectedReg.action === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {selectedReg.action === 'approved' ? 'Adjustment' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
