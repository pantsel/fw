const requireAll = require('require-all');
const path = require('path');

module.exports = {
  name: 'auth',
  description: 'Register Authorization strategies here',
  version: '1.0.0',
  register: async function (server, options) {
    requireAll({
      dirname: path.join(process.cwd(), 'strategies'),
      resolve: function (strategy) {
        return strategy(server);
      }
    })
  }
}
