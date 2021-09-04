const conf = require("../conf/conf.json");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/' + conf.dbName);
const bcrypt = require('bcrypt');



export default class {

    static setupDbForDev() {
        //  This sets up a DB in memory to be used by creating tables, inserting values, etc.
        db.serialize(function () {
            const createUsersTable = `CREATE TABLE USER (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                isAdmin   BOOLEAN,
                firstName TEXT,
                lastName  TEXT,
                userName  TEXT UNIQUE,
                image     BLOB,
                password  TEXT NOT NULL
            );`;
            db.run(createUsersTable, [], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`user table created`);
                let password = 'admin'
                bcrypt.hash(password, conf.saltRounds, function (err, hash) {
                    const insertUsers = `INSERT INTO USER (userName, password, isAdmin) VALUES ('admin', '${hash}', 'true');`
                    db.run(insertUsers);
                });
            });
            const createItemsTable = `CREATE TABLE ITEM (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            STRING  NOT NULL,
                isPublic        BOOLEAN,
                size            BIGINT,
                dateUploaded    DATE,
                isFile          BOOLEAN,
                parentItem      INTEGER,
                creator         INTEGER,
                serverPath      STRING,
                CONSTRAINT fk_parent_item FOREIGN KEY (parentItem) REFERENCES ITEM(id) ON DELETE CASCADE,
                CONSTRAINT fk_creator FOREIGN KEY (creator) REFERENCES USER(id) ON DELETE SET NULL
            ); `;
            db.run(createItemsTable, [], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`item table created`);
            });
            const createUserToItem = `CREATE TABLE USER_TO_ITEM (
                userId   INTEGER REFERENCES USER (id)  NOT NULL,
                itemId   INTEGER REFERENCES ITEM (id)  NOT NULL
            );`
            db.run(createUserToItem, [], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`user_to_item table created`);
            });
        });
        //  db.close();
    }

    static all(stmt, params) {
        return new Promise((res, rej) => {
            db.all(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                console.log(result)
                return res(result);
            });
        })
    }
    static get(stmt, params) {
        return new Promise((res, rej) => {
            db.get(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }

    static run(stmt, params) {
        return new Promise((res, rej) => {
            db.run(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }
}