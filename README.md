# ResuMatch AI 🚀

> **Next-Generation Resume Parser & AI-Powered Job Matcher Platform**

ResuMatch AI is an intelligent full-stack web application built with **JavaScript (React + Express)**, **PostgreSQL**, and **Google Gemini AI**. It parses candidate resumes (PDF/DOCX), extracts over 250+ technical skills, and evaluates job candidate compatibility against live job postings across India using an **explainable weighted matching algorithm**.

---

## 🔥 Key Features

- **📄 Automated Resume Parsing**: Upload PDF or DOCX resumes (or paste plain text) using `pdf-parse` and `mammoth`.
- **🎯 250+ Technical Skill Extraction Engine**: Combines a multi-strategy heuristic dictionary parser with Google Gemini AI to guarantee 100% skill coverage without missing candidate competencies.
- **📊 Explainable Weighted Compatibility Engine**: Calculates transparent match scores based on a weighted 6-factor mathematical model:
  - **Skills Match (40%)**: Jaccard & substring keyword overlap.
  - **Experience Match (20%)**: Candidate experience years vs job requirements.
  - **Education Match (15%)**: Degree hierarchy scoring (PhD > Master's > Bachelor's > Diploma).
  - **Project Relevance (10%)**: Tech stack overlap between portfolio projects and job description.
  - **Role Similarity (10%)**: Token overlap between past job titles and target role.
  - **Certifications (5%)**: Industry certification match.
- **💼 Live Indian Job Openings & Date Sorting**: Integrates with the Adzuna REST API (`sort_by: date`) with relative date badges (*"Today / Latest"*, *"1 day ago"*, *"3 days ago"*).
- **🛡️ Company Hiring Difficulty Analysis**: Categorizes company hiring difficulty into **Easy**, **Moderate**, **Competitive**, and **Highly Competitive** with explicit reasoning.
- **💡 Actionable AI Career Roadmap**: Generates personalized recommendations for missing skills, certifications to earn, technology stack priority, portfolio project ideas, and interview preparation questions.
- **⚡ Dual Storage Resilience**: Uses **PostgreSQL** for persistence, with automatic, seamless fallback to an **In-Memory JavaScript Engine** if database connection is unavailable.
- **🎨 Glassmorphic Modern UI**: Built with React 18, Vite, Tailwind CSS, Recharts radar charts, and dark/light mode toggling.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite (Pure JavaScript / JSX)
- **Styling**: Tailwind CSS + Lucide React Icons
- **Data Visualization**: Recharts (Radar Charts & Bar Graphs)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js (ES Modules)
- **Document Parsers**: `pdf-parse` (PDF) & `mammoth` (DOCX)
- **Database Driver**: `pg` (PostgreSQL client pool)
- **AI SDK**: `@google/generative-ai` (Google Gemini AI API)
- **File Uploads**: `Multer` (Memory Storage)

---

## 📁 Repository Structure

```text
resume_job_parser/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT authentication & guest fallback middleware
│   │   ├── routes/
│   │   │   ├── aiRoutes.js          # AI suggestions endpoints
│   │   │   ├── authRoutes.js        # Registration & login endpoints
│   │   │   ├── jobRoutes.js         # Job matching, sorting, and bookmarking routes
│   │   │   └── resumeRoutes.js      # Resume upload and parsing routes
│   │   ├── services/
│   │   │   ├── adzunaService.js     # Adzuna API integration & mock Indian dataset
│   │   │   ├── aiAdvisorService.js  # Heuristic & Gemini AI resume parsing & career roadmaps
│   │   │   ├── matchingEngine.js    # Weighted scoring & company difficulty algorithms
│   │   │   └── resumeParser.js      # Buffer text extraction from PDF/DOCX
│   │   ├── db.js                    # PostgreSQL pool with In-Memory fallback storage
│   │   └── index.js                 # Express app setup and server listener
│   ├── package.json
│   └── .env                         # Backend environment configuration
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AISuggestionsCard.jsx # Actionable career advice tabs
    │   │   ├── DifficultyBadge.jsx   # Company difficulty badge with hover details
    │   │   ├── FiltersBar.jsx        # Search, location, experience & sort filters
    │   │   ├── JobCard.jsx           # Position card with match badge & posting recency
    │   │   ├── JobDetailModal.jsx    # Full match analysis & radar modal
    │   │   ├── LandingPage.jsx       # Public landing page with upload dropzone
    │   │   ├── MatchScoreChart.jsx   # Compatibility breakdown bar chart
    │   │   ├── Navbar.jsx            # Top navbar header with dark mode toggle
    │   │   ├── ResumeProfileView.jsx # Extracted candidate profile view
    │   │   ├── ResumeUploader.jsx    # File drag-and-drop & paste modal
    │   │   ├── SavedJobsView.jsx     # Bookmarked & viewed jobs list
    │   │   ├── Sidebar.jsx           # Dashboard navigation sidebar
    │   │   └── SkillsRadarChart.jsx  # Recharts radar visualizer
    │   ├── services/
    │   │   └── api.js                # Axios API service methods
    │   ├── App.jsx                   # Main layout component
    │   ├── main.jsx                  # React DOM root entry
    │   └── index.css                 # Tailwind CSS styles & glassmorphic utilities
    ├── index.html                    # Single Page Application HTML entry
    ├── vite.config.js                # Vite build and dev server proxy settings
    └── package.json
```

---

## 🚦 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- *(Optional)* **PostgreSQL Database** (If omitted, the app automatically runs on the built-in In-Memory engine)
- *(Optional)* **Google Gemini API Key** (If omitted, the app runs using rule-based heuristic parsing and suggestions)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/resumatch_db
GEMINI_API_KEY=your_gemini_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm start
```
*The backend server will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal window)
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*The frontend application will open on `http://localhost:5173`.*

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/resume/upload` | Upload PDF/DOCX file and parse candidate profile |
| `POST` | `/api/resume/parse-text` | Parse raw text resume input |
| `GET` | `/api/resume/current` | Retrieve active candidate resume profile |
| `POST` | `/api/jobs/match` | Fetch jobs with match scores and optional `sortBy` (`date` \| `match`) |
| `POST` | `/api/jobs/toggle-save` | Bookmark or un-bookmark a job |
| `GET` | `/api/jobs/saved` | Retrieve list of saved jobs |
| `GET` | `/api/ai/suggestions` | Retrieve AI career roadmap & improvement recommendations |

---

## 🧮 Explainable Match Score Formula

```text
Overall Score = (SkillsMatch * 0.40) + 
                (ExperienceMatch * 0.20) + 
                (EducationMatch * 0.15) + 
                (ProjectRelevance * 0.10) + 
                (RoleSimilarity * 0.10) + 
                (Certifications * 0.05)
```

---

## 📄 License

This project is open-source under the **MIT License**.
