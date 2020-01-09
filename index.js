require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter } = require('@keystonejs/adapter-knex');
const session = require('express-session');
const knexOptions = require('./knexfile');
const KnexSessionStore = require('connect-session-knex')(session);
const AzureUploader = require('./uploader');

const {
  User,
  ActivityType,
  Severity,
  Task,
  Observation,
  MediaItem
} = require('./schema');

const PROJECT_NAME = 'dc510';
// const isProduction = process.env.NODE_ENV === 'production';
// const initializeData = require('./initial-data');
// const dropDatabase = !isProduction && process.env.RECREATE_DATABASE;

// create keystone app
const keystone = new Keystone({
  name: PROJECT_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  // onConnect: initializeData,
  secureCookies: false, // @todo enable in production
  adapter: new KnexAdapter({ knexOptions /* dropDatabase */ }),
  sessionStore: new KnexSessionStore({
    knex: require('knex')(knexOptions),
    tablename: 'user_sessions' // optional. Defaults to 'sessions'
  })
});

// create our app entities / data structure
keystone.createList('User', User);
keystone.createList('ActivityType', ActivityType);
keystone.createList('Severity', Severity);
keystone.createList('Task', Task);
keystone.createList('Observation', Observation);
keystone.createList('MediaItem', MediaItem);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User'
});

// @todo disable playground for production
const apollo = {
  introspection: true,
  playground: true,
  cors: false
};

module.exports = {
  keystone,
  apps: [
    new GraphQLApp({ apollo }),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin
    })
  ],
  configureExpress: AzureUploader
};
