const wrap = require('decorator-wrap').wrap;
const validator = require('validator');
const models = require('../../db/models/index');
const hashlib = require('hash.js');
const USER_DETAILS_FIELDS = ['role', 'status', 'sex', 'name', 'email', 'id', 'createdAt', 'updatedAt'];
const _ = require('underscore');

const STRS = {
    INVALID_EMAIL: 'Your email is invalid',
    NAME_MIN_LENGTH: 6,
    INVALID_NAME: 'Name is invalid. it should be atleast 6 chars long',
    PASSWORD_MIN_LENGTH: 6,
    INVALID_PASSWORD: 'Password should be atleast 6 digits long',
    EMAIL_ALREADY_EXIST: 'Email already exist. if you forgot your password you can request for one.',
    EMAIL_PASSWORD_NOT_MATCHED: 'Email and password combination didn\'t matched',
    INVALID_SEX: 'Sex is invalid. Accepted values are '+ models.User.rawAttributes.sex.values,
    EMAIL_NOT_VERIFIED: 'Your email is not verified',
    LOGGED_IN_SUCCESSFUL: 'You have been logged in successful',
    INACTIVE_ACCOUNT: 'Your account have been deactivated',
    INVALID_ROLE: 'You can only signup as consumer',
};

const validateAndSanitizeSignupDetails = async function (email, name, password, sex, role) {
    if (!validator.isEmail(email))
        return {status: false, message: STRS.INVALID_EMAIL};
    if (validator.trim(name, '').length < STRS.NAME_MIN_LENGTH)
        return {status: false, message: STRS.INVALID_NAME};
    if (validator.trim(password, '').length < STRS.PASSWORD_MIN_LENGTH)
        return {status: false, message: STRS.INVALID_PASSWORD};
    if(!models.User.rawAttributes.sex.values.includes(sex))
        return {status: false, message: STRS.INVALID_SEX};
    if (role && !['consumer', 'manager'].includes(role))
        return {status: false, message: STRS.INVALID_ROLE};


    let count = await models.User.count({where: {email: validator.trim(email, '').toLowerCase()}});
    if (count > 0)
        return {status: false, message: STRS.EMAIL_ALREADY_EXIST};

    return {
        status: true,
        args: {
            email: validator.trim(email, '').toLowerCase(),
            name: validator.trim(name, ''),
            password: validator.trim(password, ''),
            sex: sex,
            role: role,
        }

    }
};

const validateLoginDetails = async function (email, password) {
    let user = await models.User.findOne({
        where: {email: validator.trim(email, '').toLowerCase()}
    });
    if(!user)
        return {status:false, message: STRS.INVALID_EMAIL};

    let caclulatedHash = hashlib.sha256(password + user.passwordAttributes.salt || '').digest('hex');
    if(caclulatedHash !== user.passwordAttributes.hash)
        return {status: false, message: STRS.EMAIL_PASSWORD_NOT_MATCHED};
    if(user.emailAttributes.verified === false)
        return {status: false, message: STRS.EMAIL_NOT_VERIFIED};
    if(user.status !== 'active')
        return {status: false, message: STRS.INACTIVE_ACCOUNT};

    return {
        status: true,
        message: STRS.LOGGED_IN_SUCCESSFUL,
        args:{
            user: _.pick(user.dataValues, USER_DETAILS_FIELDS)
        }
    };
};

module.exports.validateAndSanitizeSignupDetails = validateAndSanitizeSignupDetails;
module.exports.validateLoginDetails = validateLoginDetails;
