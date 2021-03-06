const mongoose = require('mongoose');
const connectionString = restops.config.custom.mongo.url;

const Database = {

  connect: async () => {
    return await mongoose.connect(connectionString, {useNewUrlParser: true, useCreateIndex: true});
  },

  seed: async () => {

    const seedEntities = [
      {
        name: 'Users',
        model: restops.components.user.model,
        seedData: process.env.USERS_SEED_DATA || require('./seeds/users')
      }
    ]

    for(const entity of seedEntities) {
      if(await entity.model.countDocuments() < 1) {
        await entity.model.create(entity.seedData);
        console.log(`${entity.name} seeded`);
      }
    }
  }
}

module.exports = Database;
