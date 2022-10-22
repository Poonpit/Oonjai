// Pan
const { Router } = require("express");
const router = Router();
const { login, signup, verify } = require("../controllers/auth");
const { signinValidator } = require("../validators/authValidators");
const {rateLimitProtection} = require("../services/rate-limiter");

// Routes
// /api/auth/signin ลงชื่อเข้าใช้
// {email: "xxx@gmail.com", password: "1234"}
router.post("/signin", signinValidator, login);

// /api/auth/signup สมัครบัญชี
// {email: "xxx@gmail.com", name: "xxx", password: "1234", birthday: "2022-01-01"}
router.post("/signup", rateLimitProtection(10, 30), signup);

// /api/auth/verify ยืนยันตัวตนผู้ใช้ผ่านToken
// {token: "xxxxxxx"}
router.patch("/verify", verify);

module.exports = router;
