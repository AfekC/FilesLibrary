import axios from "axios";

const origin = window.location.origin;

export const post = (path, data) => {
    return axios.post(origin + '/' + path, data)
};

export const get = (path) => {
    return axios.get(origin + '/' + path);
};

export const download = (path) => {
    return axios({
        url: origin + '/' + path,
        method: 'GET',
        responseType: 'blob',
    })
};