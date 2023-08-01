const cardInfo = require('../models/card');
const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../errors/err');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');

module.exports.getCards = (req, res, next) => {
  cardInfo
    .find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => {
      next(new NotFound('Карточки не найдены'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardInfo
    .create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardInfo
    .findByIdAndRemove(req.params.cardId, { runValidators: true })
    .orFail(() => {
      next(new NotFound('По указанному _id карточка не найденa'));
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        cardInfo.deleteOne(card)
          .then(res.status(STATUS_OK).send(card));
      } else {
        res.status(403).send({ message: 'Эта карточка другого пользователя' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.addLikeCard = (req, res, next) => {
  cardInfo
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      next(new NotFound('По указанному _id карточка не найденa'));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.removelikeCard = (req, res, next) => {
  cardInfo
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      next(new NotFound('По указанному _id карточка не найденa'));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
