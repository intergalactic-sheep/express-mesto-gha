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
cardRouter.delete('/:id', cardIdValidation, deleteCard);
cardRouter.put('/:id/likes', cardIdValidation, likeCard);
cardRouter.delete('/:id/likes', cardIdValidation, likeCard);

module.exports = cardRouter;
