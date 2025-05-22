const createError = (message) => {
  return {
    success: false,
    status: 0,
    message,
  };
};

const createSuccess = (message, result) => {
  return {
    success: true,
    status: 1,
    message,
    result,
  };
};

module.exports = {
  createError,
  createSuccess,
};
