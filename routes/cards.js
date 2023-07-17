const aboutCardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, addLikeCard, removelikeCard,
} = require('../controllers/cards');

aboutCardRouter.get('/', getCards);
aboutCardRouter.post('/', createCard);
aboutCardRouter.delete('/:cardId', deleteCard);
aboutCardRouter.put('/:cardId/likes', addLikeCard);
aboutCardRouter.delete('/:cardId/likes', removelikeCard);

module.exports = aboutCardRouter;
