import React from 'react';
import { DifficultyBadge } from './DifficultyBadge.jsx';
import { MapPin, Building2, IndianRupee, Bookmark, ExternalLink, Sparkles, Clock } from 'lucide-react';

export const JobCard = ({
  matchResult,
  onSelectJob,
  onToggleSave,
  isSaved = false
}) => {
  const { job, overallMatchScore, breakdown, missingSkills = [], difficulty, difficultyReasons = [] } = matchResult;

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (score >= 65) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
  };

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {job.workMode || 'On-site'}
              </span>
              <DifficultyBadge difficulty={difficulty} reasons={difficultyReasons} />
              
              {/* Posting Recency Tag */}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>{job.postedDate || 'Latest'}</span>
              </span>
            </div>

            <h3 
              onClick={() => onSelectJob(matchResult)}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
            >
              {job.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>{job.company}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{job.location}</span>
              </span>
              {job.salaryText && (
                <span className="flex items-center space-x-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{job.salaryText}</span>
                </span>
              )}
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-xl border text-center font-extrabold text-sm sm:text-base ${getScoreBadgeClass(overallMatchScore)}`}>
              {overallMatchScore}%
              <span className="block text-[9px] font-normal uppercase tracking-wider opacity-80">Match</span>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleSave(job)}
              className={`mt-2 p-2 rounded-xl transition-all ${
                isSaved
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
              }`}
              title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Explainable Match Breakdown Pills */}
        <div className="flex flex-wrap gap-2 mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
            Skills: {breakdown?.skillsMatch || 0}%
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300">
            Exp: {breakdown?.experienceMatch || 0}% ({job.requiredExperienceYears || 0}+ yrs req)
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
            Edu: {breakdown?.educationMatch || 0}%
          </span>
        </div>

        {/* Missing Skills Section */}
        {missingSkills.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 block mb-1">
              Missing Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {missingSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                >
                  +{skill}
                </span>
              ))}
              {missingSkills.length > 4 && (
                <span className="text-[10px] font-medium text-slate-400">
                  +{missingSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60 gap-2">
        <button
          onClick={() => onSelectJob(matchResult)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all text-center flex items-center justify-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>View Analysis</span>
        </button>

        <a
          href={job.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all text-center flex items-center justify-center space-x-1 shadow-md shadow-indigo-600/20"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
