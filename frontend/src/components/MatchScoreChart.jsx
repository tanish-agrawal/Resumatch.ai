import React from 'react';

export const MatchScoreChart = ({ overallScore, breakdown }) => {
  const items = [
    { label: 'Skills Match', score: breakdown?.skillsMatch || 0, weight: '40%', color: 'bg-indigo-500' },
    { label: 'Experience Match', score: breakdown?.experienceMatch || 0, weight: '20%', color: 'bg-purple-500' },
    { label: 'Education Match', score: breakdown?.educationMatch || 0, weight: '15%', color: 'bg-blue-500' },
    { label: 'Project Relevance', score: breakdown?.projectRelevance || 0, weight: '10%', color: 'bg-emerald-500' },
    { label: 'Role Similarity', score: breakdown?.roleSimilarity || 0, weight: '10%', color: 'bg-cyan-500' },
    { label: 'Certifications', score: breakdown?.certifications || 0, weight: '5%', color: 'bg-amber-500' },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 65) return 'text-indigo-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="space-y-4">
      {/* Overall Score Badge */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Overall Compatibility</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Weighted Score Algorithm</span>
        </div>
        <div className={`text-3xl font-extrabold ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {item.label} <span className="text-slate-400 font-normal">({item.weight})</span>
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{item.score}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
