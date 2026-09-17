import React from 'react';
import { JobCard } from './JobCard.jsx';
import { BookmarkCheck, History, Briefcase } from 'lucide-react';

export const SavedJobsView = ({
  savedJobs = [],
  viewedJobs = [],
  matchResultsMap,
  onSelectJob,
  onToggleSave,
  mode
}) => {
  const jobsList = mode === 'saved' ? savedJobs : viewedJobs;
  const title = mode === 'saved' ? 'Bookmarked Saved Jobs' : 'Recently Viewed Openings';
  const Icon = mode === 'saved' ? BookmarkCheck : History;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {jobsList.length} position(s) in your {mode === 'saved' ? 'saved list' : 'view history'}.
            </p>
          </div>
        </div>
      </div>

      {jobsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobsList.map((job) => {
            const matchResult = matchResultsMap.get(job.id) || {
              job,
              overallMatchScore: 75,
              breakdown: {
                skillsMatch: 80,
                experienceMatch: 70,
                educationMatch: 85,
                projectRelevance: 75,
                roleSimilarity: 80,
                certifications: 60
              },
              missingSkills: (job.requiredSkills || []).slice(0, 2),
              matchedSkills: (job.requiredSkills || []).slice(2),
              difficulty: 'Moderate',
              difficultyReasons: ['Moderate candidate qualification match.']
            };

            const isSaved = savedJobs.some(j => j.id === job.id);

            return (
              <JobCard
                key={job.id}
                matchResult={matchResult}
                onSelectJob={onSelectJob}
                onToggleSave={onToggleSave}
                isSaved={isSaved}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No {mode === 'saved' ? 'Saved Jobs' : 'Viewed Jobs'} Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the recommended job openings on the dashboard and bookmark positions to compare later.
          </p>
        </div>
      )}
    </div>
  );
};
