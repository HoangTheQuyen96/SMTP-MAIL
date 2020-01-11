const { MongoClient } = require('mongodb');

const state = {
  db: null,
  client: null,
};

const connect = (mongoUrl, { logger = console }) =>
  new Promise((resolve, reject) => {
    if (state.db) return resolve(state.db);

    return MongoClient.connect(
      mongoUrl,
      {
        useNewUrlParser: true,
      },
      (err, client) => {
        if (err) {
          logger.error('[MONGO] connected failure');
          return reject(err);
        }
        // set connection to state.connection
        state.db = client.db();
        state.client = client;
        logger.info('[MONGO] connected to: ', mongoUrl);
        return resolve(state.client);
      }
    );
  });

const close = () =>
  new Promise((resolve, reject) => { // eslint-disable-line
    state.db.close((err, result) => { // eslint-disable-line
      state.db = null;
      return resolve();
    });
  });

const db = () => state.db;

const client = () => state.client;

module.exports = {
  db,
  client,
  connect,
  close,
};
