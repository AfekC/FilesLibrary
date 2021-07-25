let express = require('express'),
    db = require("../database/database.js"),
    directoryRoute = express.Router(),
    multer = require('multer');

/**
 * @typedef Directory
 * @property {integer} id
 * @property {string} file_name
 * @property {boolean} is_public
 * @property {boolean} is_file
 * @property {integer} size
 * @property {datetime} date_uploaded
 * @property {parent_dir} parent_dir
 * @property {integer} creator
 */

// Standard CRUD operations

/**
 * Get all files
 * @route GET /directory/
 * @returns {object} 200 - List of files
 * @returns {Error}  default - Unexpected error
 */
directoryRoute.route('/').get((req, res, next) => {
    var sql = "select * from DIRECTORY";
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
 * Get a directory from its id
 * @route GET /directory/{id}
 * @param {string} id.path.required - Database directory id from SQLite database
 * @returns {object} 200 - a directory
 * @returns {Error}  default - Unexpected error
 */
directoryRoute.route('/:id').get((req, res, next) => {
    var sql = "select * from DIRECTORY where id = ?";
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
 * Create a new directory
 * @route POST /directory/
 * @returns {object} 200 - New directory created in database
 * @returns {Error}  default - Unexpected error
 */
directoryRoute.post('/upload-files', multer().array("files"), (req, res) => {
    let isSuccess = true;
    console.log(req.body);
    console.log(req.files);
    req.files.forEach(file => {
        var data = {
            directory_name: file.originalname,
            is_public: req.body.is_public,
            is_file: true,
            size: file.size,
            date_uploaded: (new Date()).toString(),
            parent_dir: req.body.parent_dir,
            creator: req.body.creator,
        };
        console.log(data);
        var sql = 'INSERT INTO DIRECTORY (directory_name, is_file, is_public, size, date_uploaded, parent_dir, creator) VALUES (?,?,?,?,?,?,?)';
        var params = [data.directory_name, data.is_public, data.is_file, data.size, data.date_uploaded, data.parent_dir, data.creator];
        db.run(sql, params, function (err, result) {
            if (err) {
                isSuccess = false;
            }
        });
    });
    if (!isSuccess) {
        res.status(400).json({ "error": "error uploading files" });
        return;
    }
    res.json({
        message: "success",
        id: this.lastID
    });
});

/**
 * Update a file from its id
 * @route PATCH /directory/{id}
 * @param {string} id.path.required - Database file id to update
 * @param {File.model} req.body
 * @returns {object} 200 - Update file
 * @returns {Error}  default - Unexpected error
 */
directoryRoute.route('/:id').patch((req, res, next) => {
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
 * @route DELETE /directory/{id}
 * @param {string} id.path.required - Database file id to delete
 * @returns {object} 200 - file deleted
 * @returns {Error}  default - Unexpected error
 */
directoryRoute.route('/:id').delete((req, res, next) => {
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

module.exports = directoryRoute;