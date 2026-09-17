import { Router } from 'express';
import multer from 'multer';
import { parseResumeBuffer } from '../services/resumeParser.js';
import { parseResumeText } from '../services/aiAdvisorService.js';
import { dbStore } from '../db.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded. Please upload PDF or DOCX file.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const parsedData = await parseResumeBuffer(buffer, mimetype, originalname);
    
    const resumeId = 'res_' + Date.now();
    await dbStore.saveResume(resumeId, userId, originalname, parsedData);

    res.json({
      message: 'Resume parsed successfully',
      resumeId,
      fileName: originalname,
      parsedProfile: parsedData
    });
  } catch (err) {
    res.status(500).json({ error: 'Resume parsing failed: ' + err.message });
  }
});

router.post('/parse-text', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Raw text is required.' });
    }

    const parsedData = await parseResumeText(text);
    const resumeId = 'res_' + Date.now();
    await dbStore.saveResume(resumeId, userId, 'pasted_resume.txt', parsedData);

    res.json({
      message: 'Text parsed successfully',
      resumeId,
      parsedProfile: parsedData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/current', async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-123';
    const resume = await dbStore.getLatestResume(userId);

    if (resume) {
      return res.json({ resume: resume.parsedData, fileName: resume.file_name || resume.fileName });
    }

    return res.json({ resume: null, fileName: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
