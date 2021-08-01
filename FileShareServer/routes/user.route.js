import { login, signin, getUserByToken } from '../controllers/user.controller';
import * as express from 'express';
const router = express.Router();

router.post('/login', login);
router.post('/signin', signin);
router.get('/', getUserByToken);

module.exports = router;