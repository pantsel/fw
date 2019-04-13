const requireAll = require('require-all');

global.restops = {
  config: requireAll(__dirname + '/config'),
  models: {},
  utils: require('./lib/utils')
};

const Hapi = require('hapi');
const server = Hapi.server({
  port: restops.config.server.port,
  host: restops.config.server.host
});


const init = async () => {
  await require('./bootstrap/app')(server).bootstrap();
  await server.start();
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


init();
