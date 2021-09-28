import axios from "axios";
import store from "../store";

const origin = 'http://'+window.location.hostname+':4000';

const authenticationExpiredHandler = (e) => {
    if (e.response.status === 401) {
        store.dispatch('logout');
    }
    throw e;
};

export const post = (path, data) => {
    return axios.post(origin + '/' + path, data).catch((e) => {
        authenticationExpiredHandler(e);
    })
};

export const get = (path) => {
    return axios.get(origin + '/' + path).catch((e) => {
        authenticationExpiredHandler(e);
    })
};

export const download = (path) => {
    return axios({
        url: origin + '/' + path,
        method: 'GET',
        responseType: 'arraybuffer',
    }).catch((e) => {
        authenticationExpiredHandler(e);
    })
};