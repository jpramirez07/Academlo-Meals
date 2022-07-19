// Models
const { Meals } = require('../models/meal.model')
const { Restaurants } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

const getAllMeals = catchAsync(async (req, res, next) => {
	const meals = await Meals.findAll({
        where: {status: "active"},
        include: Restaurants
    });

	res.status(200).json({
		status: 'success',
		meals
	});
});

const getMealById = catchAsync(async (req, res, next) => {
	const {meal} = req

	res.status(200).json({
		status: 'success',
		meal
	});
});

const createMeal = catchAsync(async (req, res, next) => {
    const { restaurant } = req
	const { name, price } = req.body;

	const newMeal = await Meals.create({
		name,
		price,
        restaurantId: restaurant.id
	});

	res.status(201).json({
		status: 'success',
		newMeal
	});
});

const updateMeal = catchAsync(async (req, res, next) => {
	const { meal } = req;
	const { name, price } = req.body;

	await meal.update({ name, price });

	res.status(204).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
	const { meal } = req;

	// await user.destroy();
	await meal.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

module.exports = {
	getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal
}