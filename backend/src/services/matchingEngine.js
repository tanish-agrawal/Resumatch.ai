/**
 * Normalizes text to lowercase tokens for token-level comparison
 */
function normalizeTokens(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Calculates Jaccard & substring similarity between skill lists
 */
function calculateSkillsMatch(candidateSkills, requiredSkills, jobDescription) {
  if (!requiredSkills || requiredSkills.length === 0) {
    // If no explicit required skills, extract from job description
    const descTokens = new Set(normalizeTokens(jobDescription));
    const matched = candidateSkills.filter(skill => {
      const sLower = skill.toLowerCase();
      return descTokens.has(sLower) || jobDescription.toLowerCase().includes(sLower);
    });
    const score = candidateSkills.length > 0 ? Math.min(100, Math.round((matched.length / Math.max(5, candidateSkills.length)) * 100)) : 50;
    return { score, matched, missing: [] };
  }

  const normalizedCand = candidateSkills.map(s => s.toLowerCase().trim());
  const matched = [];
  const missing = [];

  for (const reqSkill of requiredSkills) {
    const reqLower = reqSkill.toLowerCase().trim();
    const isMatched = normalizedCand.some(candSkill => 
      candSkill === reqLower || 
      candSkill.includes(reqLower) || 
      reqLower.includes(candSkill)
    );

    if (isMatched) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  }

  const ratio = matched.length / requiredSkills.length;
  const score = Math.round(ratio * 100);

  return { score, matched, missing };
}

/**
 * Calculates experience match score based on candidate years vs job required years
 */
function calculateExperienceMatch(candidateExpYears, requiredExpYears) {
  if (requiredExpYears === 0) return 100;
  if (candidateExpYears >= requiredExpYears) return 100;
  if (candidateExpYears === 0) return 20;

  const ratio = candidateExpYears / requiredExpYears;
  return Math.max(30, Math.round(ratio * 100));
}

/**
 * Calculates education match score based on degree level compatibility
 */
function calculateEducationMatch(candidateEdu, requiredEduStr) {
  if (!requiredEduStr || requiredEduStr.toLowerCase().includes('any') || requiredEduStr.toLowerCase().includes('not specified')) {
    return 100;
  }

  const reqLower = requiredEduStr.toLowerCase();
  const candDegreeText = (candidateEdu || []).map(e => `${e.degree || ''} ${e.field || ''}`).join(' ').toLowerCase();

  // Degree hierarchy scoring
  if (reqLower.includes('phd') || reqLower.includes('doctorate')) {
    if (candDegreeText.includes('phd') || candDegreeText.includes('doctor')) return 100;
    if (candDegreeText.includes('master') || candDegreeText.includes('m.tech') || candDegreeText.includes('ms')) return 80;
    return 60;
  }

  if (reqLower.includes('master') || reqLower.includes('m.tech') || reqLower.includes('mba') || reqLower.includes('ms')) {
    if (candDegreeText.includes('master') || candDegreeText.includes('m.tech') || candDegreeText.includes('mba') || candDegreeText.includes('ms')) return 100;
    if (candDegreeText.includes('bachelor') || candDegreeText.includes('b.tech') || candDegreeText.includes('be') || candDegreeText.includes('bs')) return 75;
    return 50;
  }

  if (reqLower.includes('bachelor') || reqLower.includes('b.tech') || reqLower.includes('be') || reqLower.includes('bs') || reqLower.includes('degree')) {
    if (candDegreeText.includes('bachelor') || candDegreeText.includes('b.tech') || candDegreeText.includes('be') || candDegreeText.includes('bs') || candDegreeText.includes('master') || candDegreeText.includes('m.tech')) return 100;
    if (candDegreeText.includes('diploma')) return 70;
    return 60;
  }

  return 85;
}

/**
 * Calculates project relevance based on project tech stack and keywords vs job desc
 */
function calculateProjectRelevance(projects, jobDesc) {
  if (!projects || projects.length === 0) return 40;

  const jobTokens = new Set(normalizeTokens(jobDesc));
  let totalScore = 0;

  for (const proj of projects) {
    let projText = `${proj.title || ''} ${proj.description || ''} ${(proj.technologies || []).join(' ')}`;
    const projTokens = normalizeTokens(projText);
    
    let matchCount = 0;
    for (const t of projTokens) {
      if (jobTokens.has(t)) matchCount++;
    }

    const projScore = Math.min(100, Math.round((matchCount / Math.max(5, projTokens.length)) * 200));
    totalScore += projScore;
  }

  return Math.min(100, Math.max(30, Math.round(totalScore / projects.length)));
}

/**
 * Calculates role similarity between candidate experience/summary titles and target job title
 */
function calculateRoleSimilarity(candidate, jobTitle) {
  const targetTokens = normalizeTokens(jobTitle);
  if (targetTokens.length === 0) return 70;

  const candidateTitles = (candidate.experience || []).map(e => e.title).join(' ') + ' ' + (candidate.summary || '');
  const candidateTokens = new Set(normalizeTokens(candidateTitles));

  let matched = 0;
  for (const token of targetTokens) {
    if (candidateTokens.has(token)) matched++;
  }

  const score = Math.round((matched / targetTokens.length) * 100);
  return Math.min(100, Math.max(30, score));
}

/**
 * Calculates certification match score
 */
function calculateCertificationsMatch(certifications, jobDesc) {
  if (!certifications || certifications.length === 0) return 50;

  const descLower = jobDesc.toLowerCase();
  const matched = certifications.filter(c => descLower.includes(c.toLowerCase()));

  if (matched.length >= 2) return 100;
  if (matched.length === 1) return 85;
  return 60;
}

/**
 * Determines company difficulty category and provides explainable reasons
 */
function evaluateCompanyDifficulty(
  overallScore,
  skillsMatch,
  candidateExp,
  requiredExp,
  missingSkills,
  educationMatch,
  companyName
) {
  const reasons = [];

  // Experience Gap Reason
  if (candidateExp < requiredExp) {
    reasons.push(`Experience Gap: Candidate has ${candidateExp} yrs exp vs ${requiredExp}+ yrs required by ${companyName}.`);
  }

  // Skill Gap Reason
  if (missingSkills.length > 0) {
    const missingTop = missingSkills.slice(0, 4).join(', ');
    reasons.push(`Skill Gap: Missing ${missingSkills.length} key required skill(s): [${missingTop}].`);
  }

  // Education Mismatch
  if (educationMatch < 80) {
    reasons.push(`Education Mismatch: Candidate background does not fully match preferred degree qualifications.`);
  }

  // Determine Category
  let difficulty = 'Moderate';

  if (overallScore >= 82 && missingSkills.length <= 1 && candidateExp >= requiredExp) {
    difficulty = 'Easy';
    if (reasons.length === 0) {
      reasons.push(`Strong Profile Alignment: High skill coverage (${skillsMatch}%) and experience requirements met.`);
    }
  } else if (overallScore >= 68 && missingSkills.length <= 3) {
    difficulty = 'Moderate';
  } else if (overallScore >= 50 || missingSkills.length <= 5) {
    difficulty = 'Competitive';
    reasons.push(`Competition Level: High volume of applicants expected with strict skill prerequisites.`);
  } else {
    difficulty = 'Highly Competitive';
    reasons.push(`High Entry Barrier: Significant gaps in core skills (${missingSkills.length} missing) and experience expectations.`);
  }

  return { difficulty, reasons };
}

/**
 * Main matching function that computes explainable weighted scores for a job
 */
export function matchResumeToJob(resume, job) {
  const { score: skillsMatch, matched: matchedSkills, missing: missingSkills } = 
    calculateSkillsMatch(resume.skills || [], job.requiredSkills || [], job.description || '');

  const experienceMatch = calculateExperienceMatch(resume.totalExperienceYears || 0, job.requiredExperienceYears || 0);
  const educationMatch = calculateEducationMatch(resume.education || [], job.requiredEducation || '');
  const projectRelevance = calculateProjectRelevance(resume.projects || [], job.description || '');
  const roleSimilarity = calculateRoleSimilarity(resume, job.title || '');
  const certifications = calculateCertificationsMatch(resume.certifications || [], job.description || '');

  const breakdown = {
    skillsMatch,
    experienceMatch,
    educationMatch,
    projectRelevance,
    roleSimilarity,
    certifications
  };

  // Weighted scoring formula:
  // Skills 40%, Experience 20%, Education 15%, Project 10%, Role 10%, Certifications 5%
  const overallMatchScore = Math.round(
    (skillsMatch * 0.40) +
    (experienceMatch * 0.20) +
    (educationMatch * 0.15) +
    (projectRelevance * 0.10) +
    (roleSimilarity * 0.10) +
    (certifications * 0.05)
  );

  const { difficulty, reasons: difficultyReasons } = evaluateCompanyDifficulty(
    overallMatchScore,
    skillsMatch,
    resume.totalExperienceYears || 0,
    job.requiredExperienceYears || 0,
    missingSkills,
    educationMatch,
    job.company || 'Company'
  );

  return {
    job,
    overallMatchScore,
    breakdown,
    missingSkills,
    matchedSkills,
    difficulty,
    difficultyReasons
  };
}
