const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  likeCard,
  deleteCard,
} = require('../controllers/cards');
const { cardIdValidation, cardValidation } = require('../middlewares/customValidation');

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidation, createCard);
cardRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardIdValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidation, likeCard);

module.exports = cardRouter;
