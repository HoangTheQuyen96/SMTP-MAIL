const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const logger = require('../src/core/logger');

const app = express();
const mongo = require('../src/core/mongo.config');
const messageBroker = require('./core/messageBroker');
const rabbitConf = require('./core/rabbit.core');
const handler = require('./handlers/handler');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  err.status = 404;
  next(err);
});
// eslint-disable-next-line
app.use((err, req, res, next) =>
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  })
);

const startServer = async () => {
  try {
    await mongo.connect(config.get('mongoDbUrl'), { logger });

    await rabbitConf.connect(config.get('rabbitUrl'), {
      logger,
    });

    await messageBroker.init(
      rabbitConf.connection(),
      config.get('amqpDefinitions')
    );

    await messageBroker.addConsumer(
      'email-notification-q',
      msg => {
        const payload = JSON.parse(msg.content);
        handler.handlerMail(payload);
      },
      {
        noAck: true,
      }
    );

    app.listen(config.get('port'), err => {
      if (err) throw err;
      logger.log(`[MAIN] server is running on port : ${config.get('port')}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
