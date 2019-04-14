const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

module.exports = {
  sign: async (user) => {
    // Create a new refreshToken if needed
    if(!user.refreshToken) {
      user.refreshToken = uuidv4();
      await user.save();
    }

    const payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(25, 'years').unix(),
      customData: {
      }
    };

    if (user.refreshToken) {
      payload.jti = user.refreshToken;
    }

    return jwt.sign(payload, restops.config.custom.jwt.secret);
  },

  validator: {
    key: restops.config.custom.jwt.secret,
    validate: async (decoded, request) => {
      const user = await restops.models.user.findById(decoded.sub);
      if(!user || user.refreshToken !== decoded.jti) return { isValid: false };
      return { isValid: true };
    },            // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  }
}
