import njwt from 'njwt';
import repository from '../repositories/userRepository';
const bcrypt = require('bcrypt');

const { APP_SECRET = 'secret' } = process.env;

const encodeToken = (tokenData) => {
    return njwt.create(tokenData, APP_SECRET).compact();
}

const decodeToken = (token) => {
    return njwt.verify(token, APP_SECRET).setExpiration(-1).body;
}

export const authMiddleware = async (req, res, next) => {
    const token = req.header('Access-Token');
    if (!token) {
        return next();
    }

    try {
        const decoded = decodeToken(token);
        const { userId } = decoded;
        const user = await repository.getUserById(userId)
        if (user) {
            req.userId = userId;
        }
    } catch (e) {
        return next();
    }
    next();
};

export const authenticated = (req, res, next) => {
    if (req.userId) {
        return next();
    }

    res.status(401);
    res.json({ error: 'User not authenticated' });
}

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
        res.status(404);
    }
};

export const getUserByToken = async (req, res) => {
    if (!!req.userId) {
        const user = await repository.getUserById(req.userId);
        return res.json({ user })
    } else {
        res.status(401);
        res.json({ error: 'User not authenticated' });
    }
}