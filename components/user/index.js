const Utils = require('../../lib/utils');

module.exports = {
  name: 'user',
  description: 'Everything about the User',
  version: '1.0.0',
  options: {
    api: true,
    rest: true,
    prefix: '/v1',
    pluralize: true,
    restfulRouteOptions: {
      list: {
        auth: false,
        pre: [],
        validate: null
      },
      findById: {
        auth: false,
        pre: [],
        validate: null
      },
      create: {
        auth: 'jwt',
        pre: [],
        validate: null
      },
      update: {
        auth: 'jwt',
        pre: [],
        validate: null
      },
      destroy: {
        auth: 'jwt',
        pre: [],
        validate: null
      }
    }
  },
  register: async function (server, options) {
    await Utils.registerRoutes(__dirname, server);
  }
};
