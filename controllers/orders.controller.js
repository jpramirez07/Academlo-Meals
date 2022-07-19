// Models
const { Meals } = require('../models/meal.model')
const { Restaurants } = require('../models/restaurant.model')
const { Orders } = require('../models/order.model')
const { Users } = require('../models/user.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

const getAllOrders = catchAsync(async (req, res, next) => {
	const { sessionUser } = req
	const orders = await Users.findOne({
        where: {id: sessionUser.id},
        include: {model: Orders, include: {model: Meals, include: Restaurants}}
    });

	res.status(200).json({
		status: 'success',
		orders
	});
});

const createOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
	const { quantity, mealId } = req.body;

	const meal = await Meals.findOne({ 
        where: {id: mealId},
    })

	if (meal === null){
		return next(new AppError('Meal not found', 404))
	}

	const newOrder = await Orders.create({
		quantity,
		mealId,
		userId: sessionUser.id,
		totalPrice: meal.price * quantity
	})

	res.status(201).json({
		status: 'success',
		newOrder
	});
});

const updateOrder = catchAsync(async (req, res, next) => {
	const { order } = req

	await order.update({ status: "Completed" });

	res.status(204).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
	const { order } = req;

	// await user.destroy();
	await order.update({ status: 'Cancelled' });

	res.status(204).json({ status: 'success' });
});

module.exports = {
	getAllOrders,
	createOrder,
	updateOrder,
	deleteOrder
}