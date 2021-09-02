import dao from './dao';
const bcrypt = require('bcrypt');
const conf = require("../conf/conf.json");

export default class {

    static async getUserByUsername(userName) {
        return dao.get("SELECT * FROM USER WHERE userName = ?", [userName]);
    }

    static async getUserById(id) {
        return dao.get('SELECT * FROM USER WHERE id = ?', [id]);
    }

    static async getUsernameById(id) {
        return dao.get('SELECT username FROM USER WHERE id = ?', [id]);
    }

    static async addUser(user) {
        const { firstName, lastName, userName, image, password } = user;

        const promise = new Promise((resolve, reject) => {
            bcrypt.hash(password, conf.saltRounds, function (err, hash) {
                var sql = 'INSERT INTO USER (firstName,lastName,userName,image,password) VALUES (?,?,?,?,?)';
                var params = [firstName, lastName, userName, image, hash];
                dao.run(sql, params);
                resolve();
            });
        });
        await promise;
    }

    static async getUsers() {
        return dao.all(`SELECT id, username FROM USER WHERE username != 'admin' `, []);
    }

    static async updatePassword(id, password) {
        const promise = new Promise((resolve, reject) => {
            bcrypt.hash(password, conf.saltRounds, function (err, hash) {
                dao.run('UPDATE USER SET password=? WHERE id = ?', [hash, id]);
                resolve();
            });
        });
        await promise;
    }

    static async updateUser(id, user) {
        const { firstName, lastName, userName, image } = user;

        var sql = 'UPDATE USER SET firstName=?,lastName=?,userName=?,image=? WHERE id = ?';
        var params = [firstName, lastName, userName, image, id];

        return dao.all(sql, params);
    }
}