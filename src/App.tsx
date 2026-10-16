import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { OpeningPage } from './components/OpeningPage';
import { PunchClockCard } from './components/PunchClockCard';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { LeaveDashboard } from './components/LeaveDashboard';
import { LeaveApprovals } from './components/LeaveApprovals';
import { CompanyAttendanceView } from './components/CompanyAttendanceView';
import { HolidaysView } from './components/HolidaysView';
import { SwitchUserModal } from './components/SwitchUserModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { RegularizationModal } from './components/RegularizationModal';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Home,
} from 'lucide-react';

function MainAppContent() {
  const { currentUser, resetToDemoData } = useApp();

  const [viewMode, setViewMode] = useState<'opening' | 'dashboard'>(() => {
    // If user has not explicitly signed in yet, show the Opening Page
    return currentUser ? 'dashboard' : 'opening';
  });

  const [currentTab, setCurrentTab] = useState<string>('attendance');
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [regularizationModalDate, setRegularizationModalDate] = useState<string | undefined>(undefined);
  const [isRegularizationOpen, setIsRegularizationOpen] = useState(false);

  // If on opening page OR no user is authenticated, render the rich Opening Page
  if (viewMode === 'opening' || !currentUser) {
    return <OpeningPage onEnterDashboard={() => setViewMode('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSwitchUser={() => setIsSwitchUserOpen(true)}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        onGoToOpeningPage={() => setViewMode('opening')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Context Employee Ribbon */}
        <div className="bg-white rounded-xl border border-slate-200/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900">{currentUser.name}</h1>
                <span className="font-mono text-xs tabular-nums text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                  {currentUser.id}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : currentUser.role === 'manager'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {currentUser.role === 'admin'
                    ? 'HR Administrator'
                    : currentUser.role === 'manager'
                    ? 'Team Lead / Approver'
                    : 'Employee'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.designation} · {currentUser.department} · Shift: {currentUser.shift.name} ({currentUser.shift.start} - {currentUser.shift.end})
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsApplyLeaveOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Apply Leave</span>
            </button>

            <button
              onClick={() => setIsSwitchUserOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-300"
              title="Switch user to test approval flow"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch Employee</span>
            </button>

            <button
              onClick={() => setViewMode('opening')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
              title="Return to the Portal Opening Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Opening Page</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Attendance Punch & Calendar */}
        {currentTab === 'attendance' && (
          <div className="space-y-6">
            <PunchClockCard
              onOpenRegularization={() => {
                setRegularizationModalDate(undefined);
                setIsRegularizationOpen(true);
              }}
            />
            <AttendanceCalendar
              onOpenRegularization={(date) => {
                setRegularizationModalDate(date);
                setIsRegularizationOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Leave Portal */}
        {currentTab === 'leaves' && (
          <LeaveDashboard onOpenApplyLeave={() => setIsApplyLeaveOpen(true)} />
        )}

        {/* Tab 3: Approvals (Managers & HR) */}
        {currentTab === 'approvals' && <LeaveApprovals />}

        {/* Tab 4: Organization Roster */}
        {currentTab === 'roster' && <CompanyAttendanceView />}

        {/* Tab 5: Holidays */}
        {currentTab === 'holidays' && <HolidaysView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">WorkPulse HR Attendance & Leave Suite</span>
            <span>·</span>
            <span>Enterprise Punctuality & Leave Management</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('opening')}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              View Opening Page
            </button>
            <span>·</span>
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
              title="Reset all punch logs and leave requests to original demo records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
            <span>·</span>
            <span className="font-mono tabular-nums text-slate-400">Version 2.4.0-PROD</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SwitchUserModal
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
      />

      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />

      <RegularizationModal
        isOpen={isRegularizationOpen}
        initialDate={regularizationModalDate}
        onClose={() => setIsRegularizationOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
