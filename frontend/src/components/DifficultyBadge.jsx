import React, { useState } from 'react';
import { ShieldCheck, Zap, AlertTriangle, Flame, Info } from 'lucide-react';

export const DifficultyBadge = ({ difficulty, reasons = [] }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const config = {
    Easy: {
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: ShieldCheck,
      desc: 'High qualification match. Low difficulty.'
    },
    Moderate: {
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Zap,
      desc: 'Moderate qualification match. Balanced fit.'
    },
    Competitive: {
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
      desc: 'High competition level or mild skill gap.'
    },
    'Highly Competitive': {
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: Flame,
      desc: 'Significant experience/skill gap. Fierce competition.'
    }
  }[difficulty] || {
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    icon: Info,
    desc: 'Unspecified difficulty.'
  };

  const Icon = config.icon;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold cursor-help transition-all ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{difficulty}</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-900 text-white text-xs shadow-2xl z-50 border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <p className="font-bold mb-1 border-b border-slate-800 pb-1 flex items-center justify-between text-indigo-300">
            <span>Difficulty Analysis</span>
            <span className="text-[10px] text-slate-400 font-normal">{difficulty}</span>
          </p>
          {reasons.length > 0 ? (
            <ul className="space-y-1 mt-1 text-slate-300">
              {reasons.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-1">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">{config.desc}</p>
          )}
        </div>
      )}
    </div>
  );
};
