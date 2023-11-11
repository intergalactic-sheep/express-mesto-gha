const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes/index');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler');
const { signinValidation, signupValidation } = require('./middlewares/customValidation');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth, router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
