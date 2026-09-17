import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parseResumeText } from './aiAdvisorService.js';

export async function parseResumeBuffer(buffer, mimeType, fileName) {
  let extractedText = '';

  if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } catch (pdfErr) {
      console.warn('pdf-parse failed, falling back to buffer string extraction:', pdfErr.message);
      extractedText = buffer.toString('utf-8');
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    fileName.toLowerCase().endsWith('.docx') ||
    fileName.toLowerCase().endsWith('.doc')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } catch (docxErr) {
      console.warn('mammoth parsing failed, falling back to buffer string extraction:', docxErr.message);
      extractedText = buffer.toString('utf-8');
    }
  } else {
    // Plain text or fallback
    extractedText = buffer.toString('utf-8');
  }

  // Clean unprintable binary characters
  extractedText = extractedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').trim();

  if (!extractedText || extractedText.length < 5) {
    throw new Error('Could not extract readable text from uploaded resume file. Please ensure it is a valid PDF or DOCX file.');
  }

  return await parseResumeText(extractedText);
}
