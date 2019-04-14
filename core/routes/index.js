const _ = require('lodash');
const util = require('util');
const path = require('path');
const pluralize = require('pluralize');
const fs = require('fs');

module.exports = module.exports = {
  name: 'core-routes',
  version: '1.0.0',
  register: async function (server, options) {
    // console.log(server, options)

    const apis = [];
    Object.keys(server.registrations).forEach(key => {
      if(_.get(server,`registrations.${key}.options.api`)) {
        apis.push(server.registrations[key]);
      }
    })

    const existingRoutes = _.map(server.table(), item => _.pick(item, ['method', 'path']));

    apis.forEach(component => {

      const componentsDefConfig = _.get(restops, 'config.components', {});
      // Rename default config's `restfulRouteOptions` key to use it as fallback
      restops.utils.object.renameKey(componentsDefConfig, 'restfulRouteOptions', 'defRestfulRouteOptions');
      // console.log(util.inspect({componentsDefConfig}, false, null, true ))

      const componentConfig = _.get(component, 'options', {});
      // console.log(util.inspect({componentConfig}, false, null, true ))

      const config = _.merge(_.cloneDeep(componentsDefConfig), componentConfig);
      // console.log(util.inspect({config}, false, null, true ))

      if(!config.rest) return;

      const model = restops.models[component.name];

      if(!model) return;

      const baseHandler = require('../controllers/base-controller')(model);
      const componentPluralName = pluralize(component.name);
      const componentHandlerPath = path.join(process.cwd(), 'components', component.name, 'controllers',  `${componentPluralName}-controller.js`);

      let componentHandler;
      if(fs.existsSync(componentHandlerPath)) {
        componentHandler = require(componentHandlerPath);
      }
      const handler = _.merge(_.cloneDeep(baseHandler), componentHandler || {});


      // console.log(util.inspect({config}, false, null, true ))

      const crud = require('./crud')(server, component.name, handler, config);

      // console.log(crud.routes)
      const registrations = []; // Unique routes to be registered
      crud.routes.forEach(crudRoute => {
        const existing = _.find(existingRoutes, item => {
          return item.method === crudRoute.method && item.path === crudRoute.path;
        })

        if(!existing) {
          registrations.push(crudRoute);
        }

      })

      // console.log(util.inspect({registrations}, false, null, true ))

      registrations.forEach(registration => {
        server.route({
          method: registration.method,
          path: registration.path,
          handler: registration.handler,
          options: registration.options
        })
      })
    })

    const registrationsTable = _.map(server.table(), item => _.pick(item, ['method', 'path', 'params', 'fingerprint']));
    const routes = [];
    registrationsTable.forEach(reg => {
      routes.push({
        method: reg.method.toUpperCase(),
        path: reg.path,
        params: reg.params,
        fingerprint: reg.fingerprint
      })
    })
    // server.logger().debug(`REGISTERED ROUTES`)
    console.table(routes);

    // console.log(_.map(server.table(), item => _.pick(item, ['method', 'path'])))
  }
};
