
module.exports = (location, schema) => {
  return (req, res, next) => {

    const { error, value  } = schema.validate(req[location], { abortEarly: false });

    if (!error) {
      req[location] = value;
      return next();
    }
    
    const errors = error.details.reduce((acc, { path, message }) => {
      const key = path.join('.');
      acc[key] = message;
      return acc;
    }, {});

    return res.status(400).json({
      isSuccess: false,
      status: 'BAD_REQUEST',
      message: 'The request cannot be fulfilled due to bad syntax',
      data: errors,
    });
    
  };
};
