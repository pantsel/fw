const Utils = require('../../lib/utils');

module.exports = {
  name: 'User',
  description: 'Everything about the User',
  version: '1.0.0',
  options: {
    routes: {
      prefix: '/v1'
    }
  },
  register: async function (server, options) {
    await Utils.registerRoutes(__dirname, server);
  }
};
