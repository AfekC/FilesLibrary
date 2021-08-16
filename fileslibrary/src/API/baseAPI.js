import axios from "axios";

export const post = (path, data) => {
    return axios.post(`http://localhost:4000/${path}`, data)
};

export const get = (path) => {
    return axios.get(`http://localhost:4000/${path}`);
};

export const download = (path) => {
    return axios({
        url: `http://localhost:4000/${path}`,
        method: 'GET',
        responseType: 'blob',
    })
};