import express from 'express';
import payload from 'payload';
require('dotenv').config();

const app = express();

const start = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || '',
      express: app,
      onInit: async () => {
        console.info(`Payload Admin URL: ${payload.getAdminURL()}`)
      },
    })
    app.listen(3000, '0.0.0.0', () => {
      console.info('Server listening on 0.0.0.0:3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
start();