import React, { useState } from 'react';
import { Lightbulb, Award, Cpu, Code, BookOpen, FileCheck, Sparkles, CheckCircle } from 'lucide-react';

export const AISuggestionsCard = ({ suggestions, loading = false }) => {
  const [activeTab, setActiveTab] = useState('skills');

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center space-y-4">
        <Sparkles className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">AI Advisor is analyzing market gaps & compiling recommendations...</p>
      </div>
    );
  }

  if (!suggestions) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AI Career Advisor & Actionable Roadmap</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personalized steps to maximize your match score and land top software roles.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        {[
          { id: 'skills', label: 'Missing Skills', icon: Lightbulb, count: (suggestions.missingSkills || []).length },
          { id: 'certs', label: 'Certifications', icon: Award, count: (suggestions.certificationsToEarn || []).length },
          { id: 'tech', label: 'Tech to Learn', icon: Cpu, count: (suggestions.technologiesToLearn || []).length },
          { id: 'projects', label: 'Portfolio Projects', icon: Code, count: (suggestions.projectsToBuild || []).length },
          { id: 'interview', label: 'Interview Prep', icon: BookOpen, count: (suggestions.interviewPrepTopics || []).length },
          { id: 'resume', label: 'Resume Fixes', icon: FileCheck, count: (suggestions.resumeImprovements || []).length },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              These skills frequently appeared in target job descriptions but were missing from your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {(suggestions.missingSkills || []).map((sk, idx) => (
                <div key={idx} className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(suggestions.certificationsToEarn || []).map((cert, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{cert.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                    {cert.issuer}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{cert.impact}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="space-y-3">
            {(suggestions.technologiesToLearn || []).map((tech, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tech.tech}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{tech.reason}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                  tech.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {tech.priority} Priority
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(suggestions.projectsToBuild || []).map((proj, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Code className="w-4 h-4 text-indigo-500" />
                  <span>{proj.title}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(proj.techStack || []).map((t, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-4">
            {(suggestions.interviewPrepTopics || []).map((topic, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{topic.category}</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(topic.questions || []).map((q, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-3">
            {(suggestions.resumeImprovements || []).map((fix, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{fix.section}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Recommended Fix
                  </span>
                </div>
                <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">Current Weakness: {fix.feedback}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                  💡 Action Item: {fix.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
