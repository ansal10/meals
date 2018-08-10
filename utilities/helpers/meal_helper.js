const wrap = require('decorator-wrap').wrap;
const validator = require('validator');
const models = require('../../db/models/index');
const hashlib = require('hash.js');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const permission = require('../permisson_utility');
const _ = require('underscore');
const util = require('util');
const config = require('../../config/index');

const LIST_ALL_MEAL_ATTRIBUTES = ['id', 'title', 'description', 'calories', 'type', 'items', 'UserId', 'time',
	'day', 'date', 'createdAt', 'updatedAt'];
const LIST_MEAL_DETAILS_ATTRIBUTES = LIST_ALL_MEAL_ATTRIBUTES.concat([]);
const UPDATE_MEAL_DETAILS_ATTRIBUTES = _.difference(LIST_MEAL_DETAILS_ATTRIBUTES, ['id', 'createdAt', 'updatedAt', 'UserId']);

const Op = models.Sequelize.Op;

Array.prototype.isArray = true;

const isValidArray = function (v) {
	return !!(v && v.length > 0);
};

const listAllMeal = async (user, params, page) => {
	let pageNumber = Number(page || 0);

	let meals = await models.Meal.findAll({
		limit: config.pageLimit,
		offset: config.pageLimit * pageNumber,
		attributes: LIST_ALL_MEAL_ATTRIBUTES,
		where: params,
		order: [
			// Will escape id and validate DESC against a list of valid direction parameters
			['id', 'DESC'],
		]
	});

	meals = applyCaloriesData(user, meals);
	return meals;
};

const mealDetails = async (user, mealId) => {
	let meal = await models.Meal.findOne({where: {id: mealId}, attributes: LIST_MEAL_DETAILS_ATTRIBUTES});
	if (meal) {
		meal = meal.dataValues;
		meal.edit = permission.canUpdateMeal(user, meal);
		return {
			status: true,
			message: '',
			args: {meal: meal}
		}
	} else {
		return {
			status: false,
			message: util.format(config.MESSAGES.RESOURCE_NOT_FOUND, mealId),
			args: {}
		}
	}
};

const updateMeal = async (user, mealParams, mealId) => {
	let meal = await models.Meal.findOne({where: {id: mealId}});
	if (meal && permission.canUpdateMeal(user, meal)) {

		try {
			mealParams = _.pick(mealParams, UPDATE_MEAL_DETAILS_ATTRIBUTES);
			Object.assign(meal, meal, mealParams);

            let checkDuplicate = await models.Meal.count({
                where: {
                    UserId: user.id,
                    date: mealParams.date,
                    type: mealParams.type
                }
            });

            if (checkDuplicate > 0 && ['breakfast', 'lunch', 'dinner'].includes(mealParams.type.lowerCase()))
            	throw {errors: [{message: 'A meal type of ' + mealParams.type + ' already exist for date ' + mealParams.date}]};

			await meal.validate();
			await meal.save();
			return {
				status: true,
				message: config.MESSAGES.RESOURCE_UPDATED_SUCCESSFULLY,
				args: {
					meal: meal
				}
			}
		} catch (e) {
			return {
				status: false,
				message: e.errors[0].message,
				args: {}
			}
		}

	} else {
		return {
			status: false,
			message: config.MESSAGES.UNAUTHORIZED_ACCESS,
			args: {}
		}
	}
};

const createMealInDatabase = async (user, mealParams) => {
	if (permission.canCreateMeal(user)) {
		mealParams = _.pick(mealParams, UPDATE_MEAL_DETAILS_ATTRIBUTES);
		mealParams = Object.assign({}, mealParams, {UserId: user.id});
		try {
			let checkDuplicate = await models.Meal.count({
				where: {
					UserId: user.id,
					date: mealParams.date,
					type: mealParams.type
				}
			});
			if (checkDuplicate > 0 && ['breakfast', 'lunch', 'dinner'].includes(mealParams.type.lowerCase()))
				throw {errors: [{message: 'A meal type of ' + mealParams.type + ' already exist for date ' + mealParams.date}]};
			let meal = new models.Meal(mealParams);
			meal.validate();
			await meal.save();
			return {
				status: true,
				message: config.MESSAGES.RESOURCE_CREATED_SUCCESSFULLY,
				args: {
					meal: meal
				}
			}
		} catch (e) {
			return {
				status: false,
				message: e.message || e.errors[0].message,
				args: {}
			}
		}
	} else {
		return {
			status: false,
			message: config.MESSAGES.UNAUTHORIZED_ACCESS,
			args: {}
		}
	}
};

const searchMeal = async (user, searchParams, page) => {
	try {

		let query = {};

		if (isValidArray(searchParams.calories)) {  // [1,1000]
			query = Object.assign({}, query, {
				rent: {
					[Op.between]: searchParams.rent
				}
			});
		}
		if (isValidArray(searchParams.type)) {
			query = Object.assign({}, query, {
				type: {
					[Op.in]: searchParams.type
				}
			});
		}
		if (isValidArray(searchParams.time)) {  // [03:21,12:12]
			query = Object.assign({}, query, {
				time: {
					[Op.between]: searchParams.time
				}
			});
		}
		if (isValidArray(searchParams.day)) {  // [sunday, monday, tuesday]
			query = Object.assign({}, query, {
				day: {
					[Op.in]: _.map(searchParams.day, (x) => {
						return x.toLowerCase()
					})
				}
			});
		}
		if (isValidArray(searchParams.date)) {  // [1,1000]
			query = Object.assign({}, query, {
				date: {
					[Op.in]: searchParams.date
				}
			});
		}
		if (isValidArray(searchParams.ids)){
			query = Object.assign({}, query, {
				id:{
					[Op.in]: searchParams.ids
				}
			})
		}
		let userIds = filterApplicableUserIds(user, searchParams.UserId);
		if (isValidArray(userIds)) {
			query = Object.assign({}, query, {  // only acceptable ids
				UserId: {
					[Op.in]: userIds
				}
			});
		}

		return await listAllMeal(user, query, page);
	} catch (e) {
		return {
			status: false,
			message: 'Incompatible data passed',
			args: {}
		}
	}
};

const deleteMeal = async (user, mealId) => {
	let meal = await models.Meal.findOne({where: {id: mealId}});
	if (meal) {
		if (permission.canUpdateMeal(user, meal)) {
			await meal.destroy();
			return {
				status: true,
				message: config.MESSAGES.RECORD_DELETED_SUCCESSFULLY
			}
		} else {
			return {
				status: false,
				message: config.MESSAGES.UNAUTHORIZED_ACCESS
			}
		}
	} else {
		return {
			status: false,
			message: util.format(config.MESSAGES.RESOURCE_NOT_FOUND, mealId)
		}
	}
};

const filterApplicableUserIds = async (user, userids) => {
	if (user.role === 'consumer')
		return [user.id];
	else if (user.role === 'manager') {
		let managee_users = await models.User.findAll({
			where: {
				managerId: {
					[Op.in]: userids
				}
			},
			attributes: ['id']
		});
		return _.map(managee_users, (u) => {
			return u.id;
		}).concat([user.id]);
	} else {
		if (isValidArray(userids))
			return userids;
		else return [];
	}
};

const applyCaloriesData = async (user, meals) =>{
    let dates = _.uniq(_.map(meals, (m) => m.date));
    let dailyData = await models.Meal.findAll({
        where: {
            date:{
                [Op.in]: dates
            }
        },
        attributes:[
            'date',
            [models.sequelize.fn('max', models.sequelize.col('calories')), 'dayCalories']
        ],
        group: 'date'
    });
    let dailyDataObj = {};
    dailyData.forEach((d)=>{
        dailyDataObj[d.dataValues.date] = d.dataValues.dayCalories;
    });


    for (let i = 0; i < meals.length; i++) {
        meals[i] = meals[i].dataValues;
        meals[i].edit = true;
        meals[i].dailyCalorieIntake = dailyDataObj[meals[i].date];
        meals[i].dailyyCalorieGoal = user.calorieGoal;
    }
    return meals;
};

module.exports.listAllMeal = listAllMeal;
module.exports.mealDetails = mealDetails;
module.exports.updateMeal = updateMeal;
module.exports.createMealInDatabase = createMealInDatabase;
module.exports.searchMeal = searchMeal;
module.exports.deleteMeal = deleteMeal;
