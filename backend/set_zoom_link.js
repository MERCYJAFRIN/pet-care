const { Appointment } = require('./src/models');
const sequelize = require('./src/config/database');

async function setZoomLink() {
  const zoomLink = 'https://us04web.zoom.us/j/76056977589?pwd=7bcLb9Ub1C3tdOZI5AAxuwmlUszRxw.1';
  try {
    await sequelize.authenticate();
    const [updatedCount] = await Appointment.update(
      { meetLink: zoomLink, consultationMode: 'online' },
      { where: { status: 'scheduled' } }
    );
    console.log(`Successfully updated ${updatedCount} appointments with the Zoom link.`);
  } catch (error) {
    console.error('Error updating appointments:', error);
  } finally {
    await sequelize.close();
  }
}

setZoomLink();
