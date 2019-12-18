require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const session = require('express-session');
const knexOptions = require('./knexfile');
const KnexSessionStore = require('connect-session-knex')(session);

const initializeData = require('./initialize-data');
const {
  User,
  ActivityType,
  ActivitySeverity,
  Region,
  Activity,
  Recording
} = require('./schema');

const PROJECT_NAME = 'dc510';

// create keystone app
const keystone = new Keystone({
  name: PROJECT_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  onConnect: initializeData,
  secureCookies: false, // @todo enable in production
  adapter: new Adapter({ knexOptions }),
  sessionStore: new KnexSessionStore({
    knex: require('knex')(knexOptions),
    tablename: 'user_sessions' // optional. Defaults to 'sessions'
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
  ]
};
