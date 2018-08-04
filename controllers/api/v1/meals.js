const express = require('express');
const mealHelper = require('../../../utilities/helpers/meal_helper');
const genUtil = require('../../../utilities/genutils/index');
const middlewares = require('../../../utilities/controller_middlewares');
const urlcodeJson = require('urlcode-json');

const router = express.Router();


router.post('/search', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let page = req.query.page || 0;

    let houses = await mealHelper.searchHouse(user, req.body || {}, page || 0);
    let prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + urlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
    let nextUrl = houses.length > 0 ? req.originalUrl.split("?")[0] + "?" + urlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;

    genUtil.sendJsonResponse(res, 200, '', houses, nextUrl, prevUrl);
});

router.get('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.houseDetails(user, req.params.id);
    genUtil.sendJsonResponse(res, retVal.status ? 200 : 400, retVal.message, retVal.args.house);
});

router.put('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.updateHouse(user, req.body, req.params.id);
    genUtil.sendJsonResponse(res, retVal.status ? 200 : 400, retVal.message, null);
});

router.delete('/:id', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.deleteHouse(user, req.params.id);
    genUtil.sendJsonResponse(res, retVal.status ? 200 : 400, retVal.message, null)
});

router.post('/', middlewares.isAuthenticated, async (req, res, next) => {
    let user = req.session.user;
    let retVal = await mealHelper.createHouseInDatabase(user, req.body);
    genUtil.sendJsonResponse(res, retVal.status ? 201 : 400, retVal.message, retVal.args.house)
});

module.exports = router;