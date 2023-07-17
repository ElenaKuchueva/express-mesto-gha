const card = require("../models/card.js");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/err.js");


module.exports.getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка на сервере" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: "Переданы некорректные данные",
          });
        return;
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};



module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "По указанному _id карточка не найденa" });
      return;
    })
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "По указанному _id карточка не найденa" });
        return;
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

module.exports.addLikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "По указанному _id карточка не найденa" });
      return;
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
        return;
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

module.exports.removelikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "По указанному _id карточка не найденa" });
      return;
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
        return;
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};
