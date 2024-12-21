import { defineHook } from '@directus/extensions-sdk';
import { appendFileSync } from 'fs';
import { join } from 'path';

const LOG_FILE = '/directus/logs/enrollments.log';

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  try {
    appendFileSync(LOG_FILE, logMessage);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

export default defineHook(({ filter, action }, { services, database, getSchema }) => {
  // Log enrollment creation
  action('enrollments.items.create', async ({ payload, key, collection }) => {
    const { ItemsService } = services;
    const schema = await getSchema();
    
    try {
      // Get the course details
      const coursesService = new ItemsService('epicode_courses', { schema });
      const course = await coursesService.readOne(payload.course_id);

      // Get the user details
      const usersService = new ItemsService('directus_users', { schema });
      const user = await usersService.readOne(payload.user_id);

      // Create log entry
      const logEntry = [
        ' New Enrollment:',
        `User: ${user.email}`,
        `Course: ${course.name}`,
        `Status: ${payload.status}`,
        '',
        ' Simulated email sent to:',
        `To: ${user.email}`,
        `Subject: Welcome to ${course.name}!`,
        'Body: Your enrollment has been confirmed.',
        '-------------------------------------------'
      ].join('\n');

      logToFile(logEntry);
    } catch (error) {
      logToFile(` Error processing enrollment: ${error}`);
    }
  });

  // Get enrollment data before deletion
  filter('enrollments.items.delete', async (payload:any, meta) => {
    const { ItemsService } = services;
    const schema = await getSchema();
    logToFile('🔍 Getting pre-deletion data for payload ' + JSON.stringify({payload, meta}));
    const payloadID = payload[0];
    try {
      // Get the enrollment data before it's deleted
      const enrollmentsService = new ItemsService('enrollments', { schema });
      const enrollment = await enrollmentsService.readOne(payloadID);

      // Get the course details
      const coursesService = new ItemsService('epicode_courses', { schema });
      const course = await coursesService.readOne(enrollment.course_id);

      // Get the user details
      const usersService = new ItemsService('directus_users', { schema });
      const user = await usersService.readOne(enrollment.user_id);

      // Log enrollment data and email simulation
      const logEntry = [
        '🔍 Pre-deletion Enrollment Data:',
        `Enrollment ID: ${payloadID}`,
        `User: ${user.email}`,
        `Course: ${course.name}`,
        `Status: ${enrollment.status}`,
        `Created at: ${enrollment.date_created}`,
        '',
        '📧 Email Simulation - Unenrollment Notice:',
        `To: ${user.email}`,
        `Subject: Unenrollment from ${course.name}`,
        'Body: Your unenrollment request is being processed.',
        'We wanted to confirm that you are being unenrolled from the course.',
        'If this was not intended, please contact support immediately.',
        '-------------------------------------------'
      ].join('\n');

      logToFile(logEntry);
      
      // Return the payload to allow the deletion to proceed
      return payload;
    } catch (error) {
      logToFile(`❌ Error getting pre-deletion data: ${error}`);
      return payload;
    }
  });

  // Log enrollment deletion
  action('enrollments.items.delete', async ({ payload, key }) => {
    logToFile(' Enrollment deletion completed for payload ' + JSON.stringify(payload));
  });
});
