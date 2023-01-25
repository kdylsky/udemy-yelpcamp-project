const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgroundsRouters = require("./routes/campgrounds")
const reviewRouters = require("./routes/reviews");

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

app.get("/", (req,res)=>{
    res.render("home") 
})

app.use('/campgrounds', campgroundsRouters);
app.use("/campgrounds/:id/reviews", reviewRouters);

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

