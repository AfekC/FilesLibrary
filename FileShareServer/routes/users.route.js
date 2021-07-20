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
 * @returns {object} 200 - List of users
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.route('/').get((req, res, next) => {
    var sql = "select * from USER";
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
 * Get a user from its id
 * @route GET /applications/{id}
 * @param {string} id.path.required - Database user id from SQLite database
 * @returns {object} 200 - user by id
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.route('/:id').get((req, res, next) => {
    var sql = "select * from USER where id = ?";
    var params = [req.params.id];
    db.get(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: result
        });
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
 usersRoute.route('/').post((req, res, next) => {
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

/**
 * Update a user from its id
 * @route PATCH /users/{id}
 * @param {string} id.path.required - Database user id to update
 * @param {User.model} req.body
 * @returns {object} 200 - Updated applications
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.route('/:id').patch((req, res, next) => {
    var data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        image: req.body.image,
        password: req.body.password,
    };
    db.run(
        `UPDATE Applications SET 
        first_name = COALESCE(?,first_name),
        last_name = COALESCE(?,last_name),
        user_name = COALESCE(?,user_name),
        image = COALESCE(?,image),
        password = COALESCE(?,password)
        WHERE id = ?`, 
        [data.first_name,data.last_name,data.user_name,data.image,data.password],
        function(err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            });
        });
});

/**
 * Delete an user from its id
 * @route DELETE /users/{id}
 * @param {string} id.path.required - Database user id to delete
 * @returns {object} 200 - List of changes on user
 * @returns {Error}  default - Unexpected error
 */
 usersRoute.route('/:id').delete((req, res, next) => {
    db.run(
        'DELETE FROM USER WHERE id = ?',
        req.params.id,
        function(err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            });
        });
});

module.exports = usersRoute;