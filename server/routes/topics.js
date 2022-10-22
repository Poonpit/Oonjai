// Wave
const { Router } = require("express");
const router = Router();
const {
    getAllTopics,
    getPopularTopics,
    createNewTopic,
    updateTopic,
    deleteTopic,
    getTopic,
    getTopicBlogs,
    getTopicQuestions
} = require("../controllers/topics");
const { createTopicValidator, updateTopicValidator } = require("../validators/topicsValidators");
const { doctorAuthorization } = require("../services/authorization");

// Routes
// /api/topics
router.get("/", getAllTopics);

// /api/topics/popular
router.get("/popular", getPopularTopics);

// /api/topics/create
router.post("/create", doctorAuthorization, createTopicValidator, createNewTopic);

// /api/topics/:id/update
router.patch("/:id/update", doctorAuthorization, updateTopicValidator, updateTopic);

// /api/topics/:id
router.delete("/:id", doctorAuthorization, deleteTopic);

// /api/topics/:id
router.get("/:id", getTopic);

// /api/topics/:id/blogs
router.get("/:id/blogs", getTopicBlogs);

// /api/topics/:id/questions
router.get("/:id/questions", getTopicQuestions);

module.exports = router;
