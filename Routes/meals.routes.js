const express = require('express');

// Controllers
const {
	getAllMeals,
    createMeal,
    deleteMeal,
    getMealById,
    updateMeal
} = require('../controllers/meals.controllers');

// Middlewares
const {
	createMealsValidators
} = require('../middelwares/validator.middelware');
const { restaurantExist } = require('../middelwares/resturant.middelware');
const { mealExist } = require('../middelwares/meal.middelware')
const {
	protectSession,
	protectUserAccount,
	protectAdminAccount
} = require('../middelwares/auth.middelware')

const mealsRouter = express.Router()

mealsRouter.get('/', getAllMeals)

mealsRouter.get(':id', mealExist, getMealById)

mealsRouter.use(protectSession)

mealsRouter.post('/:id', restaurantExist, createMealsValidators, createMeal)

mealsRouter
	.use('/:id', mealExist).use(protectAdminAccount)
	.route('/:id')
	.patch(updateMeal)
	.delete(deleteMeal);

module.exports = { mealsRouter };