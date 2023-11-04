const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');

let statusCode = ERROR_CODE.SERVER_ERROR;
let errorMessage = 'Ошибка на стороне сервера';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const newCard = new Card(req.body);
  newCard.owner = req.user._id;
  newCard
    .save()
    .then((createdCard) => res.status(ERROR_CODE.CREATED).send(createdCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        statusCode = ERROR_CODE.BAD_REQUEST;
        errorMessage = 'Переданы некорректные данные';
      }
      res.status(statusCode).send({ message: errorMessage });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        statusCode = ERROR_CODE.NOT_FOUND;
        errorMessage = 'Карточка с указанным ID не найдена';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.status(ERROR_CODE.OK).send(cardToDelete);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        statusCode = ERROR_CODE.BAD_REQUEST;
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
    .then((card) => {
      if (!card) {
        statusCode = ERROR_CODE.NOT_FOUND;
        errorMessage = 'Карточка с указанным ID не найдена';
        res.status(statusCode).send({ message: errorMessage });
      } else {
        res.status(ERROR_CODE.OK).send(card);
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
