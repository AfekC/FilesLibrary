import repository from '../repositories/itemRepository';
import { asyncForEach } from '../helpers'

const fs = require('fs');

export default class {
    static async getAllItems(req, res) {
        const currDirId = req.body.currDirId;
        const items = await repository.getItemChiledsById(currDirId, req.userId);
        return res.send({ items });
    };

    static async addItem(req, res) {
        let isAllSuccess = true;
        await asyncForEach(req.files, async (file) => {
            const data = {
                name: file.originalname,
                isPublic: JSON.parse(req.body.isPublic),
                isFile: true,
                size: JSON.parse(file.size),
                dateUploaded: (new Date()).getTime(),
                parentItem: JSON.parse(req.body.parentItem),
                creator: JSON.parse(req.body.creator),
                path: file.path,
            };
            const usersToShare = JSON.parse(req.body.usersToShare) + req.userId;
            let item = await repository.getItemByNameAndParent(data.name, data.parentItem);
            if (!!item) {
                isAllSuccess = false;
            } else if (!await repository.addItem(data)) {
                isAllSuccess = false;
            } else if (!!req.userId && !data.isPublic) {
                item = await repository.getItemByNameAndParent(data.name, data.parentItem);
                await asyncForEach(usersToShare, async (userId) => {
                    repository.addUserToItem(item.id, userId);
                });
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
        const item = (await repository.getItemByNameAndParent(req.body.name, req.body.parentItem));
        if (!!item) {
            return res.status(400).send({
                message: 'item name is already exists'
            });
        }
        const data = {
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
            const item = await repository.getItemById(id, req.userId);
            if (!item) return false;

            const childes = await repository.getItemChiledsById(id);
            if (!childes.every((item) => { return deleteFunction(item.id) })) return false;

            if (!!item.serverPath) {
                try {
                    fs.unlinkSync(item.serverPath);
                    //file removed
                } catch(err) {
                    console.error(err);
                }
            }
            return  await repository.deleteItem(id);
        };

        if (await deleteFunction(req.params.id)) {
            return res.json({ message: 'deleted successfully' });
        }

        return res.status(400).send({
            message: 'Error while deleted!'
        });
    }

    static async downloadItem(req, res) {
        const id = req.params.id;
        const item = await repository.getItemById(id, req.userId);
        if (!item) {
            return res.status(400).send({ message: 'ERROR'})
        }
        res.download(item.serverPath, item.name, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        });
    };
}