const pckg = require('../../../package');
const User = require('../../../models/user');

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/info',
    options: {
      auth: false
    },
    handler: async (request, h) => {
      return {
        version: pckg.version,
        firstRun :await User.countDocuments({isSuperAdmin: true}) < 1,
        date: new Date()
      };
    }
  })
}
