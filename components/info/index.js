const Utils = require('../../lib/utils');

const InfoComponent = {
  name: 'Info',
  description: 'Provides an informational API about the service',
  version: '1.0.0',
  options: {
    routes: {
      prefix: '/v1'
    }
  },
  register: async function (server, options) {
    await Utils.registerRoutes(__dirname, server);
  }
}

module.exports = InfoComponent;
