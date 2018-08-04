const models = require('../db/models/index');


const canSeeAllUsers = (user) => {
    return user.role === 'admin';
};

const canUpdateMeal = (user, meal) => {
    if( user.role === 'consumer' && meal.UserId === user.id)
        return true;
    return user.role === 'admin';

};

const canUpdateUser = (user1, user2) => {
    if(user1.id === user2.id) // can edit himself
        return true;
    return user1.role === 'admin';
};

const canCreateMeal = (user) => {
    return true;
};

const canSeeUserDetails = (user1, user2) => {
    if(user1.id === user2.id) // can see his details
        return true;
    return user1.role === 'admin';
};

module.exports.canSeeAllUsers = canSeeAllUsers;
module.exports.canUpdateMeal = canUpdateMeal;
module.exports.canUpdateUser = canUpdateUser;
module.exports.canCreateMeal = canCreateMeal;
module.exports.canSeeUserDetails = canSeeUserDetails;
