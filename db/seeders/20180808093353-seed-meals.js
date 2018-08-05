'use strict';
const models = require('../models/index');
const _ = require('underscore');
const util = require('util');
const moment = require('moment');
const faker = require('faker');


const randomItems = () => {
    let items = ['Pastas', 'Chicken Curry', 'Potato Crush', 'Noodles', 'Rice Bown', 'KFC chicken', 'Burgers',
    'Egg curry', 'Dosa and utthappam', 'Candies', 'Wisky', 'Tomato soup', 'Mutton Pasanda'];
    let length = Math.floor(Math.random() * 4) + 4;
    let f = [];
    for (let i = 0; i < length; i++)
        f.push(_.sample(items));
    return f;
};

const randomTitle = () => {
    return _.sample([
        'Simple breakfast',
        'Heavy breakfast',
        'Vegan Breakfast',
        'Indian Breakfast',
        'Simple lunch',
        'Heavy eggs and chicken',
        'Loaded carbs',
        'Keto diet',
        'Something simple today',
        'Cold drinks and chips',
        'Cheat meals',
    ])
};

const randomDescription = () => {
    return _.sample([
        'Today breakfast is very simple',
        'Using keto diet today',
        'Mom cook good food today',
        'This is worst dinner i ever had',
        'Nothing new, crappy food',
        'This is goody items',
        'This is awesome dear'
    ])
};


module.exports = {
    up: async (queryInterface, Sequelize) => {

        const users = await models.User.findAll();

        let meals = [];
        for (let i = 0; i < 10000; i++) {
            let d = moment().add(Math.random()*10000 - 5000, 'minutes');
            let data = {
                "title": randomTitle(),
                "description": randomDescription(),
                "createdAt": d.toISOString(),
                'updatedAt': d.toISOString(),
                calories: Number(Number(Math.random()*1000 + 10).toFixed(0)),
                type: _.sample(models.Meal.rawAttributes.type.values),
                items: randomItems(),
                UserId: _.sample(users).id,
                time: d.format('HH:mm'),
                day: d.format('dddd'),
                date: d.format('YYYY-MM-DD')
            };
            meals.push(data);
        }

        try {
         return await models.Meal.bulkCreate(meals);
        }catch (e) {
            console.error(e);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Meals', null, {});
    }
};
