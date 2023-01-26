const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggeIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.get("/" , wrapAsync(campgrounds.index));

router.get("/new", isLoggeIn, campgrounds.renderNewForm);

router.post("/", isLoggeIn, validateCampground ,wrapAsync(campgrounds.createCampground));

router.get("/:id", wrapAsync(campgrounds.showCampground));

router.get("/:id/edit", isLoggeIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggeIn, isAuthor, validateCampground, wrapAsync(campgrounds.updateCampground));

router.delete("/:id", isLoggeIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;