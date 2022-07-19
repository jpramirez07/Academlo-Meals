const {Meals} = require('../models/meal.model')
const {Restaurants} = require('../models/restaurant.model')

const {AppError} = require('../utils/appError.util')
const {catchAsync} = require('../utils/catchAsync.util')

const mealExist = catchAsync(async (req, res, next) => {
    const {id} = req.params

    const meal = await Meals.findOne({ 
        where: {id},
        include: Restaurants
    })

	if (meal === null){
		return next(new AppError('Meal not found', 404))
	}

    req.meal = meal

    next()
})

module.exports = {mealExist}