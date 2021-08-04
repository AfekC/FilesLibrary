import { post } from './baseAPI.js';

const uploadFiles = async (data) => {
    const res = await post('item/upload-files', data);
    if (res) {
        return true;
    }
    return false;
};

const createFolder = async (data) => {
    return  await post('item/new_folder', data).then(() => {
        return true
    }).catch((e) => {
        console.log(e)
        return false
    });
};

const getFilesByCurrentFolderId = async (currDirId) => {
    const res = await post('item/', { currDirId });
    if (res) {
        return res.data.items;
    }
    return;
};

export default {
    uploadFiles,
    createFolder,
    getFilesByCurrentFolderId,
};