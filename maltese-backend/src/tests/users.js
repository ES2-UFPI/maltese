const UserController = require('../controllers/UserControllers')

module.exports = {
    execute_all_tests: async function () {
        // Execute CRUD tests
        /**
         * ...
         */
        // Execute other tests

    }
}

function user_test_create() {
    const normal_request_content = {
        login: "testuser01@testdomain.com",
        password: "123456a!"
    }
    const invalid_request_content = [
        // Login only
        {
            login: "testuser01@testdomain.com"
        },
        // No login, contain password
        {
            password: "testuser01@testdomain.com"
        },
        // No login and no password
        {

        },
        // Login only, invalid login
        {
            login: ""
        },
        // Login and password, but both invalid
        {
            login: "",
            password: "",
        },
        // Login and password, valid login and invalid password
        {
            login: "testuser01@testdomain.com",
            password: ""
        }
    ]

    // To-do: implement test assertion method
}