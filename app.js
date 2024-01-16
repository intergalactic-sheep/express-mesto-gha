require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes/index');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler');
const { signinValidation, signupValidation } = require('./middlewares/customValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const resolveCORS = require('./middlewares/resolveCORS');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(resolveCORS);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', signupValidation, createUser);
app.post('/signin', signinValidation, login);
app.use(auth, router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
