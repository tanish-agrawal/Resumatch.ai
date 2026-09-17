import React from 'react';
import { Mail, Phone, Briefcase, Code2, Award, FolderKanban, Sparkles } from 'lucide-react';

export const ResumeProfileView = ({ profile, fileName, onUploadNew }) => {
  const skills = profile.skills || [];
  const certs = profile.certifications || [];
  const experience = profile.experience || [];
  const projects = profile.projects || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-indigo-500/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name || 'Candidate'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {profile.totalExperienceYears || 0} Yrs Experience
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {profile.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{profile.email}</span>
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{profile.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onUploadNew}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Update Resume File
          </button>
        </div>

        {profile.summary && (
          <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 leading-relaxed">
            {profile.summary}
          </p>
        )}
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Extracted Skills */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Parsed Skills ({skills.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-500/20"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>Certifications ({certs.length})</span>
          </h3>
          {certs.length > 0 ? (
            <div className="space-y-2">
              {certs.map((cert, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No explicit certifications detected.</p>
          )}
        </div>

        {/* Experience Timeline */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Experience History</span>
          </h3>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{exp.title}</span>
                  <span className="text-slate-400 font-normal">{exp.duration || `${exp.years || 1} yrs`}</span>
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{exp.company}</div>
                {exp.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Projects */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FolderKanban className="w-4 h-4 text-indigo-500" />
            <span>Highlighted Projects</span>
          </h3>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{proj.title}</div>
                {proj.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
