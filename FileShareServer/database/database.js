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
                `CREATE TABLE DIRECTORY (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                directory_name  STRING  NOT NULL,
                is_public       BOOLEAN,
                size            BIGINT,
                date_uploaded   DATE,
                is_file         BOOLEAN,
                parent_dir      INTEGER  CONSTRAINT parent_directory REFERENCES DIRECTORY(id),
                creator         INTEGER  CONSTRAINT file_creator REFERENCES USER (id) 
            ); `,
                (err) => {
                    if (err) {
                        // Table already created  
                        console.log(err);
                    } else {
                        // Table just created, creating some
                        console.log('DIRECTORY table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE USER (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                is_admin   BOOLEAN,
                                first_name TEXT,
                                last_name  TEXT,
                                user_name  TEXT UNIQUE,
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
                        user_id   INTEGER REFERENCES USER (id)         NOT NULL,
                        directory_id INTEGER REFERENCES DIRECTORY (id) NOT NULL
                );`,
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
        }
    });

module.exports = db;