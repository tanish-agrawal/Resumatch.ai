import React from 'react';
import { ResumeUploader } from './ResumeUploader.jsx';
import { Sparkles, ShieldCheck, BrainCircuit, Target, Code2 } from 'lucide-react';

export const LandingPage = ({ onProfileUploaded }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Landing Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            ResuMatch AI
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>India Jobs Search Ready</span>
        </div>
      </nav>

      {/* Hero Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 flex-1 flex flex-col justify-center">
        
        {/* Hero Text */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen Candidate Job Matching</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Match Your Resume to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Top Indian Tech Openings
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume (PDF or DOCX). Our explainable AI evaluates your technical skills, experience, and projects against live software engineering positions across India.
          </p>
        </div>

        {/* Primary Action: Resume Uploader Dropzone */}
        <div className="w-full max-w-2xl mx-auto mb-16">
          <ResumeUploader onProfileUpdated={onProfileUploaded} />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          
          <div className="glass-card p-6 rounded-3xl space-y-3 border border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Weighted Match Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates transparent compatibility: 40% Skills, 20% Experience, 15% Education, 10% Projects, 10% Role, 5% Certs.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3 border border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Company Difficulty Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Categorizes position difficulty into Easy, Moderate, Competitive, and Highly Competitive with explicit rationale.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3 border border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Actionable Career Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies missing skills, certifications to earn, tech stack priorities, portfolio projects, and interview questions.
            </p>
          </div>

        </div>

      </main>

      {/* Landing Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 z-10">
        <p>© 2026 ResuMatch AI • Built and Developed by Tanish Agrawal</p>
      </footer>

    </div>
  );
};
