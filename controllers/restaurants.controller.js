const dotenv = require('dotenv');

// Models
const { Restaurants } = require('../models/restaurant.model');
const { Reviews } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

const getAllRestaurants = catchAsync(async (req, res, next) => {
	const restaurants = await Restaurants.findAll({ 
        where: {status: "active"},
		include: Reviews
    });

	res.status(200).json({
		status: 'success',
		restaurants
	});
});

const getResturantById = catchAsync(async (req, res, next) => {
	const {restaurant} = req

	res.status(200).json({
		status: 'success',
		restaurant
	});
});

const createRestaurants = catchAsync(async (req, res, next) => {
	const { name, adress, rating } = req.body;

	const newRestaurant = await Restaurants.create({
		name,
        adress,
        rating
	});

	res.status(201).json({
		status: 'success',
		newRestaurant
	});
});

const updateRestaurants = catchAsync(async (req, res, next) => {
	const { restaurant } = req;
	const { name, adress } = req.body;

	await restaurant.update({ name, adress });

	res.status(204).json({ status: 'success' });
});

const deleteRestaurants = catchAsync(async (req, res, next) => {
	const { restaurant } = req;

	// await user.destroy();
	await restaurant.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

const createReviews = catchAsync(async (req, res, next) => {
	const { comment, rating } = req.body
    const { sessionUser, restaurant } = req

	const newReview = await Reviews.create({
		comment,
        rating,
        restaurantId: restaurant.id,
        userId: sessionUser.id
	});

	res.status(201).json({
		status: 'success',
		newReview
	});
});

const updateReviews = catchAsync(async (req, res, next) => {
	const { review } = req
    const { comment, rating } = req.body;

	await review.update({ comment, rating });

	res.status(204).json({ status: 'success' });
});

const deleteReviews = catchAsync(async (req, res, next) => {
	const { review } = req

	await review.update({ status: "deleted" });

	res.status(204).json({ status: 'success' });
});

module.exports = {
	getAllRestaurants,
    createRestaurants,
    getResturantById,
    updateRestaurants,
    deleteRestaurants,
    createReviews,
    updateReviews,
    deleteReviews
};