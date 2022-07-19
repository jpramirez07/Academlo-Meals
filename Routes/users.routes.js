const express = require('express');

// Controllers
const {
	getAllOrders,
    getOrderById,
	createUser,
	updateUser,
	deleteUser,
	login
} = require('../controllers/users.controller');

// Middlewares
const {
	createUserValidators
} = require('../middelwares/validator.middelware');
const { userExist } = require('../middelwares/user.middelware')
const { orderExist, orderInUserExist } = require('../middelwares/order.middelware')
const {
	protectSession,
	protectUserAccount,
} = require('../middelwares/auth.middelware')

const usersRouter = express.Router()

usersRouter.post('/singup', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/orders', getAllOrders);

usersRouter.get('/orders/:id', orderExist, orderInUserExist, getOrderById)

usersRouter
	.use('/:id', userExist).use(protectUserAccount)
	.route('/:id')
	.patch(updateUser)
	.delete(deleteUser);

module.exports = { usersRouter };