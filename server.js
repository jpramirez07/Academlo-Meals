const { app } = require('./app');

// Models
const { Users } = require('./models/user.model')
const { Meals } = require('./models/meal.model')
const { Reviews } = require('./models/review.model')
const { Orders } = require('./models/order.model')
const { Restaurants } = require('./models/restaurant.model')

// Utils
const { db } = require('./utils/database.util');

db.authenticate()
	.then(() => console.log('Db authenticated'))
	.catch(err => console.log(err));

// Establish model's relations

// 1 User <----> M Reviews
Users.hasMany(Reviews, { foreignKey: 'userId' });
Reviews.belongsTo(Users);

// 1 User <----> M Orders
Users.hasMany(Orders, { foreignKey: 'userId' });
Orders.belongsTo(Users);

// 1 Restaurant <----> M Reviews
Restaurants.hasMany(Reviews, { foreignKey: 'restaurantId' });
Reviews.belongsTo(Restaurants);

// 1 Restaurant <----> M Meals
Restaurants.hasMany(Meals, { foreignKey: 'restaurantId' });
Meals.belongsTo(Restaurants);

// 1 Meal <----> 1 Order
Meals.hasOne(Orders, { foreignKey: 'mealId' });
Orders.belongsTo(Meals);

db.sync()
	.then(() => console.log('Db synced'))
	.catch(err => console.log(err));

app.listen(4000, () => {
	console.log('Express app running!!');
});
