import repository from '../repositories/itemRepository';
import conf from '../conf/conf.json'
import { asyncForEach } from '../helpers/index.js'

const fs = require('fs');

export default class {
    static async getAllItems(req, res) {
        const currDirId = req.body.currDirId;
        const items = await repository.getItemChiledsById(currDirId);
        return res.send({ items });
    };

    static async getFileByPath(req, res) {
        const file = fs.readFileSync(conf.baseLibraryPath + '/' + req.params.path);
        return res.send(file);
    }

    static async addItem(req, res) {
        let isAllSuccess = true;
        await asyncForEach(req.files, async (file) => {
            const data = {
                name: file.originalname,
                isPublic: req.body.isPublic,
                isFile: true,
                size: file.size,
                dateUploaded: (new Date()).getTime(),
                parentItem: req.body.parentItem === 'null' ? null : req.body.parentItem,
                creator: req.body.creator === 'undefined' ? undefined : req.body.creator,
            };
            const isItemExists = (await repository.getItemByNameAndParent(data.name, data.parentItem)).length > 0;
            if (isItemExists) {
                isAllSuccess = false;
            } else if (!await repository.addItem(data)) {
                isAllSuccess = false;
            }
        });
        if (isAllSuccess) {
            return res.json({
                message: "success",
            });
        } else {
            res.status(400).send({
                message: 'This is an error!'
            });
        }
    }
    static async newFolder(req, res) {
        const isItemExists = (await repository.getItemByNameAndParent(req.body.name, req.body.parentItem)).length > 0;
        if (isItemExists) {
            return res.status(400).send({
                message: 'item name is already exists'
            });
        }
        var data = {
            name: req.body.name,
            isPublic: req.body.isPublic,
            isFile: false,
            dateUploaded: (new Date()).getTime(),
            parentItem: req.body.parentItem,
            creator: req.body.creator,
        };
        if (await repository.addItem(data)) {
            return res.json({
                message: "success",
            });
        } else {
            res.status(400).send({
                message: 'This is an error!'
            });
        }
    }

    static async deleteById(req, res) {
        const deleteFunction = async (id) => {
            const item = await repository.getItemById(id);
            if (!item) return false;

            const childes = await repository.getItemChiledsById(id);
            if (!childes.every((item) => { return deleteFunction(item.id) })) return false;

            return  await repository.deleteItem(id);
        };

        if (await deleteFunction(req.params.id)) {
            return res.json({ message: 'deleted successfully' });
        }

        return res.status(400).send({
            message: 'Error while deleted!'
        });
    }
}