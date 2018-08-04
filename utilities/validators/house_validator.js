const wrap = require('decorator-wrap').wrap;
const validator = require('validator');
const models = require('../../db/models/index');
const hashlib = require('hash.js');

const validateNewHouseParams = async (houseParams) => {
    let retVal = { status: null, message: ''};
    let errorMessage = null
    if(!houseParams.title || validator.trim(houseParams.title.length,'') > 50 || validator.trim(houseParams.title.length,'') < 10)
        errorMessage = 'Title should be present with min length of 10 and max of 50'

    if(!houseParams.description || validator.trim(houseParams.description.length,'') > 250 || validator.trim(houseParams.description.length,'') < 50)
        errorMessage = 'Description should be present with min length of 50 and max of 250'

    if(!Number(houseParams.rent) || Number(houseParams.rent) < 100)
        errorMessage = 'Rent should be at least 100$'

    if(houseParams.maintenance){
        for (let key, val in houseParams.maintenance){
            if(config.maintenance.includes(key)) {
                if (Number(val) < 0)
                    errorMessage = key + "should be 0 or greater"
            }else{
                errorMessage = key + " is not allowed in maintenance"
            }
        }
    }

    if (!Number(houseParams.builtArea) || Number(houseParams.builtArea)< 100)
        errorMessage = "Built Area cannot be lesser than 100 sq ft."

    if (!Number(houseParams.carpetArea) || Number(houseParams.carpetArea)< 100)
        errorMessage = "Capet Area cannot be lesser than 100 sq ft."


};