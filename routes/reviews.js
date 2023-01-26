const express = require("express");
// 라우터를 나누었기 때문에 분리되서 매개변수를 갖는다. 그렇기 때문에 패스파라미터에 해당하는 id값을 가지고 오기 위해서 필요한 옵션이다.
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { isLoggeIn, isReviewAuthor, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");


// REVIEW ROUTERS
router.post("/", isLoggeIn, validateReview, wrapAsync(reviews.createReview));
router.delete("/:reviewId", isLoggeIn, isReviewAuthor,  wrapAsync(reviews.deleteReview))

module.exports = router;
