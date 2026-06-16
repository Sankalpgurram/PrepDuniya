import db from './config/db.js';

const alterTable = async () => {
  try {
    const query = `
      ALTER TABLE users 
      ADD COLUMN role VARCHAR(20) DEFAULT 'user',
      ADD COLUMN preferences JSON,
      ADD COLUMN latest_skills JSON,
      ADD COLUMN ats_score FLOAT,
      ADD COLUMN last_analysis_date TIMESTAMP
    `;
    await db.query(query);
    console.log("Table altered successfully!");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Columns already exist.");
    } else {
      console.error("Error:", error);
    }
  } finally {
    process.exit(0);
  }
};

alterTable();
