import bcrypt from 'bcrypt';
import db from './config/db.js';

const createAdmin = async () => {
  try {
    const name = 'Admin';
    const email = 'admin@prepduniya.com';
    const password = 'admin';
    const role = 'admin';

    // Check if admin already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists.');
      // Optionally update role to admin if it's not
      if (existing[0].role !== 'admin') {
        await db.query('UPDATE users SET role = "admin" WHERE email = ?', [email]);
        console.log('Updated existing user to admin role.');
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (name, email, password, role, is_google_user, provider)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(query, [name, email, hashedPassword, role, false, 'local']);
      console.log('Admin user created successfully!');
      console.log('Email: admin@prepduniya.com');
      console.log('Password: admin');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit(0);
  }
};

createAdmin();
