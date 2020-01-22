const {
  Integer,
  Text,
  DateTime,
  Virtual,
  Float,
  Checkbox,
  Password,
  Relationship,
  Url
} = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { graphql } = require('graphql');

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

const dateFormat = { format: 'DD/MM/YYYY h:mm A' };
const plugins = [atTracking(dateFormat), byTracking()];

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
  plugins,
  adminConfig: {
    defaultColumns: 'name, email, createdAt',
    defaultSort: 'createdAt'
  }
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
  plugins,
  adminConfig: {
    defaultColumns: 'name, code, updatedBy, updatedAt'
  }
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
  plugins,
  adminConfig: {
    defaultColumns: 'name, code, updatedBy, updatedAt'
  }
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
    },
    completed: { type: Checkbox },
    // Display observations count using virtual fields
    // https://www.keystonejs.com/keystonejs/fields/src/types/virtual/
    observations: {
      type: Virtual,
      graphQLReturnType: 'Int',
      resolver: async (item, args, ctx, { schema }) => {
        const query = `
          query ($taskId: ID!) {
            _allObservationsMeta(where: { task: { id: $taskId } }) {
              count
            }
          }
        `;
        const variables = { taskId: item.id };
        const { data } = await graphql(schema, query, null, ctx, variables);
        return data._allObservationsMeta.count;
      }
    }
  },
  access: {
    read: access.userIsAuthenticated,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  },
  plugins,
  adminConfig: {
    defaultColumns: 'name, observations, completed, assignee, updatedAt',
    defaultSort: 'createdAt'
  }
};

/**
 * Observations
 */

exports.Observation = {
  fields: {
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
    recordedAt: {
      type: DateTime,
      isRequired: true,
      ...dateFormat
    },
    // lat, lng values when the media was taken
    lat: { type: Float },
    lng: { type: Float },
    // lat, lng of the location pointed on the map
    marked_lat: { type: Float },
    marked_lng: { type: Float },
    image_urls: { type: Relationship, ref: 'MediaItem', many: true }
  },
  labelResolver: item => `Observation ${item.id}`,
  access: {
    read: access.userIsAuthenticated,
    update: access.userIsAuthenticated,
    create: access.userIsAuthenticated,
    delete: access.userIsAuthenticated
  },
  plugins,
  adminConfig: {
    defaultColumns: 'task, severity, createdBy, createdAt',
    defaultSort: 'createdAt'
  }
};

exports.MediaItem = {
  fields: {
    url: { type: Url }
  },
  labelResolver: item => `Media ${item.id}`,
  access: {
    read: access.userIsAuthenticated,
    update: access.userIsAdmin,
    create: access.userIsAuthenticated,
    delete: access.userIsAdmin
  },
  plugins,
  adminConfig: {
    defaultColumns: 'url, createdBy, createdAt',
    defaultSort: 'createdAt'
  }
};
