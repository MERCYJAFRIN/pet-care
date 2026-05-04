const { Appointment, Pet, User } = require('./src/models');
const sequelize = require('./src/config/database');

async function checkAppointments() {
  try {
    await sequelize.authenticate();
    const appointments = await Appointment.findAll({
      include: [{ model: Pet, as: 'Pet' }, { model: User }],
      where: { status: 'scheduled' }
    });
    console.log(JSON.stringify(appointments, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAppointments();
