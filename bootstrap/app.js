const db = require('../database');
const JWT = require('../api/v1/services/jwt');

const App = (server) => {
  return {
    bootstrap: async () => {

      //Register components
      await require('../components').register(server);


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

      // Finally, connect to the database and seed
      try {
        await db.connect();
        console.log(`Connected to the database`)
        await db.seed();
      }catch (e) {
        console.error('Failed to connect to the database', e);
      }

    }
  }
}

module.exports = App;
