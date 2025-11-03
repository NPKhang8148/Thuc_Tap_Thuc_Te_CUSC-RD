// config/cloudinary.js
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config(); // Đảm bảo load biến môi trường

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//console.log("Cloudinary config:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);


module.exports = cloudinary;

