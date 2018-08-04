const wrap = require('decorator-wrap').wrap;
const validator = require('validator');
const models = require('../../db/models/index');
const hashlib = require('hash.js');

const validateNewMealParams = async (mealParams) => {
    let retVal = { status: null, message: ''};
    let errorMessage = null
    if(!mealParams.title || validator.trim(mealParams.title.length,'') > 50 || validator.trim(mealParams.title.length,'') < 10)
        errorMessage = 'Title should be present with min length of 10 and max of 50'

    if(!mealParams.description || validator.trim(mealParams.description.length,'') > 250 || validator.trim(mealParams.description.length,'') < 50)
        errorMessage = 'Description should be present with min length of 50 and max of 250'

    if(!Number(mealParams.rent) || Number(mealParams.rent) < 100)
        errorMessage = 'Rent should be at least 100$'

    if(mealParams.maintenance){
        for (let key, val in mealParams.maintenance){
            if(config.maintenance.includes(key)) {
                if (Number(val) < 0)
                    errorMessage = key + "should be 0 or greater"
            }else{
                errorMessage = key + " is not allowed in maintenance"
            }
        }
    }

    if (!Number(mealParams.builtArea) || Number(mealParams.builtArea)< 100)
        errorMessage = "Built Area cannot be lesser than 100 sq ft."

    if (!Number(mealParams.carpetArea) || Number(mealParams.carpetArea)< 100)
        errorMessage = "Capet Area cannot be lesser than 100 sq ft."


};