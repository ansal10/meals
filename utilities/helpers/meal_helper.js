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

const listAllHouse = async (user, params, page) => {
    // let params = {};
    let pageNumber = Number(page || 0);

    // await Object.keys(models.House.attributes).forEach(async (attr) => {
    //     if (searchParams[attr])
    //         params[attr] = searchParams[attr];
    // });

    if (!params.availability) params.availability = 'yes';


    let houses = await models.House.findAll({
        limit: config.pageLimit,
        offset: config.pageLimit * pageNumber,
        attributes: LIST_ALL_HOUSE_ATTRIBUTES,
        where: params,
        order: [
            // Will escape id and validate DESC against a list of valid direction parameters
            ['id', 'DESC'],
        ]
    });

    houses = _.map(houses, (h) => {
        if (h.images && h.images.length > 0)
            h.images = [h.images[0]];
        return h.dataValues;
    });

    for (let i = 0; i < houses.length; i++) {
        houses[i].edit = permission.canUpdateMeal(user, houses[i])
    }
    return houses;
};

const houseDetails = async (user, houseId) => {
    let house = await models.House.findOne({where: {id: houseId}, attributes: LIST_HOUSE_DETAILS_ATTRIBUTES});
    if (house) {
        house = house.dataValues;
        house.edit = permission.canUpdateMeal(user, house);
        return {
            status: true,
            message: '',
            args: {house: house}
        }
    } else {
        return {
            status: false,
            message: util.format(config.MESSAGES.RESOURCE_NOT_FOUND, houseId),
            args: {}
        }
    }
};

const updateHouse = async (user, houseParams, houseId) => {
    let house = await models.House.findOne({where: {id: houseId}});
    if (house && permission.canUpdateMeal(user, house)) {

        try {
            houseParams = _.pick(houseParams, UPDATE_HOUSE_DETAILS_ATTRIBUTES);
            Object.assign(house, house, houseParams);
            await house.validate();
            await house.save();
            return {
                status: true,
                message: config.MESSAGES.RESOURCE_UPDATED_SUCCESSFULLY,
                args: {
                    house: house
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

const createHouseInDatabase = async (user, houseParams) => {
    if (permission.canCreateMeal(user)) {
        houseParams = _.pick(houseParams, UPDATE_HOUSE_DETAILS_ATTRIBUTES);
        houseParams = Object.assign({}, houseParams, {UserId: user.id});
        try {
            let house = await models.House.create(houseParams);
            return {
                status: true,
                message: config.MESSAGES.RESOURCE_CREATED_SUCCESSFULLY,
                args: {
                    house: house
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

const searchHouse = async (user, searchParams, page) => {
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

        return await listAllHouse(user, query, page);
    } catch (e) {
        return {
            status: false,
            message: 'Incompatible data passed',
            args: {}
        }
    }
};

const deleteHouse = async (user, houseId) => {
    let house = await models.House.findOne({where: {id: houseId}});
    if (house) {
        if (permission.canUpdateMeal(user, house)) {
            await house.destroy();
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
            message: util.format(config.MESSAGES.RESOURCE_NOT_FOUND, houseId)
        }
    }
};

module.exports.listAllHouse = listAllHouse;
module.exports.houseDetails = houseDetails;
module.exports.updateHouse = updateHouse;
module.exports.createHouseInDatabase = createHouseInDatabase;
module.exports.searchHouse = searchHouse;
module.exports.deleteHouse = deleteHouse;
