const requireAll = require('require-all');

const Utils = {

  async asyncForEach(array, callback) {
    if(array) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
  },

  async registerRoutes(dir, server) {
    requireAll({
      dirname: dir + '/routes',
      resolve     : function (route) {
        return route(server);
      }
    });
  }
}


module.exports = Utils
