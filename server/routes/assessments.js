// Poon
const { Router } = require("express");
const router = Router();
const { patientAuthorization } = require("../services/authorization");
const { mental_test, covid_test, mantal_result, covid_resule } = require("../controllers/assessments");
const { rateLimitProtection } = require("../services/rate-limiter");

// Routes
// /api/assessments/mental/create รับข้อมูลจากการประเมิน
// [{selected: 1}, {selected: 3}, {selected: 2}, ...]
router.post("/mental/create", rateLimitProtection(10, 30), patientAuthorization, mental_test);

// /api/assessments/covid/create รับข้อมูลจากการประเมิน
// [{selected: 1}, {selected: 3}, {selected: 2}, ...]
router.post("/covid/create", rateLimitProtection(10, 30), patientAuthorization, covid_test);

// /api/assessments/mental ส่งประวัติการประเมินสุขภาพจิตไปให้
// [{id: "123", type: "MENTAL", result: 55, created_at: "วันที่"}]
router.get("/mental", patientAuthorization, mantal_result);

// /api/assessments/covid ส่งประวัติการประเมินความเสี่ยงโควิดไปให้
// [{id: "123", type: "COVID", result: 55, created_at: "วันที่"}]
router.get("/covid", patientAuthorization, covid_resule);

module.exports = router;
