const {
  Integer,
  Text,
  Checkbox,
  Password,
  Relationship,
  Location,
  Url
} = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

/**
 * Access control
 */

const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) =>
  user && { id: user.id };
const userIsAuthenticated = ({ authentication: { item } }) => !!item;
const userIsAdminOrAuthenticated = auth => {
  const isAdmin = userIsAdmin(auth);
  const isAuthenticated = userIsAuthenticated(auth);
  return isAdmin ? isAdmin : isAuthenticated;
};
const access = {
  userIsAdmin,
  userOwnsItem,
  userIsAdminOrAuthenticated,
  userIsAuthenticated
};

/**
 * Schemas
 */

exports.User = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password
    }
  },
  access: {
    read: access.userIsAdminOrAuthenticated,
    update: access.userIsAdminOrAuthenticated,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
};

/**
 * Activity types
 */

exports.ActivityType = {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    code: { type: Text, isUnique: true, isRequired: true },
    description: { type: Wysiwyg }
  },
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
};

/**
 * Serverity
 */

exports.Severity = {
  fields: {
    name: { type: Text, isRequired: true },
    code: { type: Integer, isRequired: true }
  },
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
};

/**
 * Tasks
 */

exports.Task = {
  fields: {
    name: { type: Text, isRequired: true },
    description: { type: Wysiwyg },
    type: {
      type: Relationship,
      ref: 'ActivityType',
      isRequired: true
    },
    assignee: {
      type: Relationship,
      ref: 'User',
      isRequired: true
    }
  },
  access: {
    read: access.userIsAuthenticated,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  },
  plugins: [atTracking(), byTracking()]
};

/**
 * Observations
 */

exports.Observation = {
  fields: {
    location: {
      type: Location,
      isRequired: true,
      googleMapsKey: process.env.GOOGLE_MAPS_KEY
    },
    task: {
      type: Relationship,
      ref: 'Task',
      isRequired: true
    },
    severity: {
      type: Relationship,
      ref: 'Severity',
      isRequired: true
    },
    media_url: { type: Url, isRequired: true },
    complete: { type: Checkbox }
  },
  access: {
    // @todo  revisit these permissions
    read: access.userIsAuthenticated,
    update: access.userIsAuthenticated,
    create: access.userIsAuthenticated,
    delete: access.userIsAuthenticated
  },
  plugins: [atTracking(), byTracking()]
};
