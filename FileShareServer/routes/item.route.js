import itemsController from '../controllers/items.controller';
import * as express from 'express';
const router = express.Router()

const multer = require('multer');
const multerS3 = require('multer-minio-storage-engine');

const { minioClient } = require('../minio');

const storage = multerS3({
    minio: minioClient,
    bucketName: process.env.MINIO_BUCKET_NAME,
    objectName: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, '-' + uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/', itemsController.getAllItems);
router.post('/upload-files', upload.any(), itemsController.addItem);
router.post('/new_folder', itemsController.newFolder);
router.post('/delete/:id', itemsController.deleteById);
router.post('/changeItemAccess', itemsController.changeItemAccess);
router.get('/:id', itemsController.downloadItem)
router.get('/getItemUsers/:id', itemsController.getItemUsers)

module.exports = router