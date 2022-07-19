const {Orders} = require('../models/order.model')

const {AppError} = require('../utils/appError.util')
const {catchAsync} = require('../utils/catchAsync.util')

const orderExist = catchAsync(async (req, res, next) => {
    const {id} = req.params

    const order = await Orders.findOne({ 
        where: {id, status: "active"}
    })

	if (order === null){
		return next(new AppError('Order not found', 404))
	}

    req.order = order

    next()
})

const orderInUserExist = catchAsync(async (req, res, next) => {
    const { order, sessionUser } = req

	if (order.userId !== sessionUser.id){
		return next(new AppError('This order has not for this user', 404))
	}

    next()
})

module.exports = {orderExist, orderInUserExist}