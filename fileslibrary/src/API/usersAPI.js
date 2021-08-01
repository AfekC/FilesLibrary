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
        return response.data
    }).catch(() => {
        console.log('error')
        return {};
    });
    return data.user;
};

export default {
    login,
    signin,
    getUserByToken,
};