

import { get, post, download, upload } from './baseAPI.js';
import Swal from "sweetalert2";
const FileDownload = require('js-file-download');

const uploadFiles = async (data, config) => {
    return await upload('item/upload-files', data, config).then(() => {
        return true
    }).catch(() => {
        return false;
    });
};

const createFolder = async (data) => {
    return await post('item/new_folder', data).then(() => {
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
    Swal.fire({
        title:"Preparing for download...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton:false,
        width: '400px',
    });
    Swal.showLoading(Swal.getDenyButton())
    return await download(`item/${item.id}`).then((response) => {
        Swal.close();
        FileDownload(response.data, item.name);
        return true;
    }).catch((e) => {
        console.error(e);
        return false;
    });
};

const changeItemAccess = async (data) => {
    return await post(`item/changeItemAccess`, data).then(() => {
        return true
    }).catch((e) => {
        console.log(e);
        return false;
    });
};

const getItemUsers = async (id) => {
    return await get(`item/getItemUsers/${id}`).then(({data}) => {
        return data;
    }).catch((e) => {
        console.log(e);
        return false;
    });
};

export default {
    uploadFiles,
    createFolder,
    getFilesByCurrentFolderId,
    deleteItem,
    downloadItem,
    changeItemAccess,
    getItemUsers,
};