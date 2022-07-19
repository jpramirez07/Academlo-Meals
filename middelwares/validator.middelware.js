const { body, validationResult } = require('express-validator')

const { AppError } = require('../utils/appError.util')

const checkResult = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        // Array has errors
        const err = []
        const errorsArr = errors.array()
        for (i = 0; i < errorsArr.length; i++){
            err.push(errorsArr[i].msg)
        }
        const message = err.join(", ")
        return next(new AppError(message, 400))
    }
    next() 
}

const createUserValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('email').isEmail().withMessage('Most provide a valid email'), 
    body('password')
        .isLength({min: 8})
        .withMessage('password most be a least 8 characters')
        .isAlphanumeric()
        .withMessage('password most contain letters and numbers'),
    checkResult
]

const createRestaurantValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('adress')
        .notEmpty().withMessage('Adress cannot be empty')
        .isAlphanumeric().withMessage('Adress most contain letters and numbers'),
    body('rating').isNumeric().withMessage('Rating most be a number'),
    checkResult
]

const createMealsValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('price').isNumeric().withMessage('price most be a number'),
    checkResult
]

module.exports = {createUserValidators, createRestaurantValidators, createMealsValidators}