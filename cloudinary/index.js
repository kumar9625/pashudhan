const cloudinary = require('cloudinary').v2;
require("dotenv").config();

const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.Cloudinary_Name,
    api_key: process.env.Cloudinary_Key,
    api_secret: process.env.Cloudinary_Secret
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
    folder: 'pets',
    allowedFormats: ['jpg', 'jpeg', 'png'], // supports promises as well
    }

});

module.exports = {
    cloudinary,
    storage
}