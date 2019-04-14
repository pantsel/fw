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
        auth: false
      },
      findById: {
        auth: false
      },
      create: {
        auth: 'jwt'
      },
      update: {
        auth: 'jwt'
      },
      destroy: {
        auth: 'jwt'
      }
    }
  },
  register: async function (server, options) {
    await restops.utils.registerRoutes(__dirname, server);
  }
};
