'use strict';
const sequelizeTransforms = require('sequelize-transforms');
const validator = require('validator');
const config = require('../../config/index');
const util = require('util');
const moment = require('moment');

Array.prototype.isArray = true;

module.exports = (DataType, Sequelize) => {
    const Meal = DataType.define('Meal', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            allowNull:false,
            trim: true,
            validate:{
                len:{
                    args: [10, 50],
                    msg: 'Title should be in range 10 to 50 words'
                }
            }
        },
        description: {
            type: Sequelize.STRING(1024),
            allowNull: false,
            trim: true,
            validate:{
                len:{
                    args: [10, 1000],
                    msg: 'Description should be in range 10 to 1000 words'
                }
            }
        },

        // calories
        calories:{
            type:Sequelize.DOUBLE,
            allowNull: false,
            toDouble: true,
            validate: {
                min:{
                    args: [1],
                    msg: 'Minimum calories should be 1'
                },
                max:{
                    args: [10000],
                    msg: 'Maximum calories 10000'
                }
            }

        },
        type:{
	        type:Sequelize.ENUM('breakfast', 'lunch', 'evening_snacks', 'dinner'),
            trim: true,
            validate:{
                isValidField: (val, next)=>{
                    if(!Meal.rawAttributes.type.values.includes(val))
                        return next('Type should be only '+ Meal.rawAttributes.type.values );
                    else next();
                }
            }
        },
        items: {  // [ 'closed parking', 'centraly air conditioned', '24 hour security' ]
            type: Sequelize.JSONB, // air conditioned
            defaultValue: [],
            validate:{
                isValidField: (val , next) => {
                    if(val && !val.isArray)
                        next('Invalid value in items, expect array of strings');
                    if(val.length > 50)
                        next('Item cannot be more than 50 length');
                    val.forEach((item) => {
                        if(!item.trim())
                            next('Empty values not valid in items');
                    });
                    next();
                }
            }
        },
        UserId:{
            type: Sequelize.INTEGER,
            references:{
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        time:{
            type: Sequelize.STRING,
            allowNull: false,
            toUTCTime: true
        },
        day:{
	        type: Sequelize.ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
            allowNull: false,
            toDay: true
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }

    });

    Meal.associate = function (models) {
        Meal.belongsTo(models.User)
    };

    sequelizeTransforms(Meal, {
        toDouble: (val, def) =>{
            return Number(val);
        },
        toUTCTime: (val, def) =>{
            moment(val).utc().format('HH:MM')
        },
        toDay: (val, def) => {
            moment(val).utc().format('dddd').toLowerCase()
        }
    });
    return Meal;
};