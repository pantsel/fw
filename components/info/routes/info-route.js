const Controller = require('../controllers/info-controller');

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/info',
    options: {
      auth: false
    },
    handler: Controller.info
  })
}
