// Poon
const { Router } = require("express");
const router = Router();
const { userAuthorization, patientAuthorization, doctorAuthorization } = require("../services/authorization");
const {
    getProfile,
    getProfile_doctor,
    doctors_information,
    UpdateProfile_Patient,
    UpdateProfile_doctor,
    UpdatePassword,
    addTopic,
    delete_topic,
} = require("../controllers/profile");
const { rateLimitProtection } = require("../services/rate-limiter");

// Routes
// /api/profile ส่งข้อมูลโปรไฟลของตัวเอง(patient)
// {id: "123", email: "xxx@gmail.com", name: "xxx", birthday: "วันเกิด", interested_in: [{id: "1234", topic: "โรคติดหมา"}]}
router.get("/", patientAuthorization, getProfile);

// /api/profile/doctor ส่งข้อมูลโปรไฟล์ของตัวเอง(doctor)
// {id: "123", email: "xxx@gmail.com", name: "xxx", personal_information: "xxxx", url รูปโปรไฟล์, interested_in: [{id: "1234", topic: "โรคติดหมา"}]}
router.get("/doctor", doctorAuthorization, getProfile_doctor);

// /api/profile/doctors/:id ส่งข้อมูลของหมอให้ผู้ใช้ทั่วไป
// {id: "123", name: "xxx", url: "/xxx.jpg", personal_information: "xxx", interested_in: [{id: "1234", topic: "โรคติดหมา"}]}
router.get("/doctors/:id", doctors_information);

// /api/profile อัพเดทโปรไฟล์ สำหรับผู้ป่วย
// {name: "New Name", birthday: "วันเกิด"}
router.patch("/", rateLimitProtection(10, 40), patientAuthorization, UpdateProfile_Patient);

// /api/profile/doctor อัพเดทโปรไฟล์ สำหรับแพทย์
// {name: "New Name", personal_information: "xxxxx"}
router.patch("/doctor", doctorAuthorization, UpdateProfile_doctor);

// /api/profile/password/change เปลียนรหัสผ่าน
// {password: "1234"}
router.patch("/password/change", userAuthorization, UpdatePassword);

// /api/profile/attentions/add เพิ่มTopicทที่สนใจอันใหม่
router.patch("/attentions/add", rateLimitProtection(10, 50), userAuthorization, addTopic);

// /api/profile/attentions/remove/:id ลบTopicที่เคยสนใจ
router.delete("/attentions/remove/:id", userAuthorization, delete_topic);

module.exports = router;
