import React from 'react';
import { Search, MapPin, X, Clock, Sparkles } from 'lucide-react';

export const FiltersBar = ({
  filters,
  setFilters,
  availableLocations = [],
  availableSkills = [],
  onReset
}) => {
  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl space-y-4">
      {/* Search Input & Location Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Search Query */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search job title, skills (e.g. React, Node.js, Python)..."
            className="glass-input w-full pl-10 text-xs sm:text-sm"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="glass-input w-full pl-10 text-xs sm:text-sm appearance-none pr-8 cursor-pointer"
          >
            <option value="All">All Indian Cities</option>
            {availableLocations.map((loc, idx) => (
              <option key={idx} value={loc} className="bg-slate-900 text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        
        {/* Sort By Toggle */}
        <div className="flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/20 p-1 rounded-xl">
          <span className="text-[11px] font-bold text-indigo-400 px-2 flex items-center space-x-1">
            <span>Sort:</span>
          </span>
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'date' }))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              filters.sortBy === 'date'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest Jobs</span>
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'match' }))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              filters.sortBy === 'match'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Match</span>
          </button>
        </div>

        {/* Work Mode Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilters(prev => ({ ...prev, workMode: mode }))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filters.workMode === mode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Experience Level Filter */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>Min Exp:</span>
          <select
            value={filters.minExp}
            onChange={(e) => setFilters(prev => ({ ...prev, minExp: Number(e.target.value) }))}
            className="glass-input py-1 px-2.5 text-xs font-bold"
          >
            <option value={0}>Any Experience</option>
            <option value={1}>1+ Years</option>
            <option value={2}>2+ Years</option>
            <option value={3}>3+ Years</option>
            <option value={5}>5+ Years</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onReset}
          className="ml-auto text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center space-x-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

      </div>
    </div>
  );
};
