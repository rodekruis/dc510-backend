require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');

const initializeData = require('./initialize-data');
const {
  User,
  ActivityType,
  ActivitySeverity,
  Region,
  Activity,
  Recording
} = require('./app/schema');

const PROJECT_NAME = 'dc510';

// create keystone app
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter({
    knexOptions: {
      client: 'postgres',
      connection: process.env.DATABASE_URL
    }
  }),
  onConnect: initializeData
});

// create our app entities / data structure
keystone.createList('User', User);
keystone.createList('ActivityType', ActivityType);
keystone.createList('ActivitySeverity', ActivitySeverity);
keystone.createList('Region', Region);
keystone.createList('Activity', Activity);
keystone.createList('Recording', Recording);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User'
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ enableDefaultRoute: true, authStrategy })
  ]
};
