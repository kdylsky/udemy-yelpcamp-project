const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");


router.get("/register", (req,res)=>{
    res.render("users/register")
})

router.post("/register", wrapAsync(async(req,res)=>{
    // 제네릭한 에러 핸들러로 가는 것을 막기 위해서 try..catch를 이용한다
    try{
    const {email, username, password} = req.body;
    // passport-local-mongoose로 플로그인 해서 사용할 수 있는 메서드들이다.
    // 유저객체를 패스워드 없이 먼저 만든다.
    const user = new User({email, username});
    // 만들어진 유저 객체를 패스워드를 암호화해서 등록하는 것이다.
    const registedUser = await User.register(user, password);
    req.flash("success", "Welcome to YelpCamp")
    res.redirect("/campgrounds");
    // 아직은 로그인되었는지 추적하지 않는다.    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register")
    }
}))

module.exports = router;

