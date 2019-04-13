const _ = require('lodash');
const Boom = require('boom');
const JWT = restops.core.services.jwt.validator;


module.exports = (_.merge(restops.core.controllers.baseController(restops.models.user), {
  // Overwrite methods or add new ones here

  login: async (req, h) => {

    console.log(req.payload);

    const data = req.payload;

    const user = await restops.models.user.findOne({ emailAddress: data.emailAddress });

    if(!user) return Boom.unauthorized('Invalid email and/or password');

    if(!user.active) return Boom.unauthorized('You are not authorized to perform this action');

    const isMatch = await user.comparePassword(data.password);

    if(!isMatch) return Boom.unauthorized('Invalid email and/or password');

    const token = await JWT.sign(user);

    return _.merge(_.omit(user.toObject(), ['password', 'refreshToken']), { token: token });

  },

  register: async (req, h) => {

    console.log(req.payload);

    const data = req.payload;

    return await restops.models.user.create(data);

  }

}));
