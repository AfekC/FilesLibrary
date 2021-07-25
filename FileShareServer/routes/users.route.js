let express = require('express'),
    db = require("../database/database.js"),
    usersRoute = express.Router();

/**
 * @typedef User
 * @property {integer} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} user_name
 * @property {binary} image
 * @property {string} password
 */

// Standard CRUD operations

/**
 * Get all users
 * @route GET /users/
 * @returns {object} 200 - List of users names
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.get('/', (req, res, next) => {
    var sql = "select user_name from USER";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

/**
 * Get a user from its user_name and passwors
 * @route GET /users/login
 * @param {string} id.path.required - Database user id from SQLite database
 * @returns {object} 200 - user by id
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.post('/login', (req, res) => {
     console.log(req.body);
    var sql = "select * from USER where user_name = ? AND password = ?";
    var params = [req.body.user_name, req.body.password];
    db.get(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (result) {
            res.json({
                message: "success",
                data: result
            });
        } else {
            res.json({ message: "invalid user name or password" });
        }
    });
});

/**
 * Create a new user
 * @route POST /users/
 * @consumes user/json
 * @param {User.model} req.body
 * @returns {object} 200 - New user created in database
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.post("/", (req, res) => {
    // Checks can be performed here for data format and completeness
    // var errors=[]
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    console.log(req.body);
    var data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        image: req.body.image,
        password: req.body.password,
    };
    var sql = 'INSERT INTO USER (first_name,last_name,user_name,image, password) VALUES (?,?,?,?,?)';
    var params = [data.first_name,data.last_name,data.user_name,data.image,data.password];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID
        });
    });
});

module.exports = usersRoute;