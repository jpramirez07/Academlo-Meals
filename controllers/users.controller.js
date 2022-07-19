const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Users } = require('../models/user.model')
const { Orders } = require('../models/order.model')
const { Restaurants } = require('../models/restaurant.model')
const { Meals } = require('../models/meal.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

const getAllOrders = catchAsync(async (req, res, next) => {
	const {sessionUser} = req
	const userOrders = await Users.findOne({ 
        where: {
			role: "normal", 
			id: sessionUser.id}, 
        include: {model: Orders, include: {model: Meals, include: Restaurants}}
    });

	userOrders.password = undefined

	res.status(200).json({
		status: 'success',
		userOrders,
	});
});

const getOrderById = catchAsync(async (req, res, next) => {
	const {order} = req

	res.status(200).json({
		status: 'success',
		order
	});
});

const createUser = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body;

	// Hash password
	const salt = await bcrypt.genSalt(12);
	const hashPassword = await bcrypt.hash(password, salt);

	const newUser = await Users.create({
		name,
		email,
		password: hashPassword,
	});

	// Remove password from response
	newUser.password = undefined;

	res.status(201).json({
		status: 'success',
		newUser,
	});
});

const updateUser = catchAsync(async (req, res, next) => {
	const { user } = req;
	const { name, email } = req.body;

	await user.update({ name, email });

	res.status(204).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { user } = req;

	// await user.destroy();
	await user.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate credentials (email)
	const user = await Users.findOne({
		where: {
			email,
			status: 'active',
		},
	});

	if (!user) {
		return next(new AppError('Credentials invalid', 400));
	}

	// Validate password
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return next(new AppError('Credentials invalid', 400));
	}

	// Generate JWT (JsonWebToken) ->
	const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	// Send response
	res.status(200).json({
		status: 'success',
		token,
	});
});

module.exports = {
	getAllOrders,
	getOrderById,
	createUser,
	updateUser,
	deleteUser,
	login,
};
