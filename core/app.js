require('./glob') // Require Globals first
const db = require('../database');


const App = {

  bootstrap: async (server) => {

    //Register components
    await require('../components').register(server);

    // JWT auth
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', restops.helpers.jwt.validator);
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