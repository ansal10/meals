'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Meals', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull:false
            },
            description: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },

            calories:{
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            type:{
                type:Sequelize.ENUM('breakfast', 'lunch', 'snacks', 'dinner', 'others')
            },
            items: {
                type: Sequelize.JSONB, // air conditioned
                defaultValue: []
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
            },
            day:{
                type: Sequelize.ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
                allowNull: false,
            },
            date:{
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then( async () =>{
	        await queryInterface.addIndex('Meals', ['calories'], {name: 'Meals_calories_index'});
	        await queryInterface.addIndex('Meals', ['type'], {name: 'Meals_type_index'});
	        await queryInterface.addIndex('Meals', ['time'], {name: 'Meals_time_index'});
	        await queryInterface.addIndex('Meals', ['day'], {name: 'Meals_day_index'});
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Meals').then( async () =>{

        });
    }
};