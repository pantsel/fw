const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = {

  /**
   * Overwrites:
   * `__NAME__`
   * @param name
   * @returns {Promise<void>}
   */
  run: async (name) => {
    try {

      if(!name) throw new Error('helper `name` is not defined');

      name = name.toLowerCase(); // Force lowercase

      const overwrites = {
        __NAME__: name
      }
      const stubsDir = __dirname + '/stubs';
      const stubs = fs.readdirSync(stubsDir);
      const baseDir = path.join(process.cwd(), 'helpers');

      if(!fs.existsSync(baseDir)) mkdirp.sync(baseDir);

      stubs.forEach(file => {
        let data = fs.readFileSync(`${stubsDir}/${file}`, 'utf8');
        const fileName = `${name}.js`;
        Object.keys(overwrites).forEach(key => {
          data = data.replace(new RegExp(key, 'g'), overwrites[key]);
        })
        fs.writeFileSync(`${baseDir}/${fileName}`, data, { flag: "wx" });

      });

      console.info(`Helper '${name}.js' generated`)

    }catch (e) {
      throw e;
      process.exit(1);
    }
  }
}
