const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
 
const app = express();
 
//cloudinary의 계정과 코드에서 생성되는 cloudinary의 인스턴스를 연결해준다.
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

// 저장공간에 대한 설정이다.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'YelpCamp',
    allowedFormats:["jpeg", "png","jpg"],
    // format: async (req, file) => 'png', // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});
 
module.exports={
    cloudinary,
    storage
}
// const parser = multer({ storage: storage });
 
// app.post('/upload', parser.single('image'), function (req, res) {
//   res.json(req.file);
// });