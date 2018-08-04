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

const LIST_ALL_HOUSE_ATTRIBUTES = ['id', 'title', 'country', 'city', 'locality', 'rent', 'builtArea', 'latitude',
    'longitude', 'type', 'availability', 'images', 'UserId', 'availableFrom', 'tags',
    'updatedAt'];
const LIST_HOUSE_DETAILS_ATTRIBUTES = LIST_ALL_HOUSE_ATTRIBUTES.concat(['description', 'maintenance',
    'carpetArea', 'availableFor', 'floor', 'address', 'powerBackup', 'features', 'furnishingStatus', 'createdAt']);

const UPDATE_HOUSE_DETAILS_ATTRIBUTES = _.difference(LIST_HOUSE_DETAILS_ATTRIBUTES, ['id', 'createdAt', 'updatedAt', 'UserId']);

const Op = models.Sequelize.Op;
Array.prototype.isArray = true;

const listAllMeal = async (user, params, page) => {
    // let params = {};
    let pageNumber = Number(page || 0);

    // await Object.keys(models.Meal.attributes).forEach(async (attr) => {
    //     if (searchParams[attr])
    //         params[attr] = searchParams[attr];
    // });

    if (!params.availability) params.availability = 'yes';


    let meals = await models.Meal.findAll({
        limit: config.pageLimit,
        offset: config.pageLimit * pageNumber,
        attributes: LIST_ALL_HOUSE_ATTRIBUTES,
        where: params,
        order: [
            // Will escape id and validate DESC against a list of valid direction parameters
            ['id', 'DESC'],
        ]
    });

    meals = _.map(meals, (h) => {
        if (h.images && h.images.length > 0)
            h.images = [h.images[0]];
        return h.dataValues;
    });

    for (let i = 0; i < meals.length; i++) {
        meals[i].edit = permission.canUpdateMeal(user, meals[i])
    }
    return meals;
};

const mealDetails = async (user, mealId) => {
    let meal = await models.Meal.findOne({where: {id: mealId}, attributes: LIST_HOUSE_DETAILS_ATTRIBUTES});
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
            mealParams = _.pick(mealParams, UPDATE_HOUSE_DETAILS_ATTRIBUTES);
            Object.assign(meal, meal, mealParams);
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
        mealParams = _.pick(mealParams, UPDATE_HOUSE_DETAILS_ATTRIBUTES);
        mealParams = Object.assign({}, mealParams, {UserId: user.id});
        try {
            let meal = await models.Meal.create(mealParams);
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

const searchMeal = async (user, searchParams, page) => {
    // searchable params

    let isValidArray = function (v) {
        return !!(v && v.length > 0);
    };

    try {

        let query = {};
        if (searchParams.searchString && searchParams.searchString.trim().length > 0) {
            let s = '%' + searchParams.searchString.trim() + '%';
            query = Object.assign({}, query, {
                [Op.or]: [
                    {title: {[Op.iLike]: s}},
                    {city: {[Op.iLike]: s}},
                    {locality: {[Op.iLike]: s}},
                    {country: {[Op.iLike]: s}}
                ]
            })
        }

        if (isValidArray(searchParams.rent)) {  // [1,1000]
            query = Object.assign({}, query, {
                rent: {
                    [Op.between]: searchParams.rent
                }
            });
        }
        if (isValidArray(searchParams.builtArea)) {
            query = Object.assign({}, query, {
                builtArea: {
                    [Op.between]: searchParams.builtArea
                }
            });
        }
        if (isValidArray(searchParams.carpetArea)) {
            query = Object.assign({}, query, {
                carpetArea: {
                    [Op.between]: searchParams.carpetArea
                }
            });
        }
        if (isValidArray(searchParams.city)) {
            query = Object.assign({}, query, {
                city: {
                    [Op.in]: searchParams.city
                }
            });
        }
        if (isValidArray(searchParams.locality)) {
            query = Object.assign({}, query, {
                locality: {
                    [Op.in]: searchParams.locality
                }
            });
        }
        if (isValidArray(searchParams.country)) {
            query = Object.assign({}, query, {
                country: {
                    [Op.in]: searchParams.country
                }
            });
        }
        if (isValidArray(searchParams.latitude)) {
            query = Object.assign({}, query, {
                latitude: {
                    [Op.between]: searchParams.latitude
                }
            });
        }
        if (isValidArray(searchParams.longitude)) {
            query = Object.assign({}, query, {
                longitude: {
                    [Op.between]: searchParams.longitude
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
        if (isValidArray(searchParams.availability)) {
            query = Object.assign({}, query, {
                availability: {
                    [Op.in]: searchParams.availability
                }
            });
        }

        if (isValidArray(searchParams.availableFor)) {
            query = Object.assign({}, query, {
                availability: {
                    [Op.in]: searchParams.availability
                }
            });
        }
        if (isValidArray(searchParams.availableFrom)) {
            query = Object.assign({}, query, {
                availableFrom: {
                    [Op.gte]: searchParams.availableFrom
                }
            });
        }
        if (isValidArray(searchParams.floor)) {
            query = Object.assign({}, query, {
                floor: {
                    [Op.in]: searchParams.floor
                }
            });
        }
        if (isValidArray(searchParams.powerBackup)) {
            query = Object.assign({}, query, {
                powerBackup: {
                    [Op.in]: searchParams.powerBackup
                }
            });
        }
        if (isValidArray(searchParams.furnishingStatus)) {
            query = Object.assign({}, query, {
                furnishingStatus: {
                    [Op.in]: searchParams.furnishingStatus
                }
            });
        }
        if (isValidArray(searchParams.UserId)) {
            query = Object.assign({}, query, {
                UserId: {
                    [Op.in]: searchParams.UserId
                }
            })
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

module.exports.listAllMeal = listAllMeal;
module.exports.mealDetails = mealDetails;
module.exports.updateMeal = updateMeal;
module.exports.createMealInDatabase = createMealInDatabase;
module.exports.searchMeal = searchMeal;
module.exports.deleteMeal = deleteMeal;
