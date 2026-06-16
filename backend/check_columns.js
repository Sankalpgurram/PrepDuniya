import db from './config/db.js';

const checkAndAddColumns = async () => {
  try {
    const [columns] = await db.query('DESCRIBE users');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('role')) {
      await db.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
      console.log('Added role column');
    }
    if (!columnNames.includes('preferences')) {
      await db.query("ALTER TABLE users ADD COLUMN preferences JSON");
      console.log('Added preferences column');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

checkAndAddColumns();
