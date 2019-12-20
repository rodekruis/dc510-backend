// const { User, ActivityType, Severity, Task, Observation } = require('./schema');
const initialData = {
  User: [
    {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      isAdmin: true,
      password: process.env.ADMIN_PASSWORD
    }
  ],
  ActivityType: [
    { name: 'Flood Extent', code: 'FE', description: 'Flood extent mapping' },
    { name: 'Damage Assessment', code: 'DA', description: 'Damange assessment' }
  ],
  Severity: [
    { name: 'None', code: 1 },
    { name: 'Mild', code: 2 },
    { name: 'High', code: 3 },
    { name: 'Severe', code: 4 }
  ],
  Observation: [],
  Task: [],
  MediaItem: []
};

module.exports = async keystone => {
  try {
    console.log('💾 Creating initial data...');
    await keystone.createItems(initialData);
  } catch (e) {
    console.log(e);
    console.log(' Seeding failed...');
  }
};
