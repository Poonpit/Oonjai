// Pan
const { Router } = require("express");
const { getDoctors, input_img, getDoctor, getDoctorBlogs, removeDoctor, removeQuestions, aggregate } = require("../controllers/admin");
const router = Router();
const { adminAuthorization } = require("../services/authorization");

// /api/admin/doctors ส่งหมอทั้งหมดไปให้
// [{id: "123", name: "หมอปีเตอร์แพน", url: "/xxx.jpg"}]
router.get("/doctors", adminAuthorization, getDoctors);

// /api/admin/doctors/:id ส่งข้อมูลส่วนตัวของหมอที่ระบุไป
// {id: "123", email: "xxx@gmail.com", name: "หมอปีเตอร์แพน", personal_information: "xxxxxx", interest_in: [{id: "1234", topic: "โรคติดหมา"}], created_at: "วันที่"}
router.get("/doctors/:id", adminAuthorization, getDoctor);

// /api/admin/doctors/create เพิ่มบัญชีหมอ
// {email: "xxx@gmail.com", name: "หมอปีเตอร์แพน", profileImage: "ไฟล์รูปถาพ", password: "1234"}
router.post("/doctors/create", adminAuthorization, input_img);

// /api/admin/doctors/:id/blogs ส่งบล็อคของหมอที่ระบุไปให้
// {id: "123", title: "xxxxx", topic: "โรคติดหมา", created_at: "วันที่"}
router.get("/doctors/:id/blogs", adminAuthorization, getDoctorBlogs);

// /doctors/:id ลบหมอ
router.delete("/doctors/:id", adminAuthorization, removeDoctor);

// /questions ลบคำถามที่ไม่มีหมอตอบในช่วงเวลาที่เลือก
// ?period=1week
router.delete("/questions/remove", adminAuthorization, removeQuestions);

router.get("/aggregate", adminAuthorization, aggregate)

module.exports = router;
