const express = require('express');
const mealHelper = require('../../../utilities/helpers/meal_helper');
const genUtil = require('../../../utilities/genutils/index');
const middlewares = require('../../../utilities/controller_middlewares');
const urlcodeJson = require('urlcode-json');

const router = express.Router();


router.post('/search', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let page = req.query.page || 0;

    let meals = await mealHelper.searchMeal(user, req.body || {}, page || 0);
    let prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + urlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
    let nextUrl = meals.length > 0 ? req.originalUrl.split("?")[0] + "?" + urlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;

    genUtil.sendJsonResponse(res, 200, '', meals, nextUrl, prevUrl);
});

router.get('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let meals = await mealHelper.searchMeal(user, {ids: [req.params.id]}, 0);
    if (meals.length === 1)
        genUtil.sendJsonResponse(res, 200, '', meals[0]);
    else
        genUtil.sendJsonResponse(res, 400, 'Unauthorized access');
});

router.put('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.updateMeal(user, req.body, req.params.id);
    genUtil.sendJsonResponse(res, retVal.status ? 200 : 400, retVal.message, null);
});

router.delete('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.deleteMeal(user, req.params.id);
    genUtil.sendJsonResponse(res, retVal.status ? 200 : 400, retVal.message, null)
});

router.post('/', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.createMealInDatabase(user, req.body);
    genUtil.sendJsonResponse(res, retVal.status ? 201 : 400, retVal.message, retVal.args.meal)
});

module.exports = router;
