let express = require('express'),
    db = require("../database/database.js"),
    foldersRoute = express.Router();

/**
 * @typedef Folder
 * @property {integer} id
 * @property {string} folder_name
 * @property {integer} folder_parent
 * @property {boolean} is_public
 */

// Standard CRUD operations

/**
 * Get all folders
 * @route GET /folders/
 * @returns {object} 200 - List of folders
 * @returns {Error}  default - Unexpected error
 */
 foldersRoute.route('/').get((req, res, next) => {
    var sql = "select * from FOLDER";
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
 * Get a folder from its id
 * @route GET /folders/{id}
 * @param {string} id.path.required - Database folder id from SQLite database
 * @returns {object} 200 - a folder
 * @returns {Error}  default - Unexpected error
 */
 foldersRoute.route('/:id').get((req, res, next) => {
    var sql = "select * from FOLDER where id = ?";
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
 * Create a new folder
 * @route POST /folders/
 * @consumes application/json
 * @param {Folder.model} req.body
 * @returns {object} 200 - New folder created in database
 * @returns {Error}  default - Unexpected error
 */
 foldersRoute.route('/').post((req, res, next) => {
    // Checks can be performed here for data format and completeness
    // var errors=[]
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    console.log(req.body);
    var data = {
        folder_name: req.body.folder_name,
        is_public: req.body.is_public,
        folder_parent: req.body.folder_parent,
    };
    var sql = 'INSERT INTO FILE (folder_name, is_public, folder_parent) VALUES (?,?,?)';
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
 foldersRoute.route('/:id').patch((req, res, next) => {
    var data = {
        folder_name: req.body.folder_name,
        is_public: req.body.is_public,
        folder_parent: req.body.folder_parent,
    };
    db.run(
        `UPDATE Parameters set 
        folder_name = COALESCE(?,folder_name), 
        is_public = COALESCE(?,is_public), 
        folder_parent = COALESCE(?,folder_parent),
        WHERE id = ?`,
        [data.folder_name, data.is_public, data.folder_parent],
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
 * Delete a folder from its id
 * @route DELETE /folders/{id}
 * @param {string} id.path.required - Database folder id to delete
 * @returns {object} 200 - folder deleted
 * @returns {Error}  default - Unexpected error
 */
 foldersRoute.route('/:id').delete((req, res, next) => {
    db.run(
        'DELETE FROM FOLDER WHERE id = ?',
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

module.exports = foldersRoute;