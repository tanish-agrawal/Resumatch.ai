import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Clipboard } from 'lucide-react';
import { api } from '../services/api.js';

export const ResumeUploader = ({ onProfileUpdated, onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (activeTab === 'upload' && !file) {
      setError('Please select a PDF or DOCX resume file.');
      return;
    }
    if (activeTab === 'paste' && !rawText.trim()) {
      setError('Please paste your resume text before submitting.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let res;
      if (activeTab === 'upload') {
        res = await api.uploadResume(file);
      } else {
        res = await api.parseTextResume(rawText);
      }
      setSuccessMsg(`Resume "${res.fileName}" parsed successfully!`);
      onProfileUpdated(res.parsedProfile, res.fileName);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to parse resume.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl max-w-xl mx-auto shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Upload Your Resume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF or DOCX format. AI extracts skills, experience & projects.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (PDF/DOCX)</span>
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'paste' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>Paste Resume Text</span>
        </button>
      </div>

      {/* File Dropzone */}
      {activeTab === 'upload' ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center space-y-3"
        >
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
            id="resume-file-input"
          />
          <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
              <FileText className="w-7 h-7" />
            </div>
            {file ? (
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 max-w-xs truncate">
                📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            ) : (
              <>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Click to browse or drop your resume here
                </span>
                <span className="text-xs text-slate-400 mt-1">Supports PDF & DOCX up to 10MB</span>
              </>
            )}
          </label>
        </div>
      ) : (
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your raw resume text here..."
          className="glass-input w-full h-40 text-xs font-mono resize-none"
        />
      )}

      {/* Status Notifications */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleUploadSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Analyzing Resume...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume & Match Jobs</span>
          </>
        )}
      </button>
    </div>
  );
};
