module.exports = {

  // Default routes prefix if not explicitly specified
  prefix: '',

  // Automatically generate RESTful API from components
  rest: true,

  // Default RESTful route options if not explicitly specified
  // https://hapijs.com/api#route-options
  restfulRouteOptions: {
    auth: false
  }

}
