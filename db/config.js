
module.exports = {
    development: {
        username: 'postgres',
        password: null,
        database: 'meals',
        host: '127.0.0.1',
        dialect: 'postgres'
    },
    test: {
	    username: 'postgres',
	    password: null,
	    database: 'meals_test',
	    host: '127.0.0.1',
	    dialect: 'postgres'
    },
    production:{
	    username: 'root',
	    password: null,
	    database: 'meals_prod',
	    host: '127.0.0.1',
	    dialect: 'postgres'
    }
};