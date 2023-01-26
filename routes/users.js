const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

router.get("/register", (req,res)=>{
    res.render("users/register")
})

router.post("/register", wrapAsync(async(req,res, next)=>{
    // 제네릭한 에러 핸들러로 가는 것을 막기 위해서 try..catch를 이용한다
    try{
        const {email, username, password} = req.body;
        // passport-local-mongoose로 플로그인 해서 사용할 수 있는 메서드들이다.
        // 유저객체를 패스워드 없이 먼저 만든다.
        const user = new User({email, username});
        // 만들어진 유저 객체를 패스워드를 암호화해서 등록하는 것이다.
        const registedUser = await User.register(user, password);
        
        // 회원가입 후 바로 로그인을 하게 하기 위한 코드이다.
        req.login(registedUser, err=>{
            if(err) return next(err)
            req.flash("success", "Welcome to YelpCamp")
            res.redirect("/campgrounds");
    })
    
    // 아직은 로그인되었는지 추적하지 않는다.    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register")
    }
}))

router.get("/login", (req,res)=>{
    res.render("users/login")
})

// passport에서 제공하는 미들웨어 메서드를 이용해서 로그인을 한다.
// 전략을 명시적으로 알려주어야 한다.
// 만약 전략이 여러개라면 여러개를 적으면 된다.
// router.post("/login", passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}), wrapAsync(async(req,res)=>{    
//     console.log(req.session)
//     const redirectUrl = req.session.returnTo || "/campgrounds";
//     // 미들웨어가 로그인에 관한 과정을 모두 처리해준다.
//     req.flash("success", "Welcome back to Campground!!!");
//     res.redirect("/campgrounds");
// }))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // req.flash('success', 'welcome back!');
    // const redirectUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) next(err);
      req.flash("success", "Goodbye 😊");
      res.redirect("/campgrounds");
    });
  });

module.exports = router;

