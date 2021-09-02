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

const getUsers = async () => {
    const data = await get('user/all/').then(response => {
        return response.data;
    }).catch(() => {
        console.error("ERROR get users");
        return [];
    })
    return data.users;
};

const updatePassword = async (oldPassword, newPassword) => {
    return await post('user/update/password', {oldPassword, newPassword}).then(() => {
        return true;
    }).catch((e) => {
        console.error("ERROR update password", e);
        return e.response.status;
    })
}

const updateUser = async (user) => {
    return await post('user/update', { user }).then((res) => {
        return res.data.user;
    }).catch(() => {
        console.error("ERROR update user");
        return false;
    });
}

export default {
    login,
    signin,
    getUserByToken,
    getUserNameById,
    getUsers,
    updatePassword,
    updateUser
};