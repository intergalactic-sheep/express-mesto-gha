const User = require('../models/user');

let statusCode = 500;
let errorMessage = 'Ошибка на стороне сервера';

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Переданы некорректные данные';
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId ? req.params.userId : req.user._id,
    );
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError' && err.path === '_id') {
      statusCode = 404;
      errorMessage = 'Пользователь с указанным ID не найден';
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Переданы некорректные данные';
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, about } = req.body;
    const updatedUser = User.findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      { new: true },
    );
    return res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Переданы некорректные данные';
    } else if (err.name === 'CastError' && err.path === '_id') {
      statusCode = 404;
      errorMessage = 'Пользователь с указанным ID не найден';
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar } = req.body;
    const updatedUser = User.findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      { new: true },
    );
    return res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Переданы некорректные данные';
    } else if (err.name === 'CastError' && err.path === '_id') {
      statusCode = 404;
      errorMessage = 'Пользователь с указанным ID не найден';
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};
