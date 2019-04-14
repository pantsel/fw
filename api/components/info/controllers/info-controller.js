const pckg = require('../../../../package');

module.exports = {
  info: async (request, h) => {
    return {
      version: pckg.version,
      firstRun :await restops.models.user.countDocuments({isSuperAdmin: true}) < 1,
      date: new Date()
    };
  }
}
