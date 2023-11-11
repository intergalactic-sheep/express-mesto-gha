const { ERROR_CODE } = require('../utils/constants');

module.exports = class NoPermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE.FORBIDDEN;
  }
};
