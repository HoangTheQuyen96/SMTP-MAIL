const generateSafeId = require('generate-safe-id');
const Result = require('folktale/result');

module.exports.getUuid = () => {
  const id = generateSafeId();
  return Promise.resolve(Result.Ok(id));
};
