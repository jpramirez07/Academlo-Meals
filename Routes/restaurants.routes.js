const express = require('express');

// Controllers
const {
	createRestaurants,
    deleteRestaurants,
    getAllRestaurants,
    getResturantById,
    updateRestaurants,
    createReviews,
    deleteReviews,
    updateReviews
} = require('../controllers/restaurants.controller');

// Middlewares
const {
	createRestaurantValidators
} = require('../middelwares/validator.middelware');
const { reviewExist } = require('../middelwares/review.middelware')
const { restaurantExist } = require('../middelwares/resturant.middelware')
const {
	protectSession,
	protectAdminAccount,
	protectReviews
} = require('../middelwares/auth.middelware')

const restaurantsRouter = express.Router()

restaurantsRouter.get('/', getAllRestaurants);

restaurantsRouter.get('/:id',  restaurantExist, getResturantById)

restaurantsRouter.use(protectSession);

restaurantsRouter.post('/', createRestaurantValidators, createRestaurants)

restaurantsRouter.post('/reviews/:id', restaurantExist, createReviews)

restaurantsRouter
	.route('/reviews/:id')
	.patch(reviewExist, protectReviews, updateReviews)
	.delete(reviewExist, protectReviews, deleteReviews);

restaurantsRouter
	.use(protectAdminAccount)
	.route('/:id')
	.patch(restaurantExist, updateRestaurants)
	.delete(restaurantExist, deleteRestaurants)

module.exports = { restaurantsRouter };