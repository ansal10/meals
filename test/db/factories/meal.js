const faker = require('faker');
const models = require('../../../db/models/index');
const moment = require('moment');
const _ = require('underscore');
/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
    let d = moment().add(faker.random.number()%10000 - 5000, 'minutes');
    const defaultProps = {
        title: faker.name.findName() + faker.name.findName(),
        description: "This is just a test desription that will check what is valid description here around",
        calories: faker.random.number()%10000,
        type: _.sample(['breakfast', 'lunch', 'dinner', 'snacks']),
        items: ['Eggs', 'Chicken'],
        time: d.format('HH:mm'),
        day: d.format('dddd'),
        date: d.format('YYYY-MM-DD'),
    };
    return Object.assign({}, defaultProps, props);
};

/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
module.exports = async (props = {}) =>
    models.Meal.create(await data(props));