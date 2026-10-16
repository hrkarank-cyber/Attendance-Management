import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Users,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface OpeningPageProps {
  onEnterDashboard: () => void;
}

export const OpeningPage: React.FC<OpeningPageProps> = ({ onEnterDashboard }) => {
  const { employees, currentUser, login, switchUser, todayDate, attendanceRecords } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('credentials');
  const [loginId, setLoginId] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live stats today
  const todayRecords = attendanceRecords.filter((r) => r.date === todayDate);
  const presentCount = todayRecords.filter(
    (r) => (r.status === 'present' || r.status === 'late') && r.clockIn
  ).length;
  const onLeaveCount = todayRecords.filter((r) => r.status === 'on_leave').length;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(loginId, pin);
    if (res.success) {
      onEnterDashboard();
    } else {
      setErrorMsg(res.error || 'Invalid Employee ID or PIN. Please try again.');
    }
  };

  const handleQuickLogin = (empId: string) => {
    switchUser(empId);
    onEnterDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Context Metadata) - Zone 3 (Action) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                WorkPulse HR
              </span>
            </div>
          </div>

          {/* Zone 2: Organization Shift & System context */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Shift: 09:00 AM - 06:00 PM</span>
            </div>
            <span>·</span>
            <span>Grace Period: 15 mins</span>
            <span>·</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-mono tabular-nums">{todayDate}</span>
            </div>
          </div>

          {/* Zone 3: Active user or quick jump */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <button
                onClick={onEnterDashboard}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <span>Enter Dashboard as {currentUser.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  const el = document.getElementById('login-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Employee Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero & Login Section */}
      <section className="relative overflow-hidden py-10 lg:py-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Organization Portal Presentation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enterprise Attendance & Leave Authority System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                Track Attendance. Apply Leaves. Authorize Approvals.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Welcome to your organisation's central workforce portal. Each employee is assigned an individual Login ID to track daily punches, manage leave balances, and participate in multi-tier approval hierarchies.
              </p>

              {/* Value checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Unique Employee Login ID</span>
                    <span className="text-slate-500">Dedicated employee portal with 4-digit security PIN.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Real-time Punch & Breaks</span>
                    <span className="text-slate-500">Live work timer, lunch & tea break logging, grace alerts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Leave Entitlement Balances</span>
                    <span className="text-slate-500">Paid, Sick, Casual, and Unpaid leave with auto-balance calculation.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Multi-Tier Approvals</span>
                    <span className="text-slate-500">Reporting managers and HR approve with overlap safeguards.</span>
                  </div>
                </div>
              </div>

              {/* Today's live snapshot pills */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Active Staff</span>
                  <span className="font-bold font-mono tabular-nums text-slate-900 text-sm">
                    {employees.length} Employees
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Present Today</span>
                  <span className="font-bold font-mono tabular-nums text-emerald-700 text-sm">
                    {presentCount} Clocked In
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Approved Leaves</span>
                  <span className="font-bold font-mono tabular-nums text-blue-700 text-sm">
                    {onLeaveCount} On Leave
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Login Box */}
            <div id="login-section" className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Login Header */}
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Sign In to Your Account</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your employee credentials or choose from the organization directory below.
                  </p>

                  {/* Mode switcher tabs */}
                  <div className="mt-4 flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => {
                        setActiveTab('credentials');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 rounded-md transition-all ${
                        activeTab === 'credentials'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Login ID & PIN
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('quick');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 rounded-md transition-all ${
                        activeTab === 'quick'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Employees ({employees.length})
                    </button>
                  </div>
                </div>

                {/* Tab 1: Form Login */}
                {activeTab === 'credentials' && (
                  <form onSubmit={handleManualLogin} className="p-6 space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Employee Login ID or Work Email
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. EMP-1001 or hr.karank@gmail.com"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
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
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono tracking-widest"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <span>Sign In to Employee Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick credential hints */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Pre-Configured Test Accounts (PIN is the 4 digits):
                      </div>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div
                          onClick={() => {
                            setLoginId('EMP-1001');
                            setPin('1001');
                          }}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                        >
                          <span className="font-semibold text-purple-700">EMP-1001 (Karan K. - HR Director)</span>
                          <span className="text-slate-400">PIN: 1001</span>
                        </div>
                        <div
                          onClick={() => {
                            setLoginId('EMP-1002');
                            setPin('1002');
                          }}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                        >
                          <span className="font-semibold text-blue-700">EMP-1002 (Elena R. - Tech Mgr)</span>
                          <span className="text-slate-400">PIN: 1002</span>
                        </div>
                        <div
                          onClick={() => {
                            setLoginId('EMP-1003');
                            setPin('1003');
                          }}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                        >
                          <span className="font-semibold text-slate-700">EMP-1003 (David C. - Dev)</span>
                          <span className="text-slate-400">PIN: 1003</span>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Tab 2: 1-Click Directory */}
                {activeTab === 'quick' && (
                  <div className="p-6">
                    <p className="text-xs text-slate-500 mb-3">
                      Select any employee persona to immediately open their portal:
                    </p>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {employees.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => handleQuickLogin(emp.id)}
                          className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover bg-slate-200 border border-slate-300 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-slate-900 truncate">
                                  {emp.name}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  {emp.id}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {emp.designation} · {emp.department}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
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
                                ? 'Approver'
                                : 'Staff'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillar Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                01. Live Punch Clock & Daily Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Employees check in with one tap from office or remote locations. Live timer tracks working seconds, meal/coffee breaks, and flags late arrivals beyond the 15-minute grace window.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                02. Multi-Category Leave Entitlements
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated quotas for Paid Annual, Sick/Medical, Casual, and Unpaid Leaves. Interactive application modal computes working days automatically, supporting half-days and attachments.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                03. Team Approvals & Overlap Alerts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Managers and HR review subordinate requests with full context: remaining balance, applicant reason, and automatic conflict detection if other teammates are off on the same dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">WorkPulse HR Portal</span>
            <span>·</span>
            <span>Official Organisation Workforce Management</span>
          </div>
          <span className="font-mono text-slate-400">Secure Access · Oct 16, 2026</span>
        </div>
      </footer>
    </div>
  );
};
