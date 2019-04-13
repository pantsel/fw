const db = require('../database');
const requireAll = require('require-all');
const Utils = require('../lib/utils');
const _ = require('lodash');

const App = (server) => {
  return {
    bootstrap: async () => {

      // Load core
      _.extend(restops, {
        core: requireAll({
          dirname: process.cwd() + '/core',
          map: function (name, path) {
            return Utils.string.camelize(name);
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
        options: {
          origins: ['*']
        }
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

      // Finally, connect to the database and seed
      try {
        await db.connect();
        server.logger().info(`Connected to the database`)
        await db.seed();
      }catch (e) {
        server.logger().error('Failed to connect to the database', e)
      }

    }
  }
}

module.exports = App;
