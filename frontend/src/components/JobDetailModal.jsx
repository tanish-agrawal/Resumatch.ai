import React, { useState } from 'react';
import { MatchScoreChart } from './MatchScoreChart.jsx';
import { SkillsRadarChart } from './SkillsRadarChart.jsx';
import { DifficultyBadge } from './DifficultyBadge.jsx';
import { X, ExternalLink, Building2, MapPin, IndianRupee, CheckCircle2, AlertCircle, Sparkles, Award, Clock } from 'lucide-react';

export const JobDetailModal = ({ matchResult, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState('match');

  if (!matchResult) return null;

  const { job, overallMatchScore, breakdown, missingSkills = [], matchedSkills = [], difficulty, difficultyReasons = [] } = matchResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="glass-card w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {job.workMode || 'On-site'}
              </span>
              <DifficultyBadge difficulty={difficulty} reasons={difficultyReasons} />
              
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Posted: {job.postedDate || 'Recently'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>{job.company}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{job.location}</span>
              </span>
              {job.salaryText && (
                <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <IndianRupee className="w-4 h-4" />
                  <span>{job.salaryText}</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 px-6 bg-slate-50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveSubTab('match')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeSubTab === 'match'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Match Breakdown & Radar
          </button>
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeSubTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Skill Coverage ({matchedSkills.length} Matched / {missingSkills.length} Missing)
          </button>
          <button
            onClick={() => setActiveSubTab('description')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeSubTab === 'description'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Full Description
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeSubTab === 'match' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Skills Radar Map</span>
                </h4>
                <SkillsRadarChart breakdown={breakdown} />
              </div>

              {/* Score Breakdown Bar List */}
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Weighted Score Components
                </h4>
                <MatchScoreChart overallScore={overallMatchScore} breakdown={breakdown} />
              </div>
            </div>
          )}

          {activeSubTab === 'skills' && (
            <div className="space-y-6">
              {/* Matched Skills */}
              <div className="glass-card p-5 rounded-2xl border-emerald-500/20">
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Matched Required Skills ({matchedSkills.length})</span>
                </h4>
                {matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No direct skill matches detected in resume text.</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="glass-card p-5 rounded-2xl border-rose-500/20">
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <span>Missing Skills to Learn ({missingSkills.length})</span>
                </h4>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-500/20"
                      >
                        + {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400 font-medium">Outstanding! You meet all listed skill requirements for this position.</p>
                )}
              </div>

              {/* Difficulty Reasons */}
              <div className="glass-card p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <span>Company Difficulty Analysis ({difficulty})</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {difficultyReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'description' && (
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Full Job Description</h4>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Adzuna Job ID: <code className="text-indigo-400">{job.id}</code>
          </div>
          <a
            href={job.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <span>Apply directly on Company Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
