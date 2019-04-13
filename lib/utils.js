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
  },

  string: {
    camelize(s) {
      return s.trim().replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
    },

    capitalize(s)  {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
  }

}


module.exports = Utils
