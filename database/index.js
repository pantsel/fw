const mongoose = require('mongoose');
const connectionString = process.env.MONGOOSE_URL || `mongodb://localhost:27017/restops`;
const seedEntities = [
  {
    name: 'Users',
    model: restops.models.user,
    seedData: process.env.USERS_SEED_DATA || require('./seeds/users')
  }
]


const Database = {
  init: async () => {
    try {
      await Database.connect();
      console.log(`Connected to database`);
      await Database.seed();
    }catch (e) {
      console.error(e);
    }
  },

  connect: async () => {
    return mongoose.connect(connectionString, {useNewUrlParser: true, useCreateIndex: true});
  },

  seed: async () => {
    for(const entity of seedEntities) {
      if(await entity.model.countDocuments() < 1) {
        await entity.model.create(entity.seedData);
        console.log(`${entity.name} seeded`);
      }
    }
  }
}

module.exports = Database;
