// Din
const { Router } = require("express");
const { doctorAuthorization, patientAuthorization, userAuthorization } = require("../services/authorization");
const router = Router();

// REQ from CONTROLLER
const {
    getLatest,
    getInterest,
    getQuestion,
    getUserQuestion,
    updateQuestion,
    delQuestion,
    banQuestion,
    getAnswer,
    addAnswer,
    updateAnswer,
    replyAnswer,
    delAnswer,
    createQuestion,
    getRelatedQuestions,
    increaseQuestionView,
} = require("../controllers/questions");
const { rateLimitProtection } = require("../services/rate-limiter");

// Routes

router.get("/related/:id", patientAuthorization, getRelatedQuestions);

router.post("/create", rateLimitProtection(10, 20), userAuthorization, createQuestion);

// /api/questions/latest ส่งคำถามล่าสุดที่มีหมอตอบแล้ว 5 คำถาม
// [{id: "123", title: "xxx", content: "xxxx", topic: "โรคติดหมา", name: "ชื่อเจ้าของคำถาม", url: "urlของรูปโปรของเจ้าของคำถาม", created_at: "วันเวลา", number_of_answers: 3, status: ถ้ามีหมอตอบแล้วก็เป็นtrue ถ้าไม่ก็false}]
router.get("/latest", getLatest);

// /api/questions/doctor/interested ส่งคำถามล่าสุด(ที่ยังไม่ได้ตอบ)ที่อยู่ในความสนใจของหมอที่ร้องขอ
// [{id: "123", title: "xxx", content: "xxxx", topic: "โรคติดหมา", name: "ชื่อเจ้าของคำถาม", url: "urlของรูปโปรของเจ้าของคำถาม", created_at: "วันเวลา", number_of_answers: 3, status: ถ้ามีหมอตอบแล้วก็เป็นtrue ถ้าไม่ก็false}]
router.get("/doctor/questions/interested", doctorAuthorization, getInterest);

// /api/questions/my-questions ส่งคำถามที่ผู้ป่วยเคยถาม
// [{id: "123", title: "xxx", content: "xxxx", topic: "โรคติดหมา", name: "ชื่อเจ้าของคำถาม", url: "urlของรูปโปรของเจ้าของคำถาม", created_at: "วันเวลา", number_of_answers: 3, status: ถ้ามีหมอตอบแล้วก็เป็นtrue ถ้าไม่ก็false}]
router.get("/my-questions", patientAuthorization, getUserQuestion);

// /api/questions/:id ส่งข้อมูลคำถาม
// {id: "123", title: "xxx", content: "xxxx", views: 10, name: "ชื่อคนถาม", url: "/profile-image.jpg", created_at: "วันเวลา"}
router.get("/:id", getQuestion);

router.patch("/:id/views/increase", increaseQuestionView);

// /api/questions/:id/update เจ้าของคำถามแก้ไขคำถาม
// {title: "xxx", content: "xxx", topic_id: "1234"}
router.patch("/:id/update", rateLimitProtection(10, 30), patientAuthorization, updateQuestion);

// /api/questions/:id เจ้าของคำถามลบคำถาม
router.delete("/:id", patientAuthorization, delQuestion);

// /api/questions/:id/ban หมอแบนคำถาม
router.delete("/:id/ban", doctorAuthorization, banQuestion);

// /api/questions/:id/answers responseคำตอบของคำถามที่ระบุ
// [{id: "123", content: "xxx", id: "idผู้ใช้", name: "xxx", role: "DOCTOR", url: "/profile-image.jpg", created_at: "วันเวลา"}]
router.get("/:id/answers", getAnswer);

// /api/questions/:id/answer ตอบคำถาม สำหรับเจ้าของคำถามและแพทย์ที่เคยตอบคำถามนั้น
// {content: "xxx"}
router.post("/:id/answers", rateLimitProtection(10, 40), userAuthorization, addAnswer);

// /api/questions/:q_id/answers/:a_id/update เจ้าของคำตอบแก้ไขคำตอบของตัวเอง
// {content: "xxx"}
router.patch("/:q_id/answers/:a_id/update", rateLimitProtection(10, 40), userAuthorization, updateAnswer);

// /api/questions/:q_id/answers/:a_id/reply ตอบกลับคำตอบ
// {replied_to: "idของเจ้าของคำตอบที่เราจะตอบกลับ", content: "xxx"}
router.post("/:q_id/answers/:a_id/reply", rateLimitProtection(10, 40), userAuthorization, replyAnswer);

// /api/questions/:q_id/answers/:a_id เจ้าของคำตอบลบคำตอบ
router.delete("/:q_id/answers/:a_id", delAnswer);

module.exports = router;
