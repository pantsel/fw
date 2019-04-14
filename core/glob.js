const path = require('path');
const requireAll = require('require-all');

global.__basedir = path.resolve(process.cwd());

global.restops = {};

global.restops.config = requireAll(path.join(process.cwd(), 'config'));

global.restops.models = {};

global.restops.helpers = requireAll(path.join(process.cwd(), 'helpers'));

global.restops.utils = require('./lib/utils');
