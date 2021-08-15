import { login, signin, getUserNameById, getUserByToken, getUsers } from '../controllers/user.controller';
import * as express from 'express';
const router = express.Router();

router.post('/login', login);
router.post('/signin', signin);
router.get('/username/:id', getUserNameById);
router.get('/', getUserByToken);
router.get('/all', getUsers);

module.exports = router;