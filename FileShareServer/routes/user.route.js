import { login, signin, getUserNameById, getUserByToken, getUsers, updatePassword, updateUser } from '../controllers/user.controller';
import * as express from 'express';
const router = express.Router();

router.post('/login', login);
router.post('/signin', signin);
router.get('/username/:id', getUserNameById);
router.get('/', getUserByToken);
router.get('/all', getUsers);
router.post('/update/password', updatePassword);
router.post('/update', updateUser);

module.exports = router;