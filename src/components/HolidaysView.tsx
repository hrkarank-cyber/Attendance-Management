import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarCheck, Calendar, Sparkles } from 'lucide-react';

export const HolidaysView: React.FC = () => {
  const { holidays, todayDate } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Official Company Holiday Calendar (2026)
            </h2>
            <p className="text-xs text-slate-500">
              Public holidays and observed corporate office non-working days.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {holidays.map((hol) => {
            const isPast = hol.date < todayDate;
            const isUpcoming = hol.date >= todayDate;

            return (
              <div
                key={hol.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUpcoming
                    ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm block">
                      {hol.name}
                    </span>
                    <span className="font-mono text-slate-500 tabular-nums mt-0.5 block">
                      {new Date(hol.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isPast
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {isPast ? 'Past' : 'Upcoming'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="capitalize">{hol.type} Paid Holiday</span>
                  <span className="font-mono text-[10px]">{hol.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
