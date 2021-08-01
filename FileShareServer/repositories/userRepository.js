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

    static async addUser(user) {
        const { firstName, lastName, userName, image, password } = user;

        const promise = new Promise((resolve, reject) => {
            bcrypt.hash(password, conf.saltRounds, function (err, hash) {
                var sql = 'INSERT INTO USER (firstName,lastName,userName,image, password) VALUES (?,?,?,?,?)';
                var params = [firstName, lastName, userName, image, hash];
                dao.run(sql, params);
                resolve();
            });
        });
        await promise;
    }
}