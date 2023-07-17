const userInfo = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/err');

module.exports.getUsers = (req, res) => {
  userInfo.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.getUserInfo = (req, res) => {
  userInfo.findById(req.params.id)
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'По указанному _id пользователь не найден' });
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

module.exports.createUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  userInfo.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
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

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  userInfo.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userInfo.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
