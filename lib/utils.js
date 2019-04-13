const requireAll = require('require-all');
const fs = require('fs');

const Utils = {

  async asyncForEach(array, callback) {
    if(array) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
  },

  async registerRoutes(dir, server) {
    const routesDir = dir + '/routes';
    if(fs.existsSync(routesDir) && fs.readdirSync(routesDir).length) {
      requireAll({
        dirname: dir + '/routes',
        resolve     : function (route) {
          return route(server);
        }
      });
    }
  }
}


module.exports = Utils
