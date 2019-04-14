const requireAll = require('require-all');
const path = require('path');
const db = require('../database');
const _ = require('lodash');

global.restops = {
  config: requireAll(path.join(process.cwd(), 'config')),
  models: {},
  utils: require('./lib/utils')
};

const App = {

  bootstrap: async (server) => {

    // Load core
    _.extend(restops, {
      core: requireAll({
        dirname: process.cwd() + '/core',
        map: function (name, path) {
          return restops.utils.string.camelize(name);
        }
      })
    });

    //Register components
    await require('../components').register(server);

    // JWT auth
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', restops.core.services.jwt.validator);
    server.auth.default('jwt');

    // CORS
    await server.register({
      plugin: require('hapi-cors'),
      options: restops.config.server.cors
    })

    // Hapi-pino
    await server.register({
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: true,
        level: process.env !== 'production' ? 'debug': 'info',
        logEvents: [
          'request',
          'response',
          'onPostStart'
        ]
      }
    });

    await server.register({
      plugin: require('../core/routes/index'),

    });

    // Connect to the database and seed
    try {
      await db.connect();
      server.logger().info(`Connected to the database`)
      await db.seed();
    }catch (e) {
      server.logger().error('Failed to connect to the database', e)
    }

    // Finally, start the Server
    await server.start();

  }
}

module.exports = App;
