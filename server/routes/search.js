// Wave
const { Router } = require("express");
const router = Router();
const { searchBlogs, searchQuestions } = require("../controllers/search");

// Routes
// /api/search/blogs
router.get("/blogs", searchBlogs);

// /api/search/questions
router.get("/questions", searchQuestions);

module.exports = router;
