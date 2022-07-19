const express = require('express');

// Controllers
const {
	createOrder,
    deleteOrder,
    getAllOrders,
    updateOrder
} = require('../controllers/orders.controller');

// Middlewares
const { orderExist } = require('../middelwares/order.middelware')
const {
	protectSession,
	protectOrders,
} = require('../middelwares/auth.middelware')

const orderRouter = express.Router()

orderRouter.use(protectSession)

orderRouter.get('/me', getAllOrders)

orderRouter.post('/', createOrder)

orderRouter
	.use('/:id', orderExist).use(protectOrders)
	.route('/:id')
	.patch(updateOrder)
	.delete(deleteOrder);

module.exports = { orderRouter };