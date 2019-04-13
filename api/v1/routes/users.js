const Controller = require('../controllers/users-controller');
const Validator = require('../validators/user-validator');

module.exports = (server) => {
  server.route({
    method: 'POST',
    path: '/users/login',
    handler: Controller.login,
    options: {
      auth: false,
      validate: Validator.login
    }
  })

  server.route({
    method: 'POST',
    path: '/users/register',
    handler: Controller.register,
    options: {
      auth: false,
      validate: Validator.register
    }
  })
}

