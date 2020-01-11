const Ajv = require('ajv');
const createError = require('http-errors');

module.exports = schema => async (req, res, next) => {
  try {
    // validate request body
    const ajv = new Ajv({
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
      verbose: true,
      errorDataPath: 'property',
    });

    const valid = ajv
      .addSchema(schema, 'bodySchema')
      .validate('bodySchema', req.body);

    if (!valid) {
      throw createError(422, 'validation error', {
        errors: ajv.errors.map(err => ({
          code: 422,
          message: `${err.dataPath.slice(1)} ${err.message}`,
        })),
      });
    }
    return await next();
  } catch (error) {
    return res.json(error);
  }
};
