import { get, post } from './baseAPI.js';

const login = (data, func) => {
    return post('user/login', data).then((response) => {
        if (response) {
            func(response);
            return true;
        }
        return false;
    }).catch(() => false);
};

const signin = (data, func) => {
    return post('user/signin', data).then((response) => {
        if (response) {
            func(response);
            return true;
        }
        return false;
    });
};

const getUserByToken = async () => {
    const data = await get('user/').then((response) => {
        return response.data;
    }).catch(() => {
        console.error("ERROR get user by token");
        return {};
    });
    return data.user;
};

const getUserNameById = async (id) => {
    const data = await get('user/username/' + id).then(response => {
        return response.data;
    }).catch(() => {
        console.error("ERROR get username for id:", id);
        return {};
    })
    return data.userName;
};

export default {
    login,
    signin,
    getUserByToken,
    getUserNameById,
};