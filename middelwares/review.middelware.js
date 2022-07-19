const { Reviews } = require('../models/review.model')

const {AppError} = require('../utils/appError.util')
const {catchAsync} = require('../utils/catchAsync.util')

const reviewExist = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const review = await Reviews.findOne({ 
        where: {id}
    })

	if (review === null){
		return next(new AppError('Review not found', 404))
	}

    req.review = review

    next()
})

module.exports = {reviewExist}