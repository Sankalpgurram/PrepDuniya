import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { saveInterviewResult } from '../models/interviewModel.js';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cleanJSON = (text) => {
  try {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON');
  }
};

export const startInterview = async (req, res) => {
  try {
    const { company, role, type } = req.body;
    
    if (!company || !role || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let prompt = '';
    if (type === 'technical') {
      prompt = `
      You are a senior technical interviewer at ${company} hiring for a ${role} position.
      Generate 5 real, company-specific technical interview questions. Focus on Data Structures, Algorithms, System Design, or Web Development depending on the role.
      
      Return ONLY a strict JSON object in this format:
      {
        "questions": [
          "question 1 goes here",
          "question 2 goes here"
        ]
      }
      `;
    } else {
      prompt = `
      You are a senior HR manager at ${company} hiring for a ${role} position.
      Generate 1 behavioral/HR interview question to start the interview.
      
      Return ONLY a strict JSON object in this format:
      {
        "questions": [
          "your behavioral question here"
        ]
      }
      `;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const parsedData = cleanJSON(result.response.text());

    res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Interview Start Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate interview questions' });
  }
};

export const nextInterviewStep = async (req, res) => {
  try {
    const { previous_question, user_answer, company, role } = req.body;
    
    if (!previous_question || !user_answer || !company || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const prompt = `
      You are a senior HR manager at ${company} interviewing a candidate for ${role}.
      The previous question you asked was: "${previous_question}"
      The candidate answered: "${user_answer}"
      
      Task 1: Evaluate their answer briefly.
      Task 2: Generate the next appropriate behavioral/HR interview question following up on their response or transitioning logically.
      
      Return ONLY a strict JSON object:
      {
        "feedback": "Short evaluation of what they said",
        "next_question": "Your next question"
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const parsedData = cleanJSON(result.response.text());

    res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Interview Next Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate next steps' });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const { questions, answers, company, role, type } = req.body;
    
    if (!questions || !answers || !company || !role) {
      return res.status(400).json({ success: false, message: 'Missing required payload data' });
    }

    const compiledAnswers = questions.map((q, i) => {
      return `Q${i+1}: ${q}\nCandidate A${i+1}: ${answers[i] || 'No Answer'}\n`;
    }).join('\n');

    const prompt = `
      You are a strict, senior evaluator at ${company} reviewing candidates for ${role}.
      Review the following interview Q&A transcript.
      
      Transcript:
      ${compiledAnswers}
      
      Evaluate their performance strictly. Return ONLY a JSON object:
      {
        "score": number, // out of 100
        "strengths": ["array", "of", "strings"],
        "weaknesses": ["array", "of", "strings"],
        "improvement": "A short summary paragraph of what to improve"
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const evaluation = await model.generateContent(prompt);
    const parsedEvaluation = cleanJSON(evaluation.response.text());

    // Save to database
    if (req.user && req.user.id) {
       await saveInterviewResult({
         user_id: req.user.id,
         company,
         role,
         interview_type: type || 'technical',
         questions_json: questions,
         answers_json: answers,
         score: parsedEvaluation.score || 0,
         feedback_json: parsedEvaluation
       });
    }

    res.status(200).json({ success: true, data: parsedEvaluation });
  } catch (error) {
    console.error('Interview Submit Error:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate interview answers' });
  }
};
