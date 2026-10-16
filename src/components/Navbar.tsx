import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  Users,
  CalendarCheck,
  UserCheck,
  LogOut,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSwitchUser: () => void;
  onOpenAddEmployee: () => void;
  onGoToOpeningPage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSwitchUser,
  onOpenAddEmployee,
  onGoToOpeningPage,
}) => {
  const { currentUser, logout, getPendingApprovalsCount } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingApprovals = currentUser ? getPendingApprovalsCount(currentUser.id) : 0;
  const isManagerOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav links) - Zone 3 (Profile / Primary Action) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <button
            onClick={onGoToOpeningPage}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
            title="Return to Portal Opening Page"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block group-hover:text-indigo-600 transition-colors">
                WorkPulse HR
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, concise) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('attendance')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'attendance'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Punch & Tracker</span>
            </button>

            <button
              onClick={() => setCurrentTab('leaves')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'leaves'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-slate-500" />
              <span>Leave Portal</span>
            </button>

            {isManagerOrAdmin && (
              <button
                onClick={() => setCurrentTab('approvals')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  currentTab === 'approvals'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>Approvals</span>
                {pendingApprovals > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-white tabular-nums">
                    {pendingApprovals}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentTab('roster')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'roster'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Company Roster</span>
            </button>

            <button
              onClick={() => setCurrentTab('holidays')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'holidays'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-slate-500" />
              <span>Holidays</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action & Profile switcher */}
          <div className="flex items-center gap-3 shrink-0 relative">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSwitchUser}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Switch login profile to test different roles (Employee / Manager / HR)"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Switch Employee</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    aria-expanded={profileDropdownOpen}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover bg-slate-200 border border-slate-300"
                    />
                    <div className="text-left hidden lg:block leading-tight">
                      <div className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {currentUser.id}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="font-mono tabular-nums font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {currentUser.id}
                          </span>
                          <span>·</span>
                          <span className="capitalize">{currentUser.role}</span>
                          <span>·</span>
                          <span>{currentUser.department}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenSwitchUser();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <span>Switch to Another Employee</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenAddEmployee();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span>Add New Employee</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        {onGoToOpeningPage && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onGoToOpeningPage();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                          >
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            <span>Portal Opening Page</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            if (onGoToOpeningPage) onGoToOpeningPage();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenSwitchUser}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
              >
                Sign In / Select Employee
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentTab('attendance')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'attendance' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Punch & Tracker
          </button>
          <button
            onClick={() => setCurrentTab('leaves')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'leaves' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Leave Portal
          </button>
          {isManagerOrAdmin && (
            <button
              onClick={() => setCurrentTab('approvals')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium flex items-center gap-1 ${
                currentTab === 'approvals' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              <span>Approvals</span>
              {pendingApprovals > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingApprovals}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setCurrentTab('roster')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'roster' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Roster
          </button>
          <button
            onClick={() => setCurrentTab('holidays')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'holidays' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Holidays
          </button>
        </div>
      </div>
    </header>
  );
};
