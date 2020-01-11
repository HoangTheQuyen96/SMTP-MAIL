const moment = require('moment');
const mongo = require('../core/mongo.config');
const uuidSrv = require('../helper/uuid.helper');
const logger = require('../core/logger');
const sendEmail = require('../helper/mailOp');

const COLLECTION_NAME = 'notifications';

const handlerMail = async payload => {
  try {
    const db = mongo.db();
    const coll = db.collection(COLLECTION_NAME);

    const uuid = await uuidSrv.getUuid();

    if (uuid.value instanceof Error) throw uuid.value;

    await coll.insertOne({
      _id: uuid.value,
      emails: payload.emails,
      content: payload.notification,
      created_at: moment.utc().format(),
      updated_at: moment.utc().format(),
    });

    await sendEmail.sendEmail(payload);
  } catch (error) {
    logger.warn(error);
  }
};

module.exports = {
  handlerMail,
};
