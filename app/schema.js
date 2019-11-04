const {
  Text,
  Checkbox,
  Password,
  Select,
  Relationship,
  DateTime,
  Location,
  Url
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) =>
  user && { id: user.id };
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };
const defaultDate = { defaultValue: () => new Date().toISOString() };
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
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
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
  }
};

/**
 * Activity severity
 */

exports.ActivitySeverity = {
  fields: {
    code: {
      type: Select,
      isUnique: true,
      isRequired: true,
      options: [
        { value: 'NONE', label: 'None' },
        { value: 'MILD', label: 'Mild' },
        { value: 'HIGH', label: 'High' },
        { value: 'SEVERE', label: 'Severe' }
      ],
      schemaDoc: 'Severity of activity ranging from 0 to 5'
    }
    // image_url: { type: AzureImage }
    // @todo write an adapter based on this
    // https://github.com/keystonejs/keystone/blob/master/packages/file-adapters/lib/cloudinary.js
  }
};

/**
 * Region
 */

exports.Region = {
  fields: {
    name: { type: Text, isRequired: true },
    code: { type: Text, isUnique: true, isRequired: true }
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
    severity: {
      type: Relationship,
      ref: 'ActivitySeverity',
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
    complete: { type: Checkbox },
    createdAt: { type: DateTime, ...defaultDate }
  }
};

/**
 * Recordings
 */

exports.Recording = {
  fields: {
    createdAt: { type: DateTime, ...defaultDate },
    location: {
      type: Location,
      isRequired: true,
      googleMapsKey: 'AIzaSyAkhezTmdeln_bfDM6uQxc-6E66PHbDPMM'
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
    media_url: { type: Url, isRequired: true }
  }
};
