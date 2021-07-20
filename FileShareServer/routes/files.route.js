let express = require('express'),
    db = require("../database/database.js"),
    filesRouter = express.Router();

/**
 * @typedef File
 * @property {integer} id
 * @property {string} file_name
 * @property {boolean} is_public
 * @property {integer} size
 * @property {datetime} date_uploaded
 * @property {integer} creator
 */

// Standard CRUD operations

/**
 * Get all files
 * @route GET /files/
 * @returns {object} 200 - List of files
 * @returns {Error}  default - Unexpected error
 */
 filesRouter.route('/').get((req, res, next) => {
    var sql = "select * from FILE";
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
 * Get a file from its id
 * @route GET /files/{id}
 * @param {string} id.path.required - Database file id from SQLite database
 * @returns {object} 200 - a file
 * @returns {Error}  default - Unexpected error
 */
 filesRouter.route('/:id').get((req, res, next) => {
    var sql = "select * from FILE where id = ?";
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
 * Create a new parameter
 * @route POST /files/
 * @consumes application/json
 * @param {File.model} req.body
 * @returns {object} 200 - New file created in database
 * @returns {Error}  default - Unexpected error
 */
 filesRouter.route('/').post((req, res, next) => {
    // Checks can be performed here for data format and completeness
    // var errors=[]
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    console.log(req.body);
    var data = {
        file_name: req.body.file_name,
        is_public: req.body.is_public,
        size: req.body.size,
        date_uploaded: req.body.date_uploaded,
        creator: req.body.creator,
    };
    var sql = 'INSERT INTO FILE (file_name, is_public, size, date_uploaded, creator) VALUES (?,?,?,?,?)';
    var params = [data.file_name, data.is_public, data.size, data.date_uploaded, data.creator];
    db.run(sql, params, function (err, result) {
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
 * Update a file from its id
 * @route PATCH /files/{id}
 * @param {string} id.path.required - Database file id to update
 * @param {File.model} req.body
 * @returns {object} 200 - Update file
 * @returns {Error}  default - Unexpected error
 */
 filesRouter.route('/:id').patch((req, res, next) => {
    var data = {
        file_name: req.body.file_name,
        is_public: req.body.is_public,
        size: req.body.size,
        date_uploaded: req.body.date_uploaded,
        creator: req.body.creator,
    };
    db.run(
        `UPDATE Parameters set 
        file_name = COALESCE(?,file_name), 
        is_public = COALESCE(?,is_public), 
        size = COALESCE(?,size),
        date_uploaded = COALESCE(?,date_uploaded),
        creator = COALESCE(?,creator),
        WHERE id = ?`,
        [data.file_name, data.is_public, data.size, data.date_uploaded, data.creator],
        function (err, result) {
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
 * Delete a file from its id
 * @route DELETE /files/{id}
 * @param {string} id.path.required - Database file id to delete
 * @returns {object} 200 - file deleted
 * @returns {Error}  default - Unexpected error
 */
 filesRouter.route('/:id').delete((req, res, next) => {
    db.run(
        'DELETE FROM FILE WHERE id = ?',
        req.params.id,
        function (err, result) {
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

module.exports = filesRouter;