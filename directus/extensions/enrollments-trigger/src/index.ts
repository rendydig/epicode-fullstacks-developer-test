import { defineHook } from '@directus/extensions-sdk';
import { logToFile } from './utils';
import { sendEmail } from './config/email';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineHook(({ filter, action }, { services, getSchema }) => {
  // Log enrollment creation
  action('enrollments.items.create', async ({ payload}) => {
    const { ItemsService } = services;
    const schema = await getSchema();
    
    try {
      // Get the course details
      const coursesService = new ItemsService('epicode_courses', { schema });
      const course = await coursesService.readOne(payload.course_id);

      // Get the user details
      const usersService = new ItemsService('directus_users', { schema });
      const user = await usersService.readOne(payload.user_id);

      // Send welcome email
      const emailSubject = `Welcome to ${course.name}!`;
      const emailBody = `
        <h1>Welcome to ${course.name}!</h1>
        <p>Dear ${user.first_name || 'Student'},</p>
        <p>Your enrollment has been confirmed for the course "${course.name}".</p>
        <p>You can now access your course materials and start learning!</p>
        <br>
        <p>Best regards,</p>
        <p>The Epicode Team</p>
      `;

      await sendEmail(user.email, emailSubject, emailBody);

      // Create log entry
      const logEntry = [
        'New Enrollment:',
        `User: ${user.email}`,
        `Course: ${course.name}`,
        `Status: ${payload.status}`,
        '',
        'Email sent successfully:',
        `To: ${user.email}`,
        `Subject: ${emailSubject}`,
        '-------------------------------------------'
      ].join('\n');

      logToFile(logEntry);
    } catch (error) {
      logToFile(`Error processing enrollment: ${error}`);
      throw error;
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

      // Prepare and send unenrollment email
      const emailSubject = `Unenrollment from ${course.name}`;
      const emailBody = `
        <h1>Course Unenrollment Confirmation</h1>
        <p>Dear ${user.first_name || 'Student'},</p>
        <p>This email confirms that you have been unenrolled from the following course:</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <strong>Course:</strong> ${course.name}<br>
          <strong>Enrollment Date:</strong> ${new Date(enrollment.date_created).toLocaleDateString()}<br>
          <strong>Unenrollment Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        <p>If you did not request this unenrollment or believe this was done in error, please contact our support team immediately.</p>
        <br>
        <p>Best regards,</p>
        <p>${process.env.SMTP_FROM_NAME}</p>
      `;

      await sendEmail(user.email, emailSubject, emailBody);

      // Log enrollment data and email simulation
      const logEntry = [
        'Pre-deletion Enrollment Data:',
        `Enrollment ID: ${payloadID}`,
        `User: ${user.email}`,
        `Course: ${course.name}`,
        `Status: ${enrollment.status}`,
        `Created at: ${enrollment.date_created}`,
        '',
        'Email Sent - Unenrollment Notice:',
        `To: ${user.email}`,
        `Subject: ${emailSubject}`,
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
