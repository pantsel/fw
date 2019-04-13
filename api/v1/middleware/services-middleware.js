const Boom = require('boom');
const SwaggerParser   = require('swagger-parser');

module.exports = {
  validateOpenApiSchema: (req, h) => {
    console.log('middleware:validateOpenApiSchema called()');
    return new Promise((resolve, reject) => {
      SwaggerParser.validate(req.payload, function(err, api) {
        if (err) {
          console.log('middleware:validateOpenApiSchema error', err);
          return reject(Boom.badRequest('Invalid openAPI schema'));
        } else {
          console.log("middleware:validateOpenApiSchema success: API name: %s, Version: %s", api.info.title, api.info.version);
          return  resolve(req);
        }
      });
    })


  }
}
