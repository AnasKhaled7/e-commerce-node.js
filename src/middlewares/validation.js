const isValid = (schema) => {
  return (req, res, next) => {
    const requests = { ...req.body, ...req.params, ...req.query };

    const validationResult = schema.validate(requests, { abortEarly: false });

    if (validationResult.error) {
      const messages = validationResult.error.details.map(
        (error) => error.message
      );
      return res.status(400).json({ success: false, messages });
    }

    return next();
  };
};

export default isValid;
