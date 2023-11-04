const User = require('../models/user');

let statusCode = 500;
let errorMessage = 'Ошибка на стороне сервера';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      }

      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        statusCode = 404;
        errorMessage = 'Пользователь с указанным ID не найден';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        statusCode = 400;
        errorMessage = 'Пользователь с указанным ID не найден';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
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
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      } else if (err.name === 'CastError' && err.path === '_id') {
        statusCode = 404;
        errorMessage = 'Пользователь с указанным ID не найден';
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      } else if (err.name === 'CastError' && err.path === '_id') {
        statusCode = 404;
        errorMessage = 'Пользователь с указанным ID не найден';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};
