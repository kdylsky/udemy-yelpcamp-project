const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.renderRegister = (req,res)=>{
    res.render("users/register")
}

module.exports.register = async(req,res, next)=>{
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
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login")
}

module.exports.login = (req, res) => {
    // req.flash('success', 'welcome back!');
    // const redirectUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) next(err);
      req.flash("success", "Goodbye 😊");
      res.redirect("/campgrounds");
    });
  }