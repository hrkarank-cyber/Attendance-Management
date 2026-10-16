import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Play,
  Square,
  Coffee,
  Building,
  Laptop,
  CheckCircle,
  AlertCircle,
  History,
  Timer,
  CalendarCheck,
} from 'lucide-react';

interface PunchClockCardProps {
  onOpenRegularization: () => void;
}

export const PunchClockCard: React.FC<PunchClockCardProps> = ({ onOpenRegularization }) => {
  const { currentUser, getTodayAttendance, clockIn, clockOut, startBreak, endBreak, todayDate } =
    useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedWorkMode, setSelectedWorkMode] = useState<'office' | 'remote'>('office');
  const [breakType, setBreakType] = useState('lunch');
  const [showBreakOptions, setShowBreakOptions] = useState(false);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayRecord = getTodayAttendance(currentUser.id);
  const isClockedIn = Boolean(todayRecord?.clockIn && !todayRecord?.clockOut);
  const isClockedOut = Boolean(todayRecord?.clockIn && todayRecord?.clockOut);
  const activeBreak = todayRecord?.breaks.find((b) => !b.endTime);

  // Calculate live work duration if currently clocked in
  const calculateWorkElapsed = (): { hours: number; minutes: number; seconds: number } => {
    if (!todayRecord?.clockIn) return { hours: 0, minutes: 0, seconds: 0 };
    const startMs = new Date(todayRecord.clockIn).getTime();
    const endMs = todayRecord.clockOut
      ? new Date(todayRecord.clockOut).getTime()
      : currentTime.getTime();
    
    // deduct total break time
    let totalBreakMs = (todayRecord.totalBreakMinutes || 0) * 60 * 1000;
    if (activeBreak) {
      const breakStartMs = new Date(activeBreak.startTime).getTime();
      totalBreakMs += Math.max(0, currentTime.getTime() - breakStartMs);
    }

    const elapsedMs = Math.max(0, endMs - startMs - totalBreakMs);
    const totalSecs = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return { hours, minutes, seconds };
  };

  const calculateBreakElapsed = (): { minutes: number; seconds: number } => {
    if (!activeBreak) return { minutes: 0, seconds: 0 };
    const startMs = new Date(activeBreak.startTime).getTime();
    const elapsedMs = Math.max(0, currentTime.getTime() - startMs);
    const totalSecs = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return { minutes, seconds };
  };

  const workElapsed = calculateWorkElapsed();
  const breakElapsed = calculateBreakElapsed();

  const formatTwoDigits = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const formatTimeString = (iso: string | null | undefined) => {
    if (!iso) return '--:--';
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Attendance Terminal & Live Punch</h2>
            <p className="text-xs text-slate-500">
              Shift: {currentUser.shift.name} ({currentUser.shift.start} - {currentUser.shift.end})
            </p>
          </div>
        </div>

        {/* Date and grace period info */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Today: {todayDate}</span>
          </div>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-slate-500">
            Grace: {currentUser.shift.graceMinutes}m
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Clock Display & Action Punch */}
          <div className="lg:col-span-7 space-y-6">
            {/* Digital Clock */}
            <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>LOCAL OFFICE TIME</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Large Clock */}
              <div className="flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              {/* Status pill inside clock */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  {activeBreak ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-amber-300 bg-amber-950/60 font-medium">
                      <Coffee className="w-3.5 h-3.5" />
                      On Break ({activeBreak.type})
                    </span>
                  ) : isClockedIn ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-emerald-300 bg-emerald-950/60 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Currently Working
                    </span>
                  ) : isClockedOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-300 bg-slate-800 font-medium">
                      Shift Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 bg-slate-800">
                      Not Punched In
                    </span>
                  )}
                </div>

                {/* Live timer count */}
                {(isClockedIn || isClockedOut) && (
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono tabular-nums">
                    <Timer className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      {formatTwoDigits(workElapsed.hours)}h : {formatTwoDigits(workElapsed.minutes)}m : {formatTwoDigits(workElapsed.seconds)}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Punch Controls */}
            <div className="space-y-4">
              {!isClockedIn && !isClockedOut && (
                <div className="space-y-3">
                  {/* Mode select */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Location:</span>
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      <button
                        onClick={() => setSelectedWorkMode('office')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          selectedWorkMode === 'office'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>In-Office</span>
                      </button>
                      <button
                        onClick={() => setSelectedWorkMode('remote')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          selectedWorkMode === 'remote'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Work From Home</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => clockIn(currentUser.id, selectedWorkMode)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Clock In for Today</span>
                  </button>
                </div>
              )}

              {isClockedIn && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Break Action */}
                    {activeBreak ? (
                      <button
                        onClick={() => endBreak(currentUser.id)}
                        className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>
                          Resume Work ({formatTwoDigits(breakElapsed.minutes)}m {formatTwoDigits(breakElapsed.seconds)}s)
                        </span>
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => setShowBreakOptions(!showBreakOptions)}
                          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300 cursor-pointer"
                        >
                          <Coffee className="w-4 h-4 text-slate-600" />
                          <span>Take a Break</span>
                        </button>

                        {showBreakOptions && (
                          <div className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-10 space-y-1">
                            <button
                              onClick={() => {
                                startBreak(currentUser.id, 'Lunch');
                                setShowBreakOptions(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                            >
                              <span>Lunch Break (45m)</span>
                              <Coffee className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button
                              onClick={() => {
                                startBreak(currentUser.id, 'Tea / Coffee');
                                setShowBreakOptions(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                            >
                              <span>Tea / Coffee (15m)</span>
                              <Coffee className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button
                              onClick={() => {
                                startBreak(currentUser.id, 'Personal / Step-out');
                                setShowBreakOptions(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                            >
                              <span>Personal / Step-out</span>
                              <Coffee className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Clock Out Action */}
                    <button
                      onClick={() => clockOut(currentUser.id)}
                      className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Clock Out</span>
                    </button>
                  </div>
                </div>
              )}

              {isClockedOut && todayRecord && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Your shift is logged for today</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Total Hours Worked:{' '}
                    <span className="font-mono font-medium text-slate-800">
                      {Math.floor(todayRecord.totalWorkMinutes / 60)}h {todayRecord.totalWorkMinutes % 60}m
                    </span>
                    {' · '}Break Duration:{' '}
                    <span className="font-mono font-medium text-slate-800">
                      {todayRecord.totalBreakMinutes}m
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Today's Punch Metrics & Activity Log */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Today's Timecard</span>
              </span>
              <button
                onClick={onOpenRegularization}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                Regularize Punch
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <div className="text-slate-500 text-[11px]">Clock In</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                  {formatTimeString(todayRecord?.clockIn)}
                </div>
                {todayRecord?.status === 'late' && (
                  <span className="text-[10px] text-amber-600 font-medium">Late Mark</span>
                )}
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <div className="text-slate-500 text-[11px]">Clock Out</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                  {formatTimeString(todayRecord?.clockOut)}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <div className="text-slate-500 text-[11px]">Break Duration</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 mt-0.5">
                  {todayRecord?.totalBreakMinutes || 0} mins
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <div className="text-slate-500 text-[11px]">Work Mode</div>
                <div className="text-sm font-semibold capitalize text-slate-900 mt-0.5">
                  {todayRecord?.workMode || currentUser.workType}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Timeline Events
              </div>
              <div className="space-y-2 text-xs">
                {todayRecord?.clockIn ? (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-800">Checked In ({todayRecord.workMode})</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {formatTimeString(todayRecord.clockIn)}
                        </span>
                      </div>
                      {todayRecord.notes && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{todayRecord.notes}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs py-1">No punch records logged yet today.</div>
                )}

                {todayRecord?.breaks.map((b, idx) => (
                  <div key={b.id || idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-800">{b.type} Break</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {formatTimeString(b.startTime)} - {formatTimeString(b.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {todayRecord?.clockOut && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-800">Checked Out</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {formatTimeString(todayRecord.clockOut)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
