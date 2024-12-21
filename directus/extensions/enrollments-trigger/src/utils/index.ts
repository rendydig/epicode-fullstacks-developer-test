import { appendFileSync } from 'fs';

export const LOG_FILE = '/directus/logs/enrollments.log';

export const logToFile = (message: string): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  try {
    appendFileSync(LOG_FILE, logMessage);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};