const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const { userIdValidation, userInfoValidation, avatarValidation } = require('../middlewares/customValidation');

userRouter.get('/', getUsers);
userRouter.get('/:id', userIdValidation, getUserById);
userRouter.get('/me', getUserById);
userRouter.patch('/me', userInfoValidation, updateUser);
userRouter.patch('/me/avatar', avatarValidation, updateUserAvatar);

module.exports = userRouter;
