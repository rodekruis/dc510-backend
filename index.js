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
const isProduction = process.env.NODE_ENV === 'production';

// create keystone app
const keystone = new Keystone({
  name: PROJECT_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  onConnect: initializeData,
  secureCookies: isProduction,
  adapter: new Adapter({
    knexOptions: {
      client: 'postgres',
      connection: process.env.DATABASE_URL
    }
  })
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

// disable playground for production
const apollo = {
  introspection: !isProduction,
  playground: !isProduction,
  cors: isProduction
};

// to enable graphql in production
// https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/#enabling-graphql-playground-in-production
module.exports = {
  keystone,
  apps: [
    new GraphQLApp({ apollo }),
    new AdminUIApp({ enableDefaultRoute: true, authStrategy })
  ]
};
