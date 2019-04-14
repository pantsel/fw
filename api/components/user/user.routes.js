const Validator = require('./user.validators');


module.exports = {
  '/users/login': {
    method: 'POST',
    action: 'login',
    options: {
      auth: false,
      validate: Validator.login
    }
  },

  '/users/register': {
    method: 'POST',
    action: 'register',
    options: {
      auth: false,
      validate: Validator.register
    }
  }
}
