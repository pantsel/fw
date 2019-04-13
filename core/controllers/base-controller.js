const _ = require('lodash');
const Boom = require('boom');

module.exports = (Model) => {
  return {
    // List all documents
    list: async (req, h) => {
      try {
        return await Model.find();
      }catch (e) {
        return Boom.badImplementation(e.message)
      }
    },

    findById: async (req, h) => {
      try {
        return await Model.findById(req.params.id);
      }catch (e) {
        return Boom.badImplementation(e.message)
      }
    },

    create: async (req, h) => {
      try {
        return await Model.create(req.payload);
      }catch (e) {
        return Boom.badImplementation(e.message)
      }
    },

    update: async (req, h) => {
      try {
        return await Model.findByIdAndUpdate(req.params.id, _.omit(req.payload, ['_id']), {new: true});
      }catch (e) {
        return Boom.badImplementation(e.message)
      }
    },

    destroy: async (req, h) => {
      try {
        return await Model.deleteOne({_id: req.params.id});
      }catch (e) {
        return Boom.badImplementation(e.message)
      }
    },
  }
}
