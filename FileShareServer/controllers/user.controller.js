import njwt from 'njwt';
import repository from '../repositories/userRepository';
import { asyncForEach } from "../helpers";

const bcrypt = require('bcrypt');

const { APP_SECRET = 'secret' } = process.env;

const encodeToken = (tokenData) => {
    return njwt.create(tokenData, APP_SECRET).compact();
}

const decodeToken = (token) => {
    return njwt.verify(token, APP_SECRET).setExpiration(-1).body;
}

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Access-Token');
        if (!token) {
            return next();
        }
        const decoded = decodeToken(token);
        const { userId } = decoded;
        const user = await repository.getUserById(userId)
        if (user) {
            req.userId = userId;
        }
    } catch (e) {
        console.log('jwt error');
        return res.status(401);
    }
    next();
};

const returnInvalidCredentials = (res) => {
    res.status(401);
    return res.json({ error: 'Invalid username or password' });

}

export const login = async (req, res) => {
    const { userName, password } = req.body;

    const user = await repository.getUserByUsername(userName)
    if (!user) {
        returnInvalidCredentials(res)
        return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const accessToken = encodeToken({ userId: user.id });
            return res.json({ accessToken, user });
        } else {
            return returnInvalidCredentials(res);
        }
    });
}

export const signin = async (req, res) => {
    await repository.addUser(req.body);

    const user = await repository.getUserByUsername(req.body.userName)
    if (!user) {
        returnInvalidCredentials(res)
        return;
    }

    const accessToken = encodeToken({ userId: user.id });
    return res.json({ accessToken, user });
}

export const getUserNameById = async (req, res) => {
    const id = req.params.id;
    if (id) {
        const username = await repository.getUsernameById(id)
        return res.json(username);
    } else {
        return res.status(404);
    }
};

export const getUserByToken = async (req, res) => {
    if (!!req.userId) {
        const user = await repository.getUserById(req.userId);
        return res.json({ user })
    } else {
        res.status(401);
        return res.json({ error: 'User not authenticated' });
    }
}

export const getUsers = async (req, res) => {
  const users = await repository.getUsers();
  return res.json({ users });
}

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!!req.userId) {
        try {
            const user = await repository.getUserById(req.userId);
            bcrypt.compare(oldPassword, user.password, async (err, result) => {
                if (result) {
                    const r = await repository.updatePassword(req.userId, newPassword)
                    return res.json({r});
                } else {
                    return returnInvalidCredentials(res);
                }
            });
        } catch (e) {
            res.status(400);
            console.log(e)
            return res.json({ error: 'General Error' });
        }
    } else {
        res.status(400);
        return res.json({ error: 'User not authenticated' });
    }
}

export const updateUser = async (req, res) => {
    if (!!req.userId) {
        try {
            const user = await repository.getUserById(req.userId);
            await asyncForEach(Object.keys(user), (key) => {
                if (req.body.user[key]) {
                    user[key] = req.body.user[key];
                }
            });
            await repository.updateUser(req.userId, user);
            return res.json({ user });
        } catch (e) {
            res.status(400);
            console.log(e)
            return res.json({ error: 'General Error' });
        }
    } else {
        res.status(401);
        return res.json({ error: 'User not authenticated' });
    }
}

export const updateImage = async (req, res) => {
    if (!!req.userId) {
        try {
            await repository.updateImage(req.userId, req.file);
            return res.json({ });
        } catch (e) {
            res.status(400);
            console.log(e);
            return res.json({ error: 'General Error' });
        }
    } else {
        res.status(401);
        return res.json({ error: 'User not authenticated' });
    }
}