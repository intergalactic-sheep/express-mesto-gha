const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/errors');

const extractBearerToken = (header) => header.replace('Bearer', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизироваться'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизироваться'));
    return;
  }

  req.user = payload;

  next();
};
