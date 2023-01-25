module.exports.isLoggeIn = (req, res, next)=>{
    // passport에 의해서 자동으로 세련에서 역직렬화된 유저 데이터가 들어온다.
    // console.log(req.user)
    
    if(! req.isAuthenticated()){
        req.flash("error","you must be login!!");
        return res.redirect("/login")
    }
    next();
}


