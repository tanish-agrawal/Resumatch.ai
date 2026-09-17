import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Resume API
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await axios.post(`${API_BASE}/resume/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async parseTextResume(text) {
    const res = await axios.post(`${API_BASE}/resume/parse-text`, { text });
    return res.data;
  },

  async getCurrentResume() {
    const res = await axios.get(`${API_BASE}/resume/current`);
    return res.data;
  },

  // Job Matching API
  async getMatchedJobs(query = '', location = 'India', customResume, sortBy = 'date') {
    const res = await axios.post(`${API_BASE}/jobs/match`, { query, location, customResume, sortBy });
    return res.data;
  },

  async toggleSaveJob(job) {
    const res = await axios.post(`${API_BASE}/jobs/toggle-save`, { job });
    return res.data;
  },

  async getSavedJobs() {
    const res = await axios.get(`${API_BASE}/jobs/saved`);
    return res.data;
  },

  async recordViewedJob(job) {
    await axios.post(`${API_BASE}/jobs/record-view`, { job });
  },

  async getViewedJobs() {
    const res = await axios.get(`${API_BASE}/jobs/viewed`);
    return res.data;
  },

  // AI Suggestions API
  async getAISuggestions() {
    const res = await axios.get(`${API_BASE}/ai/suggestions`);
    return res.data;
  }
};
