import payload from 'payload';
require('dotenv').config();

const initDB = async () => {
  try {
    console.info('Initializing database...');
    
    // Initialize Payload which will sync the database schema
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'test-secret',
      express: require('express')(),
    });

    console.info('Database initialized successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Database initialization error:', error);
    // Exit gracefully - schema might already exist
    setTimeout(() => process.exit(0), 1000);
  }
};

initDB();
