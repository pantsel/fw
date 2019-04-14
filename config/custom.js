/**
 * Custom config properties
 */
module.exports = {

  jwt: {
    secret: process.env.JWT_TOKEN_SECRET || 'HYx17HlKBTy90HbbdeiP206518U'
  },

  mongo: {
    url: process.env.MONGO_URL || `mongodb://localhost:27017/restops`
  }

}
