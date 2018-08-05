const faker = require('faker');
const hashlib = require('hash.js');
const _ = require('underscore');
const moment = require('moment');
module.exports = {
    up: async (queryInterface, Sequelize) => {

        let Users = [
            {
                name: 'Anas Admin',
                email: 'anas.ansal10@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: hashlib.sha256('pass1234' + '1234').digest('hex')
                }),
                role: 'admin',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
                calorieGoal: faker.random.number() % 100000
            },
            {
                name: 'Anas Manager',
                email: 'anasa.nsal10@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: hashlib.sha256('pass1234' + '1234').digest('hex')
                }),
                role: 'manager',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
                calorieGoal: faker.random.number() % 100000
            },
            {
                name: 'Anas User',
                email: 'anasan.sal10@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: hashlib.sha256('pass1234' + '1234').digest('hex')
                }),
                role: 'consumer',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
                calorieGoal: faker.random.number() % 100000
            }
        ];

        for (let i = 0; i < 100; i++) {
            Users.push({
                name: faker.name.findName(),
                email: faker.internet.email(),
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: hashlib.sha256('pass1234' + '1234').digest('hex')
                }),
                role: _.sample(['admin', 'manager', 'consumer']),
                status: _.sample(['active', 'inactive']),
                sex: _.sample(['male', 'female', 'other']),
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
	            calorieGoal: Number(Number(Math.random()*100000).toFixed(0)),
            })
        }
        try {
            return await queryInterface.bulkInsert('Users', Users, {});
        }catch (e) {
            console.error(e);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
