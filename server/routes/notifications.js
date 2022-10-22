// Wave
const { Router } = require("express");
const router = Router();
const { userAuthorization } = require("../services/authorization");
const { getNotifications, readNotifications, getUnreadNotifications } = require("../controllers/notifications");

// Routes
// /api/notifications
router.get("/", userAuthorization, getNotifications);

// /api/notifications/read
router.patch("/read", userAuthorization, readNotifications);

router.get("/unread", userAuthorization, getUnreadNotifications);

module.exports = router;
