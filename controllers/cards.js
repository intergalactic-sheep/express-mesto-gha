const Card = require('../models/card');

let statusCode = 500;
let errorMessage = 'Ошибка на стороне сервера';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const newCard = new Card(req.body);
  newCard.owner = req.user._id;
  newCard
    .save()
    .then((createdCard) => res.status(201).send(createdCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        statusCode = 404;
        errorMessage = 'Карточка с указанным ID не найдена';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.status(200).send(cardToDelete);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        statusCode = 404;
        errorMessage = 'Карточка с указанным ID не найдена';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  const likeMethod = req.method === 'PUT' ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [likeMethod]: { likes: req.user._id } },
    { new: true },
  )
    .then((likedCard) => {
      if (!likedCard) {
        statusCode = 404;
        errorMessage = 'Карточка с указанным ID не найдена';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.status(200).send(likedCard);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Переданы некорректные данные';
      } else if (err.name === 'CastError' && err.path === '_id') {
        statusCode = 404;
        errorMessage = 'Карточка с указанным ID не найдена';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};
