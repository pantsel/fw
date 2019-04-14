module.exports = {
  name: 'info',
  description: 'Provides an informational API about the service',
  version: '1.0.0',
  options: {
    api: true,
    prefix: '/v1'
  },
  register: async function (server, options) {
    await restops.utils.registerRoutes(__dirname, server);
  }
}
