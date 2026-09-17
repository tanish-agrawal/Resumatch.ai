import { Router } from 'express';
import { generateAISuggestions } from '../services/aiAdvisorService.js';
import { fetchJobs } from '../services/adzunaService.js';
import { matchResumeToJob } from '../services/matchingEngine.js';
import { dbStore } from '../db.js';

const router = Router();

router.get('/suggestions', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    
    // Retrieve latest resume profile
    let resumeProfile;
    const stored = await dbStore.getLatestResume(userId);
    if (stored) {
      resumeProfile = stored.parsedData;
    } else {
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

    // Get top job matches to find common missing skills
    const jobs = await fetchJobs('developer', 'India');
    const matches = jobs.map(j => matchResumeToJob(resumeProfile, j));
    matches.sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    const suggestions = await generateAISuggestions(resumeProfile, matches.slice(0, 5));

    res.json({
      resumeName: resumeProfile.name,
      suggestions
    });
  } catch (err) {
    res.status(500).json({ error: 'AI Suggestions generation failed: ' + err.message });
  }
});

export default router;
