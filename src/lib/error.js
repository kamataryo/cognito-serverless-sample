const createError = (statusCode, message) => {
  return JSON.stringify({
    statusCode,
    body: { message }
  });
};

module.exports = createError;
