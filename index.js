const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const {campgroundSchema, reviewSchema} = require("./schemas.js");

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp-project')
    .then(()=>{
        console.log("mongoDB CONNECT");
    })
    .catch((err)=>{
        console.log("OH mongoDB ERR")
        console.log(err)
    });

//ejs-mate를 사용하기 위하 세팅
app.engine("ejs", ejsMate)
app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");

//req.body는 비어있는 것이 기본이기 때문에 파싱을 해주어야 한다.
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req,res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// CAMPGROUND ROUTERS

app.get("/", (req,res)=>{
    res.render("home") 
})

app.get("/campgrounds" , wrapAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}));

app.get("/campgrounds/new", (req,res)=>{
    res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground ,wrapAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const {campground} = req.body;
    const newCampground = new Campground(campground); 
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.get("/campgrounds/:id", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/detail", {campground});
}));

app.get("/campgrounds/:id/edit", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground});
}));

app.put("/campgrounds/:id", validateCampground, wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true});
    // await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete("/campgrounds/:id", wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));



// REVIEW ROUTERS
app.post("/campgrounds/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

// 리뷰를 지우게 되면 참조하고 있는 캠핑장에서도 해당 리뷰id를 지워 주어야 한다.
// 이때 사용할 수 있는 연산자 중 하나가 pull 연산자로 배열 수정 연산자이다.
// 배열에 있는 모든 인스턴스 중에서 특정 조건을 만족하는 값을 지우는 것이다.
app.delete("/campgrounds/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
    
}))



// 404를 추가하는 방법
// 알 수 없는 url로 접근할 경우, 상단의 요청이 닿지 않은 경우에만 실행된다.
// next()를 호출함으로써 밑에 있는 제네릭 오류 핸들러가 실행된다.
app.all("*", (req,res,next)=>{
    next(new ExpressError("Page Not Found", 404));
})

// try...catch를 해서 비동기 함수를 감싸지 않으면 정의한 에러 핸들러로 들어오지 않는다.
app.use((err, req, res, next)=>{
    const { status=500 } = err;
    if(!err.message){
        err.message = "Something is Wrong";
    }
    res.status(status).render("error", {err});
})

app.listen(3000, ()=>{
    console.log("SERVING 3000 PORT")  
})

