const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggeIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

//multer설정
//저장 위치를 설정한다.
const multer = require("multer");
const upload = multer({dest:"uploads/"})
// upload에는 single와 array 등이 있다.
// 위의 메서드를 사용하게 되면 multer가 body를 파싱하게 된다.

router.get("/" , wrapAsync(campgrounds.index));

router.get("/new", isLoggeIn, campgrounds.renderNewForm);

// router.post("/", isLoggeIn, validateCampground ,wrapAsync(campgrounds.createCampground));
//"image"는 폼에 있는 name명이다.
//미들웨어가 request에 file속성을 추가하고 body에도 추가한다.

// 단일 파일
// router.post("/", upload.single("image"),(req,res)=>{
//     console.log(req.body)
//     console.log()
//     console.log(req.file)
// })

// 다중 파일
router.post("/", upload.array("image"),(req,res)=>{
    console.log(req.body)
    console.log()
    console.log(req.files)
})

router.get("/:id", wrapAsync(campgrounds.showCampground));

router.get("/:id/edit", isLoggeIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggeIn, isAuthor, validateCampground, wrapAsync(campgrounds.updateCampground));

router.delete("/:id", isLoggeIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;