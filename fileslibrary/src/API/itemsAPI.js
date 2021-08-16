import { post, download } from './baseAPI.js';
const FileDownload = require('js-file-download');

const uploadFiles = async (data) => {
    return await post('item/upload-files', data).then(() => {
        return true
    }).catch(() => {
        return false;
    });
};

const createFolder = async (data) => {
    return  await post('item/new_folder', data).then(() => {
        return true
    }).catch(() => {
        return false;
    });
};

const getFilesByCurrentFolderId = async (currDirId) => {
    const res = await post('item/', { currDirId });
    if (res) {
        return res.data.items;
    }
    return;
};

const deleteItem = async (id) => {
    return  await post(`item/delete/${id}`, {}).then(() => {
        return true
    }).catch((e) => {
        console.log(e);
        return false;
    });
};

const downloadItem = async (item) => {
    return await download(`item/${item.id}`).then((response) => {
        FileDownload(response.data, item.name);
    });
};

export default {
    uploadFiles,
    createFolder,
    getFilesByCurrentFolderId,
    deleteItem,
    downloadItem,
};