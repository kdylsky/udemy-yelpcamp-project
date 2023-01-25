const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

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

//[Front] static 서비스 이용을 위한 설정
app.use(express.static(path.join(__dirname, "public")))

// 세션 설정하기
const sessionCongif = {
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    //다른 옵션으로는 저장소를 등록할 수 있다. 현재는 메모리 저장소를 사용하고 있다.
    
    //쿠키 설정을 할 수 있다.
    cookie:{
        // 간단한 보안코드 추가
        // true로 설정하게 되면 클라이언트 측 스크립트에서 해당 쿠키에 접근할 수없고 
        // xss결함이 있거나 사용자가 결함을 일으키는 링크에 접근하면 브라우저가 제 3자에세 쿠키를 유출하지 않도록한다.
        httpOnly: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 *7, // 만료되는 시점 설정
        maxAge  : 1000 * 60 * 60 * 24 *7 // 얼마동안 유지되는지 설정
    }
}
app.use(session(sessionCongif));

// flash설정하기
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


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

