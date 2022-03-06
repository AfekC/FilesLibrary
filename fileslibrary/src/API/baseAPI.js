import axios from "axios";
import store from "../store";
import Swal from "sweetalert2";

const origin = 'http://'+window.location.hostname+':4000';

const generalErrorHandler = (e) => {
    if(!e.response){
        Swal.fire("Error", "network error", "error");
    } else if (e.response.status === 401) {
        store.dispatch('logout');
        Swal.fire("Error", "authentication error", "error");
    } else {
        console.log(e);
        Swal.fire("Error", "unknown error", "error");
    }
    throw e;
};

export const post = (path, data) => {
    return axios.post(origin + '/' + path, data).catch((e) => {
        generalErrorHandler(e);
    })
};

export const upload = (path, data, config) => {
    return axios.post(origin + '/' + path, data, config).catch((e) => {
        generalErrorHandler(e);
    })
};

export const get = (path) => {
    return axios.get(origin + '/' + path).catch((e) => {
        generalErrorHandler(e);
    })
};

export const download = (path) => {
    return axios({
        url: origin + '/' + path,
        method: 'GET',
        responseType: 'arraybuffer',
    }).catch((e) => {
        generalErrorHandler(e);
    })
};