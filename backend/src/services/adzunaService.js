import axios from 'axios';

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';

// Common Indian Tech hubs & roles for rich mock generation
const MOCK_INDIAN_JOBS = [
  {
    id: 'adz-in-101',
    title: 'Senior Full Stack Developer (React & Node.js)',
    company: 'Swiggy',
    location: 'Bengaluru, Karnataka',
    description: 'We are looking for a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Express, and PostgreSQL to scale microservices handling millions of orders daily. Experience with Docker, Redis, and AWS is required. Minimum 4 years of experience.',
    salaryMin: 2200000,
    salaryMax: 3500000,
    salaryText: '₹22,00,000 - ₹35,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-09T10:00:00Z',
    postedDate: '1 day ago',
    redirectUrl: 'https://careers.swiggy.com',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'AWS'],
    requiredExperienceYears: 4,
    requiredEducation: "Bachelor's in Computer Science or equivalent",
    workMode: 'Hybrid'
  },
  {
    id: 'adz-in-102',
    title: 'Frontend Engineer (React / Next.js / Tailwind)',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    description: 'Join Razorpay design systems and checkout team! Seeking Frontend Engineer skilled in React, Redux, Tailwind CSS, JavaScript, HTML5, CSS3, and REST API integration. Experience with Web Performance optimization and UI testing.',
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryText: '₹18,00,000 - ₹28,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-08T14:30:00Z',
    postedDate: '2 days ago',
    redirectUrl: 'https://razorpay.com/jobs',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'JavaScript', 'REST API'],
    requiredExperienceYears: 2,
    requiredEducation: "Bachelor's Degree",
    workMode: 'On-site'
  },
  {
    id: 'adz-in-103',
    title: 'Backend Software Engineer (Node.js & Microservices)',
    company: 'Zomato',
    location: 'Gurugram, Haryana (Delhi NCR)',
    description: 'Building high-throughput delivery routing engines. Requirements: Node.js, Express, MongoDB, PostgreSQL, Kafka, Redis, Docker, Kubernetes, CI/CD. Candidates must demonstrate deep understanding of system design and database indexing.',
    salaryMin: 2000000,
    salaryMax: 3200000,
    salaryText: '₹20,00,000 - ₹32,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-07T09:15:00Z',
    postedDate: '3 days ago',
    redirectUrl: 'https://zomato.com/careers',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'Docker', 'System Design'],
    requiredExperienceYears: 3,
    requiredEducation: "B.Tech / B.E. in CS / IT",
    workMode: 'Hybrid'
  },
  {
    id: 'adz-in-104',
    title: 'AI / Machine Learning Engineer',
    company: 'Flipkart',
    location: 'Bengaluru, Karnataka',
    description: 'Looking for ML Engineers to build LLM pipelines, recommendation models, and NLP models. Stack: Python, PyTorch, TensorFlow, Scikit-learn, OpenAI API, Gemini API, Vector DBs (Chroma/Pinecone), Docker. 3+ years experience.',
    salaryMin: 2500000,
    salaryMax: 4200000,
    salaryText: '₹25,00,000 - ₹42,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-09T18:45:00Z',
    postedDate: 'Just now',
    redirectUrl: 'https://flipkartcareers.com',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Machine Learning', 'Docker', 'SQL'],
    requiredExperienceYears: 3,
    requiredEducation: "Master's or B.Tech in CS / AI / Data Science",
    workMode: 'Hybrid'
  },
  {
    id: 'adz-in-105',
    title: 'Junior React Developer',
    company: 'Cred',
    location: 'Bengaluru, Karnataka',
    description: 'Entry-level frontend role for energetic developers who love pixel-perfect UI. Key skills: JavaScript, React, HTML, CSS, Git, REST APIs. 1 year experience or strong portfolio projects required.',
    salaryMin: 1000000,
    salaryMax: 1600000,
    salaryText: '₹10,00,000 - ₹16,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-06T11:20:00Z',
    postedDate: '4 days ago',
    redirectUrl: 'https://cred.club/careers',
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST API'],
    requiredExperienceYears: 1,
    requiredEducation: "Bachelor's Degree",
    workMode: 'On-site'
  },
  {
    id: 'adz-in-106',
    title: 'DevOps & Cloud Engineer',
    company: 'PhonePe',
    location: 'Pune / Remote',
    description: 'Manage PhonePe Cloud Infrastructure. Stack: AWS, Kubernetes, Terraform, Docker, CI/CD Jenkins/GitHub Actions, Python scripting, Monitoring (Prometheus & Grafana).',
    salaryMin: 2100000,
    salaryMax: 3400000,
    salaryText: '₹21,00,000 - ₹34,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-05T15:00:00Z',
    postedDate: '5 days ago',
    redirectUrl: 'https://phonepe.com/careers',
    requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Linux'],
    requiredExperienceYears: 4,
    requiredEducation: "B.Tech / B.E.",
    workMode: 'Remote'
  },
  {
    id: 'adz-in-107',
    title: 'Full Stack Web Developer (Remote)',
    company: 'TCS Digital Solutions',
    location: 'Mumbai / Remote, Maharashtra',
    description: 'We need versatile developers with React, Node.js, Express, SQL, Git, and REST API experience for enterprise fintech project. Good communication and agile teamwork skills.',
    salaryMin: 1200000,
    salaryMax: 2000000,
    salaryText: '₹12,00,000 - ₹20,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-04T08:30:00Z',
    postedDate: '6 days ago',
    redirectUrl: 'https://tcs.com/careers',
    requiredSkills: ['React', 'Node.js', 'Express', 'SQL', 'Git', 'REST API'],
    requiredExperienceYears: 2,
    requiredEducation: "Bachelor's in Engineering / CS",
    workMode: 'Remote'
  },
  {
    id: 'adz-in-108',
    title: 'Data Engineer (Python & PySpark)',
    company: 'Jio Platforms',
    location: 'Navi Mumbai, Maharashtra',
    description: 'Data Platform team is looking for Data Engineers. Skills: Python, SQL, PySpark, Hadoop, AWS S3/Snowflake, Airflow, ETL pipelines. 3+ years experience.',
    salaryMin: 1700000,
    salaryMax: 2600000,
    salaryText: '₹17,00,000 - ₹26,00,000 P.A.',
    contractType: 'Full-time',
    created: '2026-03-03T12:00:00Z',
    postedDate: '1 week ago',
    redirectUrl: 'https://jio.com/careers',
    requiredSkills: ['Python', 'SQL', 'Spark', 'PySpark', 'AWS', 'ETL', 'Airflow'],
    requiredExperienceYears: 3,
    requiredEducation: "B.Tech / B.Sc in Computer Science",
    workMode: 'On-site'
  }
];

/**
 * Extract required skills from raw job description using common tech keywords
 */
function extractSkillsFromText(text) {
  const commonTech = [
    'React', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'GCP', 'Tailwind CSS', 'Redux', 'GraphQL', 'REST API', 'Git', 'CI/CD', 'Kafka',
    'PyTorch', 'TensorFlow', 'HTML5', 'CSS3', 'Next.js', 'System Design', 'SQL', 'Linux'
  ];

  const found = [];
  const textLower = text.toLowerCase();

  for (const tech of commonTech) {
    if (textLower.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }

  return found.length > 0 ? found : ['JavaScript', 'React', 'Problem Solving'];
}

/**
 * Extract required experience years from job description
 */
function extractExperienceFromText(text) {
  const expMatch = text.match(/(\d+)\+?\s*(?:years|yrs|year|yr)/i);
  if (expMatch && expMatch[1]) {
    return parseInt(expMatch[1], 10);
  }
  return 2;
}

/**
 * Helper to calculate human-readable relative posting date from ISO created string
 */
function formatRelativeDate(isoStr) {
  if (!isoStr) return 'Recently Posted';
  try {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today / Latest';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
    return new Date(isoStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently Posted';
  }
}

/**
 * Fetches Indian Jobs from Adzuna API or fallback mock dataset
 */
export async function fetchJobs(query = 'developer', location = 'India', sortBy = 'date') {
  if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;
      const response = await axios.get(url, {
        params: {
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_APP_KEY,
          results_per_page: 25,
          what: query,
          where: location !== 'India' ? location : undefined,
          sort_by: sortBy === 'date' ? 'date' : 'relevance'
        },
        timeout: 8000
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        return response.data.results.map((item) => {
          const desc = item.description || '';
          const createdIso = item.created || new Date().toISOString();
          return {
            id: String(item.id),
            title: item.title ? item.title.replace(/<\/?[^>]+(>|$)/g, "") : 'Software Developer',
            company: item.company ? item.company.display_name : 'Tech Organization',
            location: item.location ? item.location.display_name : 'India',
            description: desc.replace(/<\/?[^>]+(>|$)/g, ""),
            salaryMin: item.salary_min,
            salaryMax: item.salary_max,
            salaryText: item.salary_min ? `₹${item.salary_min.toLocaleString('en-IN')} - ₹${(item.salary_max || item.salary_min * 1.5).toLocaleString('en-IN')}` : 'Salary Disclosed on Application',
            contractType: item.contract_time === 'full_time' ? 'Full-time' : 'Contract',
            category: item.category ? item.category.label : 'IT Jobs',
            created: createdIso,
            postedDate: formatRelativeDate(createdIso),
            redirectUrl: item.redirect_url,
            requiredSkills: extractSkillsFromText(desc + ' ' + item.title),
            requiredExperienceYears: extractExperienceFromText(desc),
            requiredEducation: "Bachelor's degree in CS/Engineering or related",
            workMode: desc.toLowerCase().includes('remote') ? 'Remote' : (desc.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site')
          };
        });
      }
    } catch (error) {
      console.warn('Adzuna API call failed or unconfigured, falling back to rich Indian Jobs Dataset.', error.message);
    }
  }

  // Fallback to local Indian Tech jobs filtered by query
  const qLower = query.toLowerCase();
  const filtered = MOCK_INDIAN_JOBS.filter(j => 
    j.title.toLowerCase().includes(qLower) ||
    j.description.toLowerCase().includes(qLower) ||
    j.company.toLowerCase().includes(qLower) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(qLower))
  );

  const results = filtered.length > 0 ? [...filtered] : [...MOCK_INDIAN_JOBS];

  // Sort mock data if requested by date
  if (sortBy === 'date') {
    results.sort((a, b) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime());
  }

  return results;
}
