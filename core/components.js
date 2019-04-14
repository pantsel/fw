const {lstatSync, readdirSync, existsSync} = require('fs');
const {join, normalize} = require('path')
const requireAll = require('require-all');
const _ = require('lodash');
const fs = require('fs');
const util = require('util')

const Components = {
  register: async function (server) {

    restops.components = requireAll({
      dirname: restops.config.components.dir,
      map     : function (name, path) {
        return name.split('.').pop();
      }
    });

    // Register components as plugins
    if (_.keys(restops.components).length) {
      await restops.utils.asyncForEach(_.keys(restops.components), async (key) => {
        if (restops.components[key].index) {
          const plugin = Components.createPlugin(key, restops.components[key].index);
          await server.register({
            plugin: plugin,
            options: plugin.options
          }, {
            routes: {
              prefix: _.get(plugin, 'options.prefix')
            }
          })
        }
      })
    }

    Components.displayRoutesTable(server);
  },

  displayRoutesTable(server) {
    // Log registrations
    const registrationsTable = _.map(server.table(), item => _.pick(item, ['method', 'path', 'params', 'fingerprint', 'settings']));
    const routes = [];
    registrationsTable.forEach(reg => {
      routes.push({
        method: reg.method.toUpperCase(),
        path: reg.path,
        params: reg.params,
        auth: _.get(reg, 'settings.auth.strategies', []),
        fingerprint: reg.fingerprint,
      })
    })
    // server.logger().debug(`REGISTERED ROUTES`)
    console.table(routes);

    // console.log(_.map(server.table(), item => _.pick(item, ['method', 'path'])))
  },

  createPlugin(componentName, component) {

    component.register = async function (server, options) {
      if(options.api && restops.components[componentName]) {

        // Register the exposed routes
        const handlers = restops.components[componentName].handler;
        const routes = restops.components[componentName].routes;
        const model = restops.components[componentName].model;

        if(handlers && routes) {

          let baseHandler;
          if(options.rest) {
            // If default REST api should be exposed,
            // get baseHandler so that we can use it's default RESTful methods as a fallback
            baseHandler = model ? require(join(__basedir, 'core', 'base', 'handler'))(model) : null;
          }

          _.keys(routes).forEach(path => {
            const config = routes[path];
            server.route({
              method: config.method || 'GET',
              path: path,
              handler: handlers[config.action] || _.get(baseHandler, config.action), // Fallback to baseHandler method
              options: config.options || {}
            })
          })

          await Components.registerComponentRESTfulRoutes(componentName, component, server)
        }


      }
    }

    return component;
  },

  componentRoutePathExists(componentName, path, method, prefix) {

    const prefixedPath = prefix ? prefix + path : path;
    const componentRoutes = restops.components[componentName].routes;
    const componentRoutePathsFingerprints = _.map(_.keys(componentRoutes), path => restops.utils.getFingerprint(path));

    return componentRoutePathsFingerprints.indexOf(prefixedPath) > 0
      && componentRoutes[path].method.toLowerCase() === method.toLowerCase();
  },

  registerComponentRESTfulRoutes (componentName, component, server) {

    const componentsDefConfig = _.get(restops, 'config.components', {});
    // Rename default config's `restfulRouteOptions` key to use it as fallback
    restops.utils.object.renameKey(componentsDefConfig, 'restfulRouteOptions', 'defRestfulRouteOptions');
    // console.log(util.inspect({componentsDefConfig}, false, null, true ))

    const componentConfig = _.get(component, 'options', {});
    // console.log(util.inspect({componentConfig}, false, null, true ))

    const config = _.merge(_.cloneDeep(componentsDefConfig), componentConfig);
    // console.log(util.inspect({config}, false, null, true ))

    if(!config.rest) return;

    const model = restops.components[component.name].model;

    if(!model) return;

    const baseHandler = require(join(__basedir, 'core', 'base', 'handler'))(model);
    const componentHandlerPath = join(restops.config.components.dir,  `${component.name}.handler.js`);

    let componentHandler;
    if(fs.existsSync(componentHandlerPath)) {
      componentHandler = require(componentHandlerPath);
    }
    const handler = _.merge(_.cloneDeep(baseHandler), componentHandler || {});


    console.log(util.inspect({handler}, false, null, true ))

    const crud = require('./routes/crud')(server, component.name, handler, config);

    // console.log(crud.routes)
    const registrations = []; // Unique routes to be registered

    crud.routes.forEach(route => {
      if(!Components.componentRoutePathExists(component.name, route.path, route.method, config.prefix)) {
        registrations.push({
          method: route.method,
          path: route.path,
          handler: route.handler,
          options: route.options
        });
      }
    });

    // crud.routes.forEach(crudRoute => {
    //   const existing = _.find(existingRoutes, item => {
    //     return item.method === crudRoute.method && item.path === crudRoute.path;
    //   })
    //
    //   if(!existing) {
    //     registrations.push(crudRoute);
    //   }
    //
    // })

    // console.log(util.inspect({registrations}, false, null, true ))

    registrations.forEach(registration => {
      server.route({
        method: registration.method,
        path: registration.path,
        handler: registration.handler,
        options: registration.options
      })
    })
  },

}

module.exports = Components;
