const cron = require('node-cron');
const { Notification, HealthReminder, Vaccination, MedicalHistory, Appointment } = require('../models');
const { Op } = require('sequelize');

class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  // Initialize all scheduled tasks
  async initialize() {
    console.log('Initializing notification scheduler...');

    // Run every hour to check for due reminders
    this.jobs.push(
      cron.schedule('0 * * * *', async () => {
        await this.checkDueReminders();
      })
    );

    // Run every day at 8 AM to check vaccination due dates
    this.jobs.push(
      cron.schedule('0 8 * * *', async () => {
        await this.checkVaccinationDueDates();
      })
    );

    // Run every day at 12 PM to check medical appointments
    this.jobs.push(
      cron.schedule('0 12 * * *', async () => {
        await this.checkUpcomingAppointments();
      })
    );

    // Run every 6 hours to send pending notifications
    this.jobs.push(
      cron.schedule('0 */6 * * *', async () => {
        await this.sendPendingNotifications();
      })
    );

    console.log('✓ Notification scheduler initialized with 4 jobs');
  }

  // Check health reminders that are due
  async checkDueReminders() {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Get reminders scheduled within the next hour and haven't been notified
      const dueReminders = await HealthReminder.findAll({
        where: {
          reminderDate: {
            [Op.between]: [now, oneHourFromNow],
          },
          reminderSent: false,
        },
      });

      for (const reminder of dueReminders) {
        const notification = await Notification.create({
          userId: reminder.userId,
          petId: reminder.petId,
          notificationType: 'custom',
          title: `Health Reminder: ${reminder.title}`,
          message: reminder.description || `Your reminder for ${reminder.title} is coming up!`,
          relatedId: reminder.id,
          priority: 'high',
          scheduledFor: reminder.reminderDate,
          status: 'unread',
        });

        // Mark reminder as notified
        await reminder.update({ reminderSent: true });

        console.log(`✓ Reminder notification created for pet ${reminder.petId}`);
      }
    } catch (error) {
      console.error('Error checking due reminders:', error);
    }
  }

  // Check vaccination due dates
  async checkVaccinationDueDates() {
    try {
      const today = new Date();
      const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

      // Get vaccinations due within 5 days
      const dueVaccinations = await Vaccination.findAll({
        where: {
          nextDueDate: {
            [Op.between]: [today, fiveDaysFromNow],
          },
          status: { [Op.ne]: 'completed' },
        },
        include: [{ association: 'Pet', as: 'Pet' }],
      });

      for (const vaccine of dueVaccinations) {
        // Check if notification already exists for this vaccine
        const existingNotification = await Notification.findOne({
          where: {
            userId: vaccine.userId,
            notificationType: 'vaccination_reminder',
            relatedId: vaccine.id,
            status: 'unread',
          },
        });

        if (!existingNotification) {
          const daysUntilDue = Math.ceil((vaccine.nextDueDate - today) / (1000 * 60 * 60 * 24));

          await Notification.create({
            userId: vaccine.userId,
            petId: vaccine.petId,
            notificationType: 'vaccination_reminder',
            title: `Vaccination Reminder: ${vaccine.vaccineName}`,
            message: `${vaccine.vaccineName} vaccination is due in ${daysUntilDue} days for ${vaccine.Pet?.name || 'your pet'}`,
            relatedId: vaccine.id,
            priority: daysUntilDue <= 1 ? 'urgent' : 'high',
            scheduledFor: new Date(),
            status: 'unread',
          });

          console.log(`✓ Vaccination reminder created for ${vaccine.vaccineName}`);
        }
      }
    } catch (error) {
      console.error('Error checking vaccination due dates:', error);
    }
  }

  // Check upcoming appointments (1 day before)
  async checkUpcomingAppointments() {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      // Get appointments scheduled for tomorrow
      const upcomingAppointments = await Appointment.findAll({
        where: {
          appointmentDate: {
            [Op.between]: [tomorrowStart, tomorrow],
          },
        },
      });

      for (const appointment of upcomingAppointments) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          where: {
            userId: appointment.userId,
            notificationType: 'medical_appointment',
            relatedId: appointment.id,
            status: 'unread',
          },
        });

        if (!existingNotification) {
          await Notification.create({
            userId: appointment.userId,
            petId: appointment.petId,
            notificationType: 'medical_appointment',
            title: `Appointment Reminder: ${appointment.appointmentType}`,
            message: `You have a ${appointment.appointmentType} appointment tomorrow at ${appointment.appointmentDate.toLocaleTimeString()}`,
            relatedId: appointment.id,
            priority: 'high',
            scheduledFor: new Date(),
            status: 'unread',
          });

          console.log(`✓ Appointment reminder created for ${appointment.id}`);
        }
      }
    } catch (error) {
      console.error('Error checking upcoming appointments:', error);
    }
  }

  // Send pending notifications (mark as sent)
  async sendPendingNotifications() {
    try {
      const now = new Date();

      const pendingNotifications = await Notification.findAll({
        where: {
          status: 'unread',
          scheduledFor: { [Op.lte]: now },
          sentAt: null,
        },
      });

      for (const notification of pendingNotifications) {
        // In a real application, this could send emails, push notifications, SMS, etc.
        await notification.update({ sentAt: new Date() });
        console.log(`✓ Notification sent: ${notification.title}`);
      }

      if (pendingNotifications.length > 0) {
        console.log(`✓ ${pendingNotifications.length} notifications sent`);
      }
    } catch (error) {
      console.error('Error sending pending notifications:', error);
    }
  }

  // Create a medical visit reminder
  async createMedicalVisitReminder(userId, petId, visitDate, reminderHoursBefore = 5) {
    try {
      const reminderDate = new Date(visitDate);
      reminderDate.setHours(reminderDate.getHours() - reminderHoursBefore);

      const reminder = await HealthReminder.create({
        userId,
        petId,
        reminderType: 'checkup',
        title: 'Medical Visit Reminder',
        description: `Your pet has a scheduled medical visit`,
        reminderDate,
        reminderSent: false,
      });

      return reminder;
    } catch (error) {
      console.error('Error creating medical visit reminder:', error);
      throw error;
    }
  }

  // Create vaccination reminder
  async createVaccinationReminder(userId, petId, vaccinationId, nextDueDate) {
    try {
      // Create a health reminder 5 days before
      const reminderDate = new Date(nextDueDate);
      reminderDate.setDate(reminderDate.getDate() - 5);

      const reminder = await HealthReminder.create({
        userId,
        petId,
        reminderType: 'vaccination',
        title: 'Vaccination Due',
        description: `Vaccination is due in 5 days`,
        reminderDate,
        reminderSent: false,
      });

      return reminder;
    } catch (error) {
      console.error('Error creating vaccination reminder:', error);
      throw error;
    }
  }

  // Stop all scheduled jobs
  async shutdown() {
    for (const job of this.jobs) {
      job.stop();
    }
    console.log('✓ Notification scheduler shut down');
  }
}

module.exports = NotificationScheduler;
