const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const users = require("../controllers/users")


router.get("/register", users.renderRegister);
router.post("/register", wrapAsync(users.register))
router.get("/login", users.renderLogin)

// passport에서 제공하는 미들웨어 메서드를 이용해서 로그인을 한다.
// 전략을 명시적으로 알려주어야 한다.
// 만약 전략이 여러개라면 여러개를 적으면 된다.
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
router.get("/logout", users.logout);

module.exports = router;