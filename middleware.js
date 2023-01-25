module.exports.isLoggeIn = (req, res, next)=>{
    if(! req.isAuthenticated()){
        req.flash("error","you must be login!!");
        return res.redirect("/login")
    }
    next();
}


