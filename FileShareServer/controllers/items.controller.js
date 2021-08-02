import repository from '../repositories/itemRepository';
import conf from '../conf/conf.json'
const fs = require('fs');

export default class {
    static async getAllItems(req, res) {
        const currDirId = req.body.currDirId;
        console.log(currDirId)
        let items = await repository.getItemChiledsById(currDirId);
        return res.send({ items });
    };

    static async getFileByPath(req, res) {
        const file = fs.readFileSync(conf.baseLibraryPath + '/' + req.params.path);
        return res.send(file);
    }

    static async addItem(req, res) {
        let isAllSeccess = true;
        console.log(req.files);
        req.files.forEach(async file => {
            const data = {
                name: file.originalname,
                isPublic: req.body.isPublic,
                isFile: true,
                size: file.size,
                dateUploaded: (new Date()).toString(),
                parentDir: req.body.parentDir,
                creator: req.body.creator,
            };
            if (!await repository.addItem(data)) {
                isAllSeccess = false;
            }
        });
        if (isAllSeccess) {
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
        console.log(req.body);
        var data = {
            name: req.body.name,
            isPublic: req.body.isPublic,
            isFile: false,
            dateUploaded: (new Date()).toString(),
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