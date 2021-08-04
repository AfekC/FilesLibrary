import repository from '../repositories/itemRepository';
import conf from '../conf/conf.json'
const fs = require('fs');

export default class {
    static async getAllItems(req, res) {
        const currDirId = req.body.currDirId;
        let items = await repository.getItemChiledsById(currDirId);
        return res.send({ items });
    };

    static async getFileByPath(req, res) {
        const file = fs.readFileSync(conf.baseLibraryPath + '/' + req.params.path);
        return res.send(file);
    }

    static async addItem(req, res) {
        let isAllSuccess = true;
        req.files.forEach(async (file) => {
            const data = {
                name: file.originalname,
                isPublic: req.body.isPublic,
                isFile: true,
                size: file.size,
                dateUploaded: (new Date()).getTime(),
                parentItem: req.body.parentItem,
                creator: req.body.creator === 'undefined' ? undefined : req.body.creator,
            };
            const r = await repository.addItem(data);
            if (r) {
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
        const isFolderExists = (await repository.getItemByNameAndParent(req.body.name, req.body.parentItem))
            .some((folder) => !folder.isFile).length > 0;
        if (isFolderExists) {
            return res.status(400).send({
                message: 'folder name is already exists'
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
}