import db from '../config/db.js';

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      profile_picture VARCHAR(1024),
      role VARCHAR(20) DEFAULT 'user',
      preferences JSON,
      is_google_user BOOLEAN DEFAULT FALSE,
      provider VARCHAR(50) DEFAULT 'local',
      latest_skills JSON,
      ats_score FLOAT,
      last_analysis_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX email_idx (email)
    );
  `;
  try {
    await db.query(query);
    console.log('Users table ready.');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { name, email, password, profile_picture, is_google_user, provider } = userData;
  const query = `
    INSERT INTO users (name, email, password, profile_picture, is_google_user, provider)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    name,
    email,
    password || null,
    profile_picture || null,
    is_google_user || false,
    provider || 'local'
  ]);
  return result.insertId;
};

export const findUserById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, profile_picture, role, preferences, is_google_user, created_at, latest_skills, ats_score, last_analysis_date FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const updateProfile = async (id, { name, profile_picture, preferences }) => {
  const query = `
    UPDATE users 
    SET name = ?, profile_picture = ?, preferences = ?
    WHERE id = ?
  `;
  const [result] = await db.query(query, [name, profile_picture, JSON.stringify(preferences), id]);
  return result;
};

export const updatePassword = async (id, hashedPassword) => {
  const query = `UPDATE users SET password = ? WHERE id = ?`;
  const [result] = await db.query(query, [hashedPassword, id]);
  return result;
};

export const updateUserSkillsAndScore = async (id, skills, score) => {
  const query = `
    UPDATE users 
    SET latest_skills = ?, ats_score = ?, last_analysis_date = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const [result] = await db.query(query, [JSON.stringify(skills), score, id]);
  return result;
};
