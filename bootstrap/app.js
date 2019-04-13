const db = require('../database');
const JWT = require('../api/v1/services/jwt');

const App = (server) => {
  return {
    bootstrap: async () => {

      // Initialize db connection
      await db.init();


      // Register API
      await server.register({
        plugin: require('../api').v1
      }, {
        routes: {
          prefix: '/v1'
        }
      })

      // JWT auth
      await server.register(require('hapi-auth-jwt2'));
      server.auth.strategy('jwt', 'jwt', JWT.validator);
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
          logEvents: ['request','response', 'onPostStart']
        }
      });

    }
  }
}

module.exports = App;
