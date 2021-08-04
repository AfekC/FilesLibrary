import dao from './dao';

export default class {

    static async getItemChiledsById(id) {
        let items, moreItems;
        if (id) {
            items =  await dao.all(`SELECT ITEM.*, USER.username AS creatorUsername
                                    FROM ITEM JOIN USER
                                        ON (ITEM.creator=USER.id
                                            OR USER.id IS NULL)
                                    WHERE parentItem = ?`, [id]);
            moreItems = await dao.all(`SELECT * FROM ITEM
                                    WHERE parentItem = ? AND creator is null`, [id]);
        } else {
            items = await dao.all(`SELECT ITEM.*, USER.username AS creatorUsername
                                    FROM ITEM JOIN USER
                                        ON (ITEM.creator=USER.id
                                            OR USER.id IS NULL)
                                    WHERE parentItem is null`, []);
            moreItems = await dao.all(`SELECT * FROM ITEM
                                    WHERE parentItem is null AND creator is null`, []);
        }
        items.push(...moreItems);
        return items;
    }

    static async addItem(data) {
        return dao.run('INSERT INTO ITEM (name, isPublic, isFile, size, dateUploaded, parentItem, creator) VALUES (?,?,?,?,?,?,?)'
            , [data.name, data.isPublic, data.isFile, data.size, data.dateUploaded, data.parentItem, data.creator])
            .then((res) => true).catch((err) => false);
    }

    static async getItemByNameAndParent(name, parentItem) {
        return await dao.all(`SELECT * FROM ITEM WHERE name = ? AND parentItem = ?`, [name, parentItem]);
    }
}