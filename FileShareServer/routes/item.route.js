import itemsController from '../controllers/items.controller';
import * as express from 'express';
import multer from 'multer';
import conf from '../conf/conf.json';
const router = express.Router()

router.post("/", itemsController.getAllItems);
router.get("/file/:path", itemsController.getFileByPath)
router.post('/upload-files', multer({ dest: conf.tempPath }).array("files"), itemsController.addItem);
router.post('/new_folder', itemsController.newFolder);
router.post("/delete/:id", itemsController.deleteById);

module.exports = router