const Joi = require('joi');
const _ = require('lodash');

module.exports = {
  login : {
    payload: {
      emailAddress : Joi.string().email().required(),
      password : Joi.string().required()
    },
    failAction: function (request, h, error) {

      const failingField = _.get(error, 'output.payload.validation.keys.0') || 'emailAddress';
      switch(failingField)
      {
        case "emailAddress" :
          error.output.payload.message = `Please provide a valid email`;
          break;
        case "password" :
          error.output.payload.message = `You must provide a password`;
          break;
      }

      return error;
    }
  },

  register : {
    payload: {
      fullName: Joi.string().required(),
      emailAddress : Joi.string().email(),
      password : Joi.string().min(6).max(15).required()
    },
    failAction: function (request, h, error) {
      const failingField = _.get(error, 'output.payload.validation.keys.0') || 'fullName';
      switch(failingField)
      {
        case "fullName" :
          error.output.payload.message = `The 'name' field is required`;
          break;
        case "emailAddress" :
          error.output.payload.message = `Please provide a valid email`;
          break;
        case "password" :
          error.output.payload.message = `The 'password' field is required and  has to be 6-15 characters long`;
          break;
      }

      return h(error);
    }
  },

}
