const Joi = require("joi");

module.exports = schema => (req, res, next) => {
  const shemma = Joi.object(schema)
  const result = shemma.validate(req.body);

  if (result.error) {console.log(result)
    return res.status(400).send({ error: result.error.details[0].message });}


  next();
};
