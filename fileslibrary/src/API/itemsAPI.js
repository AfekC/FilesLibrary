import { post } from './baseAPI.js';

const uploadFiles = async (data) => {
    const res = await post('item/upload-files', data);
    if (res) {
        return true;
    }
    return false;
};

const createFolder = async (data) => {
    const res = await post('item/new_folder', data);
    if (res) {
        return true;
    }
    return false;
};

const getFilesByPath = async (path) => {
    const res = await post('item/', path);
    if (res) {
        return res.files;
    }
    return;
};

export default {
    uploadFiles,
    createFolder,
    getFilesByPath,
};