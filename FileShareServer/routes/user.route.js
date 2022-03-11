import { login, signin, getUserNameById, getUserByToken, getUsers, updatePassword, updateUser, updateImage } from '../controllers/user.controller';
import * as express from 'express';
import multer from "multer";
const router = express.Router();

// initialize a multer object for uploading user profile image
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// routs
router.post('/login', login);
router.post('/signin', signin);
router.get('/username/:id', getUserNameById);
router.get('/', getUserByToken);
router.get('/all', getUsers);
router.post('/update/password', updatePassword);
router.post('/update/image', upload.single("image"), updateImage);
router.post('/update', updateUser);

module.exports = router;