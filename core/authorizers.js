const requireAll = require('require-all');

module.exports = {
  name: 'auth',
  description: 'Register Authorization strategies here',
  version: '1.0.0',
  register: async function (server, options) {
    requireAll({
      dirname: restops.config.strategies.dir,
      resolve: function (strategy) {
        return strategy(server);
      }
    })
  }
}
