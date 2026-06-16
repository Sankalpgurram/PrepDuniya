import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createUserTable } from './models/userModel.js';
import { createInterviewTable } from './models/interviewModel.js';
import { createCodingTables } from './models/codingModel.js';
import { createNotificationTable } from './models/notificationModel.js';
import { createQuestionsTable } from './models/adminModel.js';

dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
})); 
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB Tables
await createUserTable();
await createInterviewTable();
await createCodingTables();
await createNotificationTable();
await createQuestionsTable();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', data: null });
});

// Centralized Error Handling Middlewares
// Catch 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, data: null });
});
// Global errorHandler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
