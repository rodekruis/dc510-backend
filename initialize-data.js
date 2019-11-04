const {
  User,
  ActivityType,
  ActivitySeverity,
  Region,
  Activity,
  Recording
} = require('./app/schema');

module.exports = async keystone => {
  // Check the users list to see if there are any; if we find none, assume
  // it's a new database and initialise the demo data set.
  const users = await keystone.lists.User.adapter.findAll();
  if (!users.length) {
    // Drop the connected database to ensure no existing collections remain
    // Object.values(keystone.adapters).forEach(async adapter => {
    //   await adapter.dropDatabase();
    // });
    console.log('💾 Creating initial data...');
    await keystone.createList('User', User);
    await keystone.createList('ActivityType', ActivityType);
    await keystone.createList('ActivitySeverity', ActivitySeverity);
    await keystone.createList('Region', Region);
    await keystone.createList('Activity', Activity);
    await keystone.createList('Recording', Recording);
    await keystone.createItems(initialData);
  }
};

const initialData = {
  User: [
    {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      isAdmin: true,
      password: process.env.ADMIN_PASSWORD
    }
  ],
  Region: [
    { name: 'Philipines', code: 'PH' },
    { name: 'Nigeria', code: 'NI' },
    { name: 'Sudan', code: 'SU' },
    { name: 'Uganda', code: 'UG' }
  ],
  ActivityType: [
    { name: 'Flood Extent', code: 'FE', description: 'Flood extent mapping' },
    { name: 'Damage Assessment', code: 'DA', description: 'Damange assessment' }
  ],
  ActivitySeverity: [
    { code: 'NONE' },
    { code: 'MILD' },
    { code: 'HIGH' },
    { code: 'SEVERE' }
  ]
};
