const {Restaurants} = require('../models/restaurant.model')
const {Reviews} = require('../models/review.model')

const {AppError} = require('../utils/appError.util')
const {catchAsync} = require('../utils/catchAsync.util')

const restaurantExist = catchAsync(async (req, res, next) => {
    const {id} = req.params

    const restaurant = await Restaurants.findOne({ 
        where: {id},
        include: Reviews 
    })

	if (restaurant === null){
		return next(new AppError('Restaurant not found', 404))
	}

    req.restaurant = restaurant

    next()
})

module.exports = {restaurantExist}