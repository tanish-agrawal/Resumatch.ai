import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { LandingPage } from './components/LandingPage.jsx';
import { ResumeUploader } from './components/ResumeUploader.jsx';
import { ResumeProfileView } from './components/ResumeProfileView.jsx';
import { JobCard } from './components/JobCard.jsx';
import { JobDetailModal } from './components/JobDetailModal.jsx';
import { AISuggestionsCard } from './components/AISuggestionsCard.jsx';
import { FiltersBar } from './components/FiltersBar.jsx';
import { SavedJobsView } from './components/SavedJobsView.jsx';
import { SkillsRadarChart } from './components/SkillsRadarChart.jsx';
import { MatchScoreChart } from './components/MatchScoreChart.jsx';
import { api } from './services/api.js';
import { Sparkles, Award, TrendingUp, AlertTriangle, RefreshCw, X, ArrowLeft } from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resumeProfile, setResumeProfile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [matches, setMatches] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [viewedJobs, setViewedJobs] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [selectedJobMatch, setSelectedJobMatch] = useState(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    searchQuery: '',
    location: 'All',
    workMode: 'All',
    minSalary: 0,
    minExp: 0,
    role: 'All',
    selectedSkills: [],
    sortBy: 'date'
  });

  // Sync Dark/Light mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Data Fetch
  useEffect(() => {
    loadInitialData();
  }, []);

  // Re-fetch jobs whenever sortBy filter changes
  useEffect(() => {
    if (resumeProfile) {
      loadJobs(resumeProfile, filters.sortBy);
    }
  }, [filters.sortBy]);

  const loadJobs = async (profile, sortBy = 'date') => {
    try {
      setLoadingJobs(true);
      const matchRes = await api.getMatchedJobs('developer', 'India', profile, sortBy);
      setMatches(matchRes.matches);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoadingInitial(true);
      // Fetch Resume Profile
      const resumeRes = await api.getCurrentResume();
      if (resumeRes && resumeRes.resume) {
        setResumeProfile(resumeRes.resume);
        setFileName(resumeRes.fileName || 'Uploaded_Resume.pdf');
        
        // Fetch Jobs & Match Scores (sorted by date by default)
        await loadJobs(resumeRes.resume, filters.sortBy);
        loadAiSuggestions();
      } else {
        setResumeProfile(null);
      }

      // Fetch Saved & Viewed Jobs
      const savedRes = await api.getSavedJobs();
      setSavedJobs(savedRes.savedJobs || []);

      const viewedRes = await api.getViewedJobs();
      setViewedJobs(viewedRes.viewedJobs || []);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadAiSuggestions = async () => {
    try {
      setLoadingAi(true);
      const res = await api.getAISuggestions();
      setAiSuggestions(res.suggestions);
    } catch (err) {
      console.error('AI suggestions fetch error:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleProfileUpdated = async (newProfile, file) => {
    setResumeProfile(newProfile);
    setFileName(file);
    setShowUploadModal(false);

    // Re-run job matching for the newly uploaded profile
    await loadJobs(newProfile, filters.sortBy);
    loadAiSuggestions();
  };

  const handleToggleSaveJob = async (job) => {
    try {
      const res = await api.toggleSaveJob(job);
      if (res.isSaved) {
        setSavedJobs(prev => [job, ...prev]);
      } else {
        setSavedJobs(prev => prev.filter(j => j.id !== job.id));
      }
      setMatches(prev => prev.map(m => m.job.id === job.id ? { ...m, isSaved: res.isSaved } : m));
    } catch (err) {
      console.error('Toggle save job failed:', err);
    }
  };

  const handleSelectJob = (jobMatch) => {
    setSelectedJobMatch(jobMatch);
    api.recordViewedJob(jobMatch.job);
    setViewedJobs(prev => [jobMatch.job, ...prev.filter(j => j.id !== jobMatch.job.id)]);
  };

  // Locations for filter dropdown
  const availableLocations = useMemo(() => {
    const locs = new Set();
    matches.forEach(m => locs.add(m.job.location));
    return Array.from(locs);
  }, [matches]);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const { job } = m;
      const q = filters.searchQuery.toLowerCase();

      if (q && !(
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        (job.requiredSkills || []).some(s => s.toLowerCase().includes(q))
      )) {
        return false;
      }

      if (filters.location !== 'All' && job.location !== filters.location) {
        return false;
      }

      if (filters.workMode !== 'All' && job.workMode !== filters.workMode) {
        return false;
      }

      if (filters.minExp > 0 && job.requiredExperienceYears < filters.minExp) {
        return false;
      }

      return true;
    });
  }, [matches, filters]);

  const topMatch = matches[0] || null;
  const matchResultsMap = useMemo(() => {
    const map = new Map();
    matches.forEach(m => map.set(m.job.id, m));
    return map;
  }, [matches]);

  // Show Loading Spinner during initial fetch
  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-bold text-slate-300">Initializing ResuMatch AI Engine...</p>
      </div>
    );
  }

  // Show Landing Page if no candidate resume is uploaded yet
  if (!resumeProfile) {
    return <LandingPage onProfileUploaded={handleProfileUpdated} />;
  }

  // Show Main Dashboard
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Navbar Header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        candidateName={resumeProfile.name}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Return to Landing Page Quick Action */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setResumeProfile(null)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Upload Landing Page</span>
          </button>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Candidate: {resumeProfile.name}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedCount={savedJobs.length}
          />

          {/* Right Main Content Panel */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Hero Banner */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border-indigo-500/20">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Powered Compatibility Analysis</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Candidate Profile: {resumeProfile.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                        Your uploaded resume has been parsed. Below is your skill breakdown, job compatibility scores, and personalized career suggestions.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 shrink-0"
                    >
                      Upload New Resume
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-700/50">
                    <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md">
                      <span className="text-[10px] font-semibold text-slate-400 block">Total Matched Jobs</span>
                      <span className="text-xl font-extrabold text-white">{matches.length}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md">
                      <span className="text-[10px] font-semibold text-slate-400 block">Top Match Score</span>
                      <span className="text-xl font-extrabold text-emerald-400">
                        {topMatch ? `${topMatch.overallMatchScore}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md">
                      <span className="text-[10px] font-semibold text-slate-400 block">Extracted Skills</span>
                      <span className="text-xl font-extrabold text-indigo-400">
                        {(resumeProfile.skills || []).length}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md">
                      <span className="text-[10px] font-semibold text-slate-400 block">Bookmarked Jobs</span>
                      <span className="text-xl font-extrabold text-purple-400">{savedJobs.length}</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Split Charts */}
                {topMatch && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Radar Map */}
                    <div className="glass-card p-5 rounded-3xl">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        <span>Top Match Radar: {topMatch.job.company}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">Comparing candidate skills vs job prerequisites</p>
                      <SkillsRadarChart breakdown={topMatch.breakdown} />
                    </div>

                    {/* Score Breakdown Bar Chart */}
                    <div className="glass-card p-5 rounded-3xl">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span>Weighted Compatibility Algorithm</span>
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">Explainable breakdown weights (40% Skills, 20% Exp, 15% Edu)</p>
                      <MatchScoreChart overallScore={topMatch.overallMatchScore} breakdown={topMatch.breakdown} />
                    </div>
                  </div>
                )}

                {/* Top 6 Recommended Jobs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Latest & Top Recommended Positions for {resumeProfile.name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ranked by latest date and explainable candidate-to-job compatibility</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All ({matches.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {matches.slice(0, 6).map((matchResult) => (
                      <JobCard
                        key={matchResult.job.id}
                        matchResult={matchResult}
                        onSelectJob={handleSelectJob}
                        onToggleSave={handleToggleSaveJob}
                        isSaved={savedJobs.some(j => j.id === matchResult.job.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Career Suggestions */}
                <AISuggestionsCard suggestions={aiSuggestions} loading={loadingAi} />

              </div>
            )}

            {/* Recommended Jobs List View */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Latest Job Openings (India)</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Showing {filteredMatches.length} position(s) matched against {resumeProfile.name}'s profile.
                    </p>
                  </div>
                  <button
                    onClick={() => loadJobs(resumeProfile, filters.sortBy)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors flex items-center space-x-1"
                    title="Refresh Jobs"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingJobs ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Filters */}
                <FiltersBar
                  filters={filters}
                  setFilters={setFilters}
                  availableLocations={availableLocations}
                  availableSkills={resumeProfile.skills || []}
                  onReset={() => setFilters({
                    searchQuery: '',
                    location: 'All',
                    workMode: 'All',
                    minSalary: 0,
                    minExp: 0,
                    role: 'All',
                    selectedSkills: [],
                    sortBy: 'date'
                  })}
                />

                {/* Job Matches Grid */}
                {filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredMatches.map((matchResult) => (
                      <JobCard
                        key={matchResult.job.id}
                        matchResult={matchResult}
                        onSelectJob={handleSelectJob}
                        onToggleSave={handleToggleSaveJob}
                        isSaved={savedJobs.some(j => j.id === matchResult.job.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-12 rounded-3xl text-center space-y-3">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Jobs Match Current Filters</h3>
                    <p className="text-xs text-slate-400">Try broadening your search query or selecting "All Cities".</p>
                  </div>
                )}
              </div>
            )}

            {/* Resume Profile View */}
            {activeTab === 'profile' && (
              <ResumeProfileView
                profile={resumeProfile}
                fileName={fileName}
                onUploadNew={() => setShowUploadModal(true)}
              />
            )}

            {/* AI Advice View */}
            {activeTab === 'ai-suggestions' && (
              <AISuggestionsCard suggestions={aiSuggestions} loading={loadingAi} />
            )}

            {/* Saved Jobs View */}
            {activeTab === 'saved-jobs' && (
              <SavedJobsView
                savedJobs={savedJobs}
                viewedJobs={viewedJobs}
                matchResultsMap={matchResultsMap}
                onSelectJob={handleSelectJob}
                onToggleSave={handleToggleSaveJob}
                mode="saved"
              />
            )}

            {/* Viewed History View */}
            {activeTab === 'history' && (
              <SavedJobsView
                savedJobs={savedJobs}
                viewedJobs={viewedJobs}
                matchResultsMap={matchResultsMap}
                onSelectJob={handleSelectJob}
                onToggleSave={handleToggleSaveJob}
                mode="history"
              />
            )}

          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <ResumeUploader
              onProfileUpdated={handleProfileUpdated}
              onClose={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

      {/* Job Detail Analysis Modal */}
      {selectedJobMatch && (
        <JobDetailModal
          matchResult={selectedJobMatch}
          onClose={() => setSelectedJobMatch(null)}
        />
      )}

    </div>
  );
}

export default App;
