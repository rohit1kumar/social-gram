const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);   //promisify the fs.unlink function

// cloudinary config files
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // api key
    api_secret: process.env.CLOUDINARY_API_SECRET, // api secret
});

const uploadToCloud = (path, folderName) => {
    return cloudinary.uploader.upload(path, { folder: folderName }); // upload from server to cloudinary
};

const deleteFromCloud = (path) => {
    return cloudinary.uploader.destroy(path); // delete the file in cloudinary
};

const uploadToServer = multer({ dest: 'uploads/' }); // upload to server

const deletFromServer = (path) => {
    return unlinkfile(path); //delete file from server
};

module.exports = { uploadToCloud, deleteFromCloud, uploadToServer, deletFromServer };
