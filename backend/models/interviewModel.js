import db from '../config/db.js';

export const createInterviewTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS interview_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      company VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      interview_type VARCHAR(50) NOT NULL,
      questions_json JSON,
      answers_json JSON,
      score FLOAT,
      feedback_json JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX user_idx (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
    console.log('Interview Results table ready.');
  } catch (error) {
    console.error('Error creating interview_results table:', error);
  }
};

export const saveInterviewResult = async (data) => {
  const { user_id, company, role, interview_type, questions_json, answers_json, score, feedback_json } = data;
  const query = `
    INSERT INTO interview_results 
    (user_id, company, role, interview_type, questions_json, answers_json, score, feedback_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    user_id,
    company,
    role,
    interview_type,
    JSON.stringify(questions_json),
    JSON.stringify(answers_json),
    score,
    JSON.stringify(feedback_json)
  ]);
  return result.insertId;
};

export const getInterviewsByUser = async (user_id) => {
  const [rows] = await db.query('SELECT * FROM interview_results WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
  return rows;
};
