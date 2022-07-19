const {Orders} = require('../models/order.model')
const {Users} = require('../models/user.model')
const {Restaurants} = require('../models/restaurant.model')
const {Meals} = require('../models/meal.model')

const {AppError} = require('../utils/appError.util')
const {catchAsync} = require('../utils/catchAsync.util')

const userExist = catchAsync(async (req, res, next) => {
    const {id} = req.params

    const user = await Users.findOne({ 
        where: {id}
    })

	if (user === null){
		return next(new AppError('User not found', 404))
	}

    req.user = user

    next()
})

module.exports = {userExist}