require('./glob') // Require Globals first
const db = require('../database');


const App = {

  bootstrap: async (server) => {

    // Register auth strategies
    await server.register({
      plugin: require('./authorizers')
    })

    //Register components
    await require('./components').register(server);

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

    // Connect to the database and seed
    try {
      await db.connect();
      server.logger().info(`Connected to the database`)
      await db.seed();
    }catch (e) {
      console.error(e)
      server.logger().error('Failed to connect to the database', e)
    }

    // Finally, start the Server
    await server.start();

    return server;

  }
}

module.exports = App;
