import db from '../config/db.js';

export const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
    console.log('Notifications table ready.');
  } catch (error) {
    console.error('Error creating notifications table:', error);
  }
};

export const getNotificationsByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [userId]);
  return rows;
};

export const createNotification = async (userId, type, message) => {
  const [result] = await db.query('INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)', [userId, type, message]);
  return result.insertId;
};

export const markAsRead = async (notificationId, userId) => {
  const [result] = await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [notificationId, userId]);
  return result;
};

export const markAllAsRead = async (userId) => {
  const [result] = await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
  return result;
};
