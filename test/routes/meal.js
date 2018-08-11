process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = require('chai').assert;
const should = chai.should();
const truncate = require('../db/truncate');
const moment = require('moment');
const faker = require('faker');
const mealFactory = require('../db/factories/meal');
const userFactory = require('../db/factories/user');
const hashlib = require('hash.js');
const sinon = require('sinon');
const controllerMiddleware = require('../../utilities/controller_middlewares');
const models = require('../../db/models/index');
const server = require('../../app');
const request = require('supertest');
const _ = require('underscore');

chai.use(chaiHttp);

describe('Meals', async () => {

    let d = moment().add(faker.random.number()%10000 - 5000, 'minutes');
    let defaultMealParams = {
        title: faker.name.findName() + faker.name.findName(),
        description: "This is just a test desription that will check what is valid description here around",
        calories: faker.random.number()%10000,
        type: _.sample(['breakfast', 'lunch', 'dinner', 'snacks']),
        items: ['Eggs', 'Chicken'],
        time: d.format('HH:mm'),
        day: d.format('dddd'),
        date: d.format('YYYY-MM-DD'),
    };
    let user = null;
    const authenticatedUser = request.agent(server);

    beforeEach(async () => {
        await truncate();
        user = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: hashlib.sha256('1234'+ '1234').digest('hex')},
            role: 'admin'
        });
        let res = await await authenticatedUser
            .post('/api/v1/user/login')
            .send({"email": user.email, "password": "1234"});

    });

    describe('/search POST Search meals', async () => {

        it('it should return all meals of user successful', async () => {
            await mealFactory({UserId: user.id});
            await mealFactory({UserId: user.id});
            let res = await authenticatedUser
                .post('/api/v1/meal/search')
                .send({});
            res.should.have.status(200);
            assert(res.body.success.data.length === 2);
        });
        it('it should return no property', async () => {
            let res = await authenticatedUser
                .post('/api/v1/meal/search');
            res.should.have.status(200);
            assert(res.body.success.data.length === 0);
        });
        it('should search based on custom params', async () => {
            let res = await authenticatedUser
                .post('/api/v1/meal/search')
                .send({
                    rent:[1,10000],
                    floor: [1, 10]
                });
            res.should.have.status(200);
        });
        it('should search meals for admin', async () => {
            let u1 = await userFactory({role: 'consumer', calorieGoal:1000});
            let u2 = await userFactory({role: 'consumer', calorieGoal: 2000});
            await mealFactory({UserId: u1.id});
            await mealFactory({UserId: u2.id});

            let res = await authenticatedUser
                .post('/api/v1/meal/search');
            let body = res.body;
            res.should.have.status(200);
        });
    });

    describe('/ POST Meal', async () => {
        it('should create meal with successfull parameters', async() => {
            let res = await authenticatedUser.post('/api/v1/meal').send(defaultMealParams);
            res.should.have.status(201);
            if(res.body.error)
                console.log(res.body.error.message);

        });

        it('should report error for no calorie value', async () => {
            let res = await authenticatedUser.post('/api/v1/meal').send(Object.assign({}, defaultMealParams, {calories:null}));
            res.should.have.status(400);
            expect(res.body.error.message.includes('calories'));
        });

        it('should report error on invalid items', async () => {
            let params = Object.assign({}, defaultMealParams, {items: ['  ']});
            let res = await authenticatedUser.post('/api/v1/meal').send(params);
            res.should.have.status(400);
            expect(res.body.error.message.includes('Amenity'));
        });

        it('should report invalid type of data', async () => {
            let res = await authenticatedUser.post('/api/v1/meal').send(Object.assign({}, defaultMealParams, {type:"hug"}));
            res.should.have.status(400);
        });
    });

    describe('/:id DELETE', async () => {
        it('should delete the record successfully', async () => {
            let h = await mealFactory();
            let res = await authenticatedUser
                .delete('/api/v1/meal/'+h.id);
            res.should.have.status(200);
            expect( (await models.Meal.findOne({where:{id: h.id}})) == null)
        });

        it('should not delete the record successfully', async () => {
            let h = await mealFactory();
            let res = await authenticatedUser
                .delete('/api/v1/meal/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.Meal.findOne({where:{id: h.id}})) != null)
        });
    });

    describe('/:id PUT', async () => {
        it('should update the record successfully', async () => {
            let h = await mealFactory();
            let res = await authenticatedUser
                .put('/api/v1/meal/'+h.id)
                .send({rent:1001});
            res.should.have.status(200);
            let h2 = await models.Meal.findOne({where:{id: h.id}})
            expect(h2.rent === 1001)

        });

        it('should not delete the record successfully', async () => {
            let h = await mealFactory();
            let res = await authenticatedUser
                .put('/api/v1/meal/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.Meal.findOne({where:{id: h.id}})).rent === h.rent)
        });
    });




});
