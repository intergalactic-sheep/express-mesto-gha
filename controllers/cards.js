const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const {
  InaccurateDataError,
  NotFoundError,
  NoPermissionError,
} = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const newCard = new Card(req.body);
  newCard.owner = req.user._id;
  newCard
    .save()
    .then((createdCard) => res.status(ERROR_CODE.CREATED).send(createdCard))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (cardToDelete.owner.toString() !== req.user._id.toString()) {
        throw new NoPermissionError('У вас нет прав на удаление чужой карточки');
      }
      return cardToDelete.deleteOne();
    })
    .then(() => res.status(ERROR_CODE.OK).send({ message: 'Карточка была удалена' }))
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const likeMethod = req.method === 'PUT' ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [likeMethod]: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не была найдена');
      }
      return res.status(ERROR_CODE.OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new InaccurateDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
