const pluralize = require('pluralize')
const Utils = restops.utils;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');

module.exports = {

  /**
   * Overwrites:
   * `__NAME_PLURAL__`, `__NAME__`, `__CAPITALIZED_NAME__`
   * @param name
   * @returns {Promise<void>}
   */
  run: async (name) => {
    try {

      if(!name) throw new Error('component `name` is not defined');

      name = name.toLowerCase(); // Force lowercase

      const overwrites = {
        __NAME__: name,
        __NAME_PLURAL__: pluralize(name),
        __NAME_CAPITALIZED__: Utils.string.capitalize(name)
      }

      const stubs = fs.readdirSync(__dirname + '/stubs');
      const baseDir = path.join(restops.config.apis.dir, name);

      mkdirp.sync(baseDir);

      stubs.forEach(file => {
        let data = fs.readFileSync(`${__dirname}/stubs/${file}`, 'utf8');
        Object.keys(overwrites).forEach(key => {
          data = data.replace(new RegExp(key, 'g'), overwrites[key]);
        })
        let fileName;

        fileName = `${overwrites.__NAME__}.${file.replace('.stub', '.js')}`;
        fs.writeFileSync(`${baseDir}/${fileName}`, data);
      })
    }catch (e) {
      throw e;
      process.exit(1);
    }
  }
}
