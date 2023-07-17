const aboutUserRouter = require('express').Router();
const {
  getUsers, getUserInfo, createUserInfo, updateUserInfo, updateAvatar,
} = require('../controllers/users');

aboutUserRouter.get('/', getUsers);
aboutUserRouter.get('/:id', getUserInfo);
aboutUserRouter.post('/', createUserInfo);
aboutUserRouter.patch('/me', updateUserInfo);
aboutUserRouter.patch('/me/avatar', updateAvatar);

module.exports = aboutUserRouter;
