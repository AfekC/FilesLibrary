import dao from './dao';

export default class {

    static async getItemChiledsById(parentId, userId) {
        let items;
        if(parentId) {
            items =  await dao.all(`SELECT ITEM.*, USER.username AS creatorUsername
                                        FROM ITEM
                                                 LEFT JOIN USER ON (ITEM.creator=USER.id OR USER.id IS NULL)
                                                 LEFT JOIN USER_TO_ITEM ON (ITEM.id = USER_TO_ITEM.itemId)
                                        WHERE parentItem = ?
                                          AND ( isPublic = true OR userId = ?)`
                , [parentId, userId]);
        } else {
            items =  await dao.all(`SELECT ITEM.*, USER.username AS creatorUsername
                                    FROM ITEM
                                             LEFT JOIN USER ON (ITEM.creator=USER.id OR USER.id IS NULL)
                                             LEFT JOIN USER_TO_ITEM ON (ITEM.id = USER_TO_ITEM.itemId)
                                    WHERE parentItem IS NULL
                                      AND ( isPublic = true OR userId = ?)`
                , [userId]);
        }
        return items;
    }

    static async addItem(data) {
        return dao.run('INSERT INTO ITEM (name, isPublic, isFile, size, dateUploaded, parentItem, creator, serverPath) VALUES (?,?,?,?,?,?,?,?)'
            , [data.name, data.isPublic, data.isFile, data.size, data.dateUploaded, data.parentItem, data.creator, data.objectName])
            .then((res) => true).catch((err) => false);
    }

    static async getItemByNameAndParent(name, parentItem) {
        if (parentItem) {
            return await dao.get(`SELECT * FROM ITEM WHERE name = ? AND parentItem = ?`, [name, parentItem]);
        }
        return await dao.get(`SELECT * FROM ITEM WHERE name = ? AND parentItem IS NULL`, [name]);
    }

    static async getItemById(itemId, userId) {
        return await dao.get(`SELECT ITEM.* FROM ITEM 
                                        LEFT JOIN USER_TO_ITEM ON ITEM.id = USER_TO_ITEM.itemId
                                    WHERE id = ? AND ( isPublic = true OR userId = ?)`, [itemId, userId]);
    }

    static async getItemCreator(itemId) {
        return await dao.get(`SELECT ITEM.creator FROM ITEM 
                                    WHERE id = ?`, [itemId]);
    }

    static async removeItemAccess(itemId) {
        return await dao.run(`DELETE FROM USER_TO_ITEM WHERE itemId = ?`, [itemId]);
    }

    static async updateItemPublicField(itemId, isPublic) {
        return await dao.run(`UPDATE ITEM SET isPublic=? WHERE id = ?`, [isPublic, itemId]);
    }

    static async deleteItem(id) {
        const deleteItem = await dao.run(`DELETE FROM ITEM WHERE id = ?`, [id]).then((res) => true).catch((err) => false);
        const deleteUserToItem = await dao.run(`DELETE FROM USER_TO_ITEM WHERE itemId = ?`, [id]).then((res) => true).catch((err) => false);
        return deleteItem && deleteUserToItem;
    }

    static async addUserToItem(itemId, userId) {
        return dao.run('INSERT INTO USER_TO_ITEM (userId, itemId) VALUES (?,?)'
            , [userId, itemId])
            .then((res) => true).catch((err) => false);
    }

    static async getItemUsers(itemId) {
        return dao.all(`SELECT userID FROM USER_TO_ITEM WHERE itemId = ?`, [itemId]);
    };
}