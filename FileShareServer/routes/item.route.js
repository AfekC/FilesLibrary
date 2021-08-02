import itemsController from '../controllers/items.controller';
import * as express from 'express';
import multer from 'multer';
const router = express.Router()

router.post("/", itemsController.getAllItems);
router.get("/file/:path", itemsController.getFileByPath)
router.post('/upload-files', multer().array("files"), itemsController.addItem);
router.post('/new_folder', itemsController.newFolder);

module.exports = router