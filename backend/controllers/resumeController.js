import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { updateUserSkillsAndScore } from '../models/userModel.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;

    // 📄 Extract text
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    fs.unlinkSync(filePath);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // 🤖 AI Prompt
    const prompt = `
Analyze this resume and return ONLY valid JSON:

{
  "skills": [],
  "score": number,
  "missing_skills": [],
  "suggestions": []
}

Resume:
${resumeText}
`;

    // 🤖 AI Call (Gemini)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    });
    
    const resultResponse = await model.generateContent(prompt);
    let raw = resultResponse.response.text();
    
    console.log("AI RAW RESPONSE:", raw);

    // 🧠 Safe parse
    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({
        message: "AI response parsing failed",
        raw
      });
    }

    // ✅ Return clean response
    if (req.user && req.user.id) {
      try {
        await updateUserSkillsAndScore(req.user.id, result.skills, result.score);
      } catch (dbErr) {
        console.error("Failed to save skills and score to database:", dbErr);
      }
    }

    res.status(200).json(result);

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("ERROR:", error);

    res.status(500).json({
      message: "AI processing failed",
      error: error.message
    });
  }
};