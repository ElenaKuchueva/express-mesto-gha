const cardInfo = require('../models/card');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/err');

module.exports.getCards = (req, res) => {
  cardInfo.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardInfo.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные',
          });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  cardInfo.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'По указанному _id карточка не найденa' });
    })
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'По указанному _id карточка не найденa' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.addLikeCard = (req, res) => {
  cardInfo.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'По указанному _id карточка не найденa' });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.removelikeCard = (req, res) => {
  cardInfo.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'По указанному _id карточка не найденa' });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
