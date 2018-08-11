const models = require('../db/models/index');


const canSeeAllUsers = (user) => {
    return user.role === 'admin' || user.role === 'manager';
};

const canUpdateMeal = (user, meal) => {
    if( user.role === 'consumer' && meal.UserId === user.id)
        return true;
    else if (user.role === 'admin')
        return true;
    else {
        return false;
    }

};

const canUpdateUser = async (user1, user2) => {
    if(user1.id === user2.id) // can edit himself
        return true;
    if ( user1.role === 'admin') return true;
    if (user1.role === 'manager'){
        let clients = await models.User.findAll({
            where: {managerId: user1.id},
            attributes: ['id']
        });
        let client_ids = _.map(managee_users, (u) => {
            return u.id;
        });
        if (client_ids.indexOf(user2.id) >= 0) return true;
    }
    return false;
};

const canCreateMeal = (user) => {
    return true;
};

const canSeeUserDetails = (user1, user2) => {
    if(user1.id === user2.id) // can see his details
        return true;
    return user1.role === 'admin';
};

const canDeleteUser = (user1, user2) =>{
    if ( user1.role === 'admin' )
        return true;
    else return user1.role === 'manager' && user2.managerId === user1.id && user2.role === 'consumer' ;

};

const canBeManagerToUserMessage = (manager, user) => {  //
    if (manager == null)
        return null;

    if (manager.role === 'manager') {
        if (manager.id === user.id){  // cannot be manager of self
            return 'Cannot assign yourself as a manager to yourself';
        }
        else if (user.role === 'manager' || user.role === 'consumer'){
            return null;  // yse can manage
        }else {
            return 'Manager cannot be assigned to admin'
        }
    }else {
        return 'The manager id is invalid or the person is not a manager';
    }
};
module.exports.canSeeAllUsers = canSeeAllUsers;
module.exports.canUpdateMeal = canUpdateMeal;
module.exports.canUpdateUser = canUpdateUser;
module.exports.canCreateMeal = canCreateMeal;
module.exports.canSeeUserDetails = canSeeUserDetails;
module.exports.canDeleteUser = canDeleteUser;
module.exports.canBeManagerToUserMessage = canBeManagerToUserMessage;