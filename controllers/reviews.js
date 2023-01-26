const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Create a new Review");
    res.redirect(`/campgrounds/${campground._id}`)
}

// 리뷰를 지우게 되면 참조하고 있는 캠핑장에서도 해당 리뷰id를 지워 주어야 한다.
// 이때 사용할 수 있는 연산자 중 하나가 pull 연산자로 배열 수정 연산자이다.
// 배열에 있는 모든 인스턴스 중에서 특정 조건을 만족하는 값을 지우는 것이다.
module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Delete Review");
    res.redirect(`/campgrounds/${id}`);
}