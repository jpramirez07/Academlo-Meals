const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Users } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
	let token;

	// Extract the token from headers
	if (
		req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Invalid session', 403));
	}

	// Ask JWT (library), if the token is still valid
	const decoded = await jwt.verify(token, process.env.JWT_SECRET);
	// { id, ... }

	// Check in db that user still exists
	const user = await Users.findOne({
		where: { id: decoded.id, status: 'active' },
	});

	if (!user) {
		return next(
			new AppError('The owner of this token doesnt exist anymore', 403)
		);
	}

	// Grant access
	req.sessionUser = user;
	next();
});

const protectUserAccount = (req, res, next) => {
	// const { id } = req.params -> Alternative
	const { sessionUser, user } = req;

	// If the id's don't match, return error (403)
	if (sessionUser.id !== user.id) {
		return next(new AppError('You do not own this account', 403));
	}

	next();
};

const protectAdminAccount = (req, res, next) => {
	// const { id } = req.params -> Alternative
	const { sessionUser } = req;

	if (sessionUser.role !== "admin") {
		return next(new AppError('You are not ADMIN', 403));
	}

	next();
};

const protectReviews = (req, res, next) => {
	// const { id } = req.params -> Alternative
	const { sessionUser, review } = req;

	if (sessionUser.id !== review.userId) {
		return next(new AppError('This review it is not yours', 403));
	}

	next();
};

const protectOrders = (req, res, next) => {
	// const { id } = req.params -> Alternative
	const { sessionUser, order } = req;

	if (sessionUser.id !== order.userId) {
		return next(new AppError('This order it is not yours', 403));
	}

	next();
};


module.exports = { protectSession, protectUserAccount, protectAdminAccount, protectReviews, protectOrders }