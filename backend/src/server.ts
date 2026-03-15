import express from 'express';
import { getPayload } from 'payload';
import config from './payload.config.js';
import dotenv from 'dotenv';
import { logger } from './lib/logger.js';

dotenv.config();

const app = express();
const PORT = 3000;

function validateEnv() {
  const required = [
    'PAYLOAD_SECRET',
    'DATABASE_URI',
    'SMTP_HOST',
    'CONTACT_EMAIL',
    'ALTCHA_SECRET',
  ]
  // At least one of these must be set for outgoing mail auth
  const smtpAuth = ['SMTP_FROM', 'SMTP_USER']

  const missing = required.filter((k) => !process.env[k])
  if (!smtpAuth.some((k) => process.env[k])) {
    missing.push('SMTP_FROM or SMTP_USER')
  }

  if (missing.length > 0) {
    logger.error('Missing required environment variables', undefined, { missing })
    process.exit(1)
  }
}

const start = async () => {
  try {
    validateEnv()
    await getPayload({ config });

    app.listen(PORT, '0.0.0.0', () => {
      logger.info('Server started', { port: PORT, admin: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin` });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

start();