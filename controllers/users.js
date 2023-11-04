const User = require('../models/user');
const { ERROR_CODE } = require('../utils/constants');

let statusCode = ERROR_CODE.SERVER_ERROR;
let errorMessage = 'Ошибка на стороне сервера';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        statusCode = ERROR_CODE.NOT_FOUND;
        errorMessage = 'Пользователь с указанным ID не найден';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        statusCode = ERROR_CODE.BAD_REQUEST;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then((createdUser) => res.status(ERROR_CODE.CREATED).send(createdUser))
    .catch((err) => {
      if (err.name === 'CastError') {
        statusCode = ERROR_CODE.BAD_REQUEST;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        statusCode = ERROR_CODE.NOT_FOUND;
        errorMessage = 'Пользователь с указанным ID не найден';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        statusCode = ERROR_CODE.BAD_REQUEST;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        statusCode = ERROR_CODE.NOT_FOUND;
        errorMessage = 'Пользователь с указанным ID не найден';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        statusCode = ERROR_CODE.BAD_REQUEST;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};
