import db from '../config/db.js';

export const createQuestionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS predefined_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      category VARCHAR(100),
      company VARCHAR(255),
      role VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(query);
    console.log('Predefined Questions table ready.');
  } catch (error) {
    console.error('Error creating predefined_questions table:', error);
  }
};

export const getAllQuestions = async () => {
  const [rows] = await db.query('SELECT * FROM predefined_questions ORDER BY created_at DESC');
  return rows;
};

export const addQuestion = async (data) => {
  const { question, type, category, company, role } = data;
  const [result] = await db.query(
    'INSERT INTO predefined_questions (question, type, category, company, role) VALUES (?, ?, ?, ?, ?)',
    [question, type, category, company, role]
  );
  return result.insertId;
};

export const updateQuestion = async (id, data) => {
  const { question, type, category, company, role } = data;
  const [result] = await db.query(
    'UPDATE predefined_questions SET question = ?, type = ?, category = ?, company = ?, role = ? WHERE id = ?',
    [question, type, category, company, role, id]
  );
  return result;
};

export const deleteQuestion = async (id) => {
  const [result] = await db.query('DELETE FROM predefined_questions WHERE id = ?', [id]);
  return result;
};
