import dao from './dao';

export default class {

    static async getAllItems() {
        return await dao.all("SELECT * FROM ITEM", [])
    }

    static async getItemById(id) {
        return await dao.get("SELECT * FROM ITEM WHERE id = ?", [id])
    }

    static async addItem(data) {
        var sql = 'INSERT INTO ITEM (name, isPublic, isFile, size, dateUploaded, parentItem, creator) VALUES (?,?,?,?,?,?,?)';
        var params = [data.name, data.isPublic, data.isFile, data.size, data.dateUploaded, data.parentItem, data.creator];
        return dao.run(sql, params).then((res) => true).catch((err) => false);
    }
}