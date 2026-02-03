import express from 'express';
import { getPayload } from 'payload';
import config from './payload.config.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

const start = async () => {
  try {
    await getPayload({ config });

    app.listen(PORT, '0.0.0.0', () => {
      console.info(`Server listening on 0.0.0.0:${PORT}`);
      console.info(`Payload Admin URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();