const {
  Integer,
  Text,
  Checkbox,
  Password,
  Relationship,
  Location,
  Url
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');

// Access control functions
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
 * User schema
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
    delete: access.userIsAdmin,
    auth: true
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
  }
};

/**
 * Activity severity
 */

exports.ActivitySeverity = {
  fields: {
    name: { type: Text, isRequired: true },
    code: { type: Integer, isRequired: true }
    // image_url: { type: AzureImage }
    // @todo write an adapter based on this
    // https://github.com/keystonejs/keystone/blob/master/packages/file-adapters/lib/cloudinary.js
  },
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  }
};

/**
 * Region
 */

exports.Region = {
  fields: {
    name: { type: Text, isRequired: true },
    code: { type: Text, isUnique: true, isRequired: true }
  },
  access: {
    read: true,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  }
};

/**
 * Activities
 */

exports.Activity = {
  fields: {
    name: { type: Text, isRequired: true },
    type: {
      type: Relationship,
      ref: 'ActivityType',
      isRequired: true
    },
    region: {
      type: Relationship,
      ref: 'Region',
      isRequired: true
    },
    assignee: {
      type: Relationship,
      ref: 'User',
      isRequired: true
    },
    createdAt: { type: DateTimeUtc }
  },
  access: {
    read: access.userIsAuthenticated,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin
  }
};

/**
 * Recordings
 */

exports.Recording = {
  fields: {
    createdAt: { type: DateTimeUtc },
    location: {
      type: Location,
      isRequired: true,
      googleMapsKey: process.env.GOOGLE_MAPS_KEY
    },
    activity: {
      type: Relationship,
      ref: 'Activity',
      isRequired: true
    },
    severity: {
      type: Relationship,
      ref: 'ActivitySeverity',
      isRequired: true
    },
    user: {
      type: Relationship,
      ref: 'User',
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
  }
};
