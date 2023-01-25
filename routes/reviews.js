const express = require("express");
// 라우터를 나누었기 때문에 분리되서 매개변수를 갖는다. 그렇기 때문에 패스파라미터에 해당하는 id값을 가지고 오기 위해서 필요한 옵션이다.
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js")

const validateReview = (req,res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// REVIEW ROUTERS
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    console.log(campground)
    console.log(review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Create a new Review");
    res.redirect(`/campgrounds/${campground._id}`)
}));

// 리뷰를 지우게 되면 참조하고 있는 캠핑장에서도 해당 리뷰id를 지워 주어야 한다.
// 이때 사용할 수 있는 연산자 중 하나가 pull 연산자로 배열 수정 연산자이다.
// 배열에 있는 모든 인스턴스 중에서 특정 조건을 만족하는 값을 지우는 것이다.
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Delete Review");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
