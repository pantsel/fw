module.exports = (Model) => {
  return {
    // List all documents
    list: async (req, h) => {
      return await Model.find();
    },

    findOne: async (req, h) => {
      return await Model.findById(req.params.id);
    },

    create: async (req, h) => {
      return await Model.create(req.payload);
    },
  }
}
