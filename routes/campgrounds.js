const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas.js")

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/" , wrapAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}));

router.get("/new", (req,res)=>{
    res.render("campgrounds/new");
});

router.post("/", validateCampground ,wrapAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const {campground} = req.body;
    const newCampground = new Campground(campground); 
    await newCampground.save();
    // flash 설정하기 
    req.flash("success", "Successfully made a new campgrounds");
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/:id", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground){
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/detail", {campground});
}));

router.get("/:id/edit", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", {campground});
}));

router.put("/:id", validateCampground, wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true});
    // await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete("/:id", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}));

module.exports = router;