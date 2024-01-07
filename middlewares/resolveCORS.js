const allowedCors = [
  'https://inter.s.15.nomoredomainsmonster.ru',
  'http://inter.s.15.nomoredomainsmonster.ru',
  'http://localhost:3000',
  'https://localhost:3000',
];

function resolveCORS(req, res, next) {
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;

  if (method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
      'Access-Control-Allow-Headers': requestHeaders,
    });
  }

  next();
}

module.exports = resolveCORS;
