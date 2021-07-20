const sqlite3 = require('sqlite3').verbose(),
    conf = require("../conf/conf.json"),
    DBSOURCE = 'database/' + conf.dbName + '.sqlite',
    db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message);
            throw err;
        } else {
            console.log('Connected to the SQLite database.');
            db.run(
                `CREATE TABLE FILE (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name     STRING  NOT NULL,
                is_public     BOOLEAN,
                size          BIGINT,
                date_uploaded DATE,
                creator       INTEGER  CONSTRAINT file_creator REFERENCES USER (id) 
            ); `,
                (err) => {
                    if (err) {
                        // Table already created  
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('FILE table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE FILE_TO_FOLDER (
                    file_id   INTEGER PRIMARY KEY
                                     REFERENCES FILE (id) 
                                     NOT NULL
                                     UNIQUE,
                    folder_id INTEGER REFERENCES FOLDER (folder_name) 
                );`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('FILE_TO_FOLDER table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE FOLDER (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    folder_name   TEXT   NOT NULL,
                        is_public     BOOLEAN,
                        folder_parent INTEGER REFERENCES FOLDER_PARENT (folder_id) ON DELETE CASCADE
                    );`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('FOLDER table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE FOLDER_PARENT (
                            folder_id INTEGER REFERENCES FOLDER (folder_name) ON DELETE CASCADE
                                             UNIQUE
                                             NOT NULL
                                             PRIMARY KEY,
                            parent_id INTEGER REFERENCES FOLDER (id) 
                        );`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('FOLDER_PARENT table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE USER (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                is_admin   BOOLEAN,
                                first_name TEXT,
                                last_name  TEXT,
                                user_name  TEXT,
                                image      BLOB,
                                password text NOT NULL
                            );`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('USER table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE USER_TO_DIR (
                                    user_id   INTEGER REFERENCES USER (id) 
                                                     NOT NULL,
                                    folder_id INTEGER REFERENCES FOLDER (id) 
                                                     NOT NULL
                                );
                                `,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('USER_TO_DIR table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE USER_TO_FILE (
                    user_id INTEGER REFERENCES USER (id) ON DELETE CASCADE
                                   NOT NULL,
                    file_id INTEGER REFERENCES FILE (id) ON DELETE CASCADE
                                   NOT NULL
                );
                                `,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('USER_TO_FILE table created.');
                    }
                }
            );
        }
    });

module.exports = db;