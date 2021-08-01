import repository from '../repositories/itemRepository';

export default class {
    static async getAllItems(req, res) {
        let items = await repository.getAllItems();
        return res.send({ items });
    };

    static async getItemById(req, res) {
        let item = await repository.getItemById(req.params.id)
        return res.send({ item });
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