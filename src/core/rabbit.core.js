const amqp = require('amqplib');

const state = {
  /**
   * @type {amqp.connection}
   */
  connection: null,
  connected: true,
};

const TAG = '[AMQP]';

/**
 * Init AMQP connection
 * @param {*} amqpUrl
 * @param {*} options
 */
const connect = (amqpUrl, { logger = console }) =>
  new Promise(async (resolve, reject) => {
    try {
      const conn = await amqp.connect(amqpUrl);
      state.connection = conn;
      logger.info(`${TAG} connected to ${amqpUrl}`);

      conn.on('close', () => {
        logger.console.warn(`${TAG} connection close`);
      });
      resolve(state.connection);
    } catch (error) {
      reject(error);
      logger.error(`${TAG} unable to connect to ${amqpUrl}`);
    }
  });

module.exports = {
  connect,
  connection: () => state.connection,
};
