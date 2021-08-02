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

const getFilesByPath = async (currDirId) => {
    const res = await post('item/', { currDirId });
    if (res) {
        return res.data.items;
    }
    return;
};

export default {
    uploadFiles,
    createFolder,
    getFilesByPath,
};