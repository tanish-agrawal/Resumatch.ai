import React from 'react';
import { LayoutDashboard, Briefcase, UserCheck, Lightbulb, BookmarkCheck, History } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, savedCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Recommended Jobs', icon: Briefcase },
    { id: 'profile', label: 'Resume Profile', icon: UserCheck },
    { id: 'ai-suggestions', label: 'AI Advice & Skills', icon: Lightbulb },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: BookmarkCheck, badge: savedCount > 0 ? savedCount : null },
    { id: 'history', label: 'Recently Viewed', icon: History },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 glass-card p-3 rounded-2xl mb-6 md:mb-0">
      <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
