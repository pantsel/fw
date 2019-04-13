
const pluralize = require('pluralize');
const _ = require('lodash');

module.exports = (server, name, handler, pluginOpts) => {

  const prefix = _.get(pluginOpts, 'prefix', '');
  const entity = _.get(pluginOpts, 'pluralize') ? pluralize(name): name;


  return {
    routes: [
      {
        method: 'get',
        path: `${prefix}/${entity}`,
        handler: handler.list,
        options: _.get(pluginOpts, 'restfulRouteOptions.list', pluginOpts.defRestfulRouteOptions)
      },

      {
        method: 'get',
        path: `${prefix}/${entity}/{id}`,
        handler: handler.findById,
        options: _.get(pluginOpts, 'restfulRouteOptions.findById', pluginOpts.defRestfulRouteOptions)
      },

      {
        method: 'post',
        path: `${prefix}/${entity}`,
        handler: handler.create,
        options:  _.get(pluginOpts, 'restfulRouteOptions.create', pluginOpts.defRestfulRouteOptions)
      },

      {
        method: 'patch',
        path: `${prefix}/${entity}/{id}`,
        handler: handler.update,
        options: _.get(pluginOpts, 'restfulRouteOptions.update', pluginOpts.defRestfulRouteOptions)
      },

      {
        method: 'delete',
        path: `${prefix}/${entity}/{id}`,
        handler: handler.destroy,
        options: _.get(pluginOpts, 'restfulRouteOptions.destroy', pluginOpts.defRestfulRouteOptions)
      }
    ]
  }


}
