const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userInfo = require('../models/user');

const {
  STATUS_OK,
} = require('../errors/err');

const BadRequest = require('../errors/badRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFound = require('../errors/notFound');

module.exports.getUsers = (req, res, next) => {
  userInfo
    .find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  userInfo
    .findById(req.params.id)
    .orFail(() => {
      next(new NotFound({ message: 'По указанному _id пользователь не найден' }));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest({ message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.getInfoAboutMe = (req, res, next) => {
  const userId = req.user._id;
  return userInfo
    .findById(userId)
    .orFail(() => {
      next(new NotFound({ message: 'По указанному _id пользователь не найден' }));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  userInfo
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      next(new NotFound({ message: 'Пользователь по указанному _id не найден' }));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest({ message: 'Некорректные данные при создании пользователя' }));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userInfo
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      next(new NotFound({ message: 'Пользователь по указанному _id не найден' }));
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest({ message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => userInfo.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        res
          .status(409)
          .send({ message: 'Пользователь с такой почтой зарегестрирован' });
      } else if (err.name === 'ValidationError') {
        next(new BadRequest({ message: 'Некорректные данные при создании пользователя' }));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userInfo
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.status(STATUS_OK).send({ token });
    })
    .catch(() => {
      next(new Unauthorized({ message: 'Необходима авторизация' }));
    });
};
