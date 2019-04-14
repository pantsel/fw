module.exports = {

  dir: `${__basedir}/app/apis`,

  // Default routes prefix if not explicitly specified
  prefix: '',

  // Automatically generate RESTful API from components
  rest: true,

  // Default RESTful route options if not explicitly specified on a route
  // https://hapijs.com/api#route-options
  restfulRouteOptions: {
    auth: false
  }

}
