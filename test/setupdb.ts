const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.promise = global.Promise;

/*
This file should be included in any test that interacts with our database.
*/

async function removeAllCollections() {
  const collections = mongoose.connection.collections;
  Object.keys(collections).forEach(async model => await collections[model].deleteMany());
}

async function dropAllCollections() {
  const collections = mongoose.connection.collections;
  Object.keys(collections).forEach(async model => {
      try {
        await collections[model].drop();
      } catch (error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message === "ns not found")
          return;
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (error.message.includes("a background operation is currently running"))
            return;

          if (error.message.includes("Cannot use a session that has ended"))
              return;
        console.log(error.message);
      }
  })
}

module.exports = {
  setupDB(databaseName: string, reset: boolean) {
    // Connect to Mongoose
    beforeAll(async () => {
      const url = `mongodb://mongo_serve:27017/${databaseName}`;
      await mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
    });

    // Cleans up database between each test if reset == true
    // Set to false if you build db in test
    afterEach(async () => {
      if (reset) {
          await removeAllCollections();
      }
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    });
  }
};
