// JWT auth
module.exports = async (server) => {

  await server.register(require('hapi-auth-jwt2'));
  server.auth.strategy('jwt', 'jwt', restops.helpers.jwt.validator);
  server.auth.default('jwt');

}
