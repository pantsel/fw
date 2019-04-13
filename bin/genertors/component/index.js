const pluralize = require('pluralize')
const Utils = require('../../../lib/utils');
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

      const subDirs = [
        {
          name: 'controllers',
          stub: 'controller.stub'
        },
        {
          name: 'middleware',
          stub: 'middleware.stub'
        },
        {
          name: 'models',
          stub: 'model.stub'
        },
        {
          name: 'routes',
          stub: 'route.stub'
        },
        {
          name: 'services',
          stub: 'service.stub'
        },
        {
          name: 'validators',
          stub: 'validator.stub'
        },
      ]

      const stubs = fs.readdirSync(__dirname + '/stubs');
      const baseDir = path.join(process.cwd(), 'components', name);

      subDirs.forEach(subDir => {
        mkdirp.sync(`${baseDir}/${subDir.name}`);
      })

      stubs.forEach(file => {
        let data = fs.readFileSync(`${__dirname}/stubs/${file}`, 'utf8');
        Object.keys(overwrites).forEach(key => {
          data = data.replace(new RegExp(key, 'g'), overwrites[key]);
        })

        if(file === 'index.stub') { // write index.js
          fs.writeFileSync(`${baseDir}/index.js`, data);
        }else{
          const subDir = _.find(subDirs, item => item.stub === file);
          if(subDir) {
            let fileName;
            switch (subDir.name) {
              case 'models':
                fileName = `${overwrites.__NAME__}.js`
                break;
              case 'routes':
                fileName = `${overwrites.__NAME__}-routes.js`
                break;
              default:
                fileName = `${name}-${file.replace('.stub', '.js')}`;
            }
            fs.writeFileSync(`${baseDir}/${subDir.name}/${fileName}`, data);
          }
        }
      })
    }catch (e) {
      throw e;
      process.exit(1);
    }
  }
}
