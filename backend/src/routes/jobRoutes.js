import { Router } from 'express';
import { fetchJobs } from '../services/adzunaService.js';
import { matchResumeToJob } from '../services/matchingEngine.js';
import { dbStore } from '../db.js';

const router = Router();

router.post('/match', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const { query = 'developer', location = 'India', sortBy = 'date', customResume } = req.body;

    // Retrieve resume
    let resumeProfile;
    if (customResume) {
      resumeProfile = customResume;
    } else {
      const stored = await dbStore.getLatestResume(userId);
      if (stored) {
        resumeProfile = stored.parsedData;
      } else {
        // Fallback default profile
        resumeProfile = {
          name: "Candidate",
          skills: ["React", "Node.js", "TypeScript", "JavaScript", "PostgreSQL", "Tailwind CSS", "Git"],
          totalExperienceYears: 2,
          education: [{ degree: "B.Tech in Computer Science" }],
          experience: [{ title: "Software Engineer", company: "Tech Company", years: 2 }],
          projects: [{ title: "Web App", description: "Built React Node.js app", technologies: ["React", "Node.js"] }],
          certifications: [],
          technologies: ["React", "Node.js", "TypeScript"]
        };
      }
    }

    // Fetch jobs from Adzuna / dataset
    const jobs = await fetchJobs(query, location, sortBy);

    // Compute explainable match score for each job
    const matchResults = jobs.map(job => matchResumeToJob(resumeProfile, job));

    // Sort descending by date or match score
    if (sortBy === 'date') {
      matchResults.sort((a, b) => new Date(b.job.created || 0).getTime() - new Date(a.job.created || 0).getTime());
    } else {
      matchResults.sort((a, b) => b.overallMatchScore - a.overallMatchScore);
    }

    // Mark saved status
    const savedJobs = await dbStore.getSavedJobs(userId);
    const savedIds = new Set(savedJobs.map((j) => j.id));

    const finalResults = matchResults.map(m => ({
      ...m,
      isSaved: savedIds.has(m.job.id)
    }));

    res.json({
      totalCount: finalResults.length,
      resumeUsed: {
        name: resumeProfile.name,
        skillsCount: resumeProfile.skills.length,
        experienceYears: resumeProfile.totalExperienceYears
      },
      matches: finalResults
    });
  } catch (err) {
    res.status(500).json({ error: 'Matching failed: ' + err.message });
  }
});

router.post('/toggle-save', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const { job } = req.body;

    if (!job || !job.id) {
      return res.status(400).json({ error: 'Job object with ID is required.' });
    }

    const isSaved = await dbStore.toggleSaveJob(userId, job);
    res.json({ isSaved, jobId: job.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/saved', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const saved = await dbStore.getSavedJobs(userId);
    res.json({ savedJobs: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/record-view', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const { job } = req.body;
    if (job && job.id) {
      await dbStore.addViewedJob(userId, job);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/viewed', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const viewed = await dbStore.getViewedJobs(userId);
    res.json({ viewedJobs: viewed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
