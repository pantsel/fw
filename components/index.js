const { lstatSync, readdirSync, existsSync } = require('fs');
const { join } = require('path')
const requireAll = require('require-all');
const _ = require('lodash');

module.exports = {
  register: async (server) => {

    const dirs = p => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory())
    const dirNames = dirs(__dirname);

    // Register models globally in `restops.models`
    dirNames.forEach(dir => {
      const models = join(__dirname, dir, 'models');
      if(existsSync(models)) {
        const files = readdirSync(models);
        if(files.length) _.assign(restops.models, requireAll(models));
      }
    });

    // Register components as plugins
    await restops.utils.asyncForEach(dirNames, async (dir) => {
      if(existsSync(join(__dirname, dir, 'index.js'))) {
        const plugin = require(`./${dir}`);
        await server.register({
          plugin: plugin,
          options: plugin.options
        }, {
          routes: {
            prefix:_.get(plugin, 'options.prefix')
          }
        })
      }
    })
  }
}
