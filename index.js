const App = require('./core/app'); // Require the app before anything else
const Hapi = require('hapi');
const server = Hapi.server({
  port: restops.config.server.port,
  host: restops.config.server.host
});


const init = async () => {
  await App.bootstrap(server);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
