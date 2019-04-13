global.restops = {
  config: require('./config'),
  models: require('require-all')(__dirname + '/models')
};

const Hapi = require('hapi');
const server = Hapi.server({
  port: restops.config.server.port,
  host: restops.config.server.host
});


const init = async () => {
  await require('./bootstrap/app')(server).bootstrap();
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
