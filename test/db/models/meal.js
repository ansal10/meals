process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const assert = require('chai').assert;
const truncate = require('../truncate');
const mealFactory = require('../factories/meal');
const mealHelper = require('../../../utilities/helpers/meal_helper');
const userFactory = require('../factories/user');
const moment = require('moment');


describe('Meal model', () => {
    let meal;
    let user;

    beforeEach(async () => {
        await truncate();
        meal = await mealFactory();
        user = await userFactory();
    });

    it('should do something', async () => {
        await expect(12).to.equal(12)
    });

    it('should create meal with string form of rent', async()=>{
        let h = await mealFactory({rent:'1212'});
        assert(h.rent === 1212);

    });

    it('should search for meal', async () => {
        let a = [];
        for (let i = 0 ; i < 100 ; i++){
            // await mealFactory();
            a.push(mealFactory());
        }
        await Promise.all(a);

        let queryParams = {
            rent:[1,1000000],
            searchString: '',
            builtArea:[1,10000000],
            carpetArea:[1,10000000],
            city: [],
            locality: [],
            country: ['india'],
            address:'thsi is new',
            latitude: [-89, 89],
            longitude: [-179, 179],
            type:['1rk', '2rk', '1bhk', '2bhk', '3bhk'],
            availability: ['yes', 'no'],
            availableFor: ['all', 'family', 'couples', 'bachelors'],
            availableFrom: moment().add(-100, 'days').toISOString(),
            floor:[0,1,2,3,4,5,6,7,8,9],
            powerBackup: ['full', 'partial', 'no'],
        };
        let retVal = await mealHelper.searchMeal(user, queryParams);
    });
});