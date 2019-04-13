const requireAll = require('require-all');

module.exports = {
  v1: {
    name: 'api_v1',
    version: '1.0.0',
    register: async function (server, options) {
      requireAll({
        dirname: __dirname + '/v1/routes',
        resolve     : function (route) {
          return route(server);
        }
      });
    }
  }
}
