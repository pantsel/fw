const { lstatSync, readdirSync, existsSync } = require('fs');
const { join } = require('path')
const requireAll = require('require-all');
const _ = require('lodash');

module.exports = async (server) => {
  register: {

    const componentsDir = restops.config.components.dir;
    const dirs = p => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory())
    const dirNames = dirs(componentsDir);

    // Register models globally in `restops.models`
    dirNames.forEach(dir => {
      const models = join(componentsDir, dir, 'models');
      if(existsSync(models)) {
        const files = readdirSync(models);
        if(files.length) _.assign(restops.models, requireAll(models));
      }
    });

    // Register components as plugins
    await restops.utils.asyncForEach(dirNames, async (dir) => {
      if(existsSync(join(componentsDir, dir, 'index.js'))) {
        const plugin = require(`${componentsDir}/${dir}`);
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
