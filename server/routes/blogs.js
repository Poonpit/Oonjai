// Dew
const { Router } = require("express");
const router = Router();
const { CreateBlogs, DeleteBlogs, UpdateBlogs, GetBlog, GetMyBlog, GetRelateBlog, GetRecommendBlog, increaseBlogViews} = require("../controllers/blogs");
const { doctorAuthorization } = require("../services/authorization");

// Routes
// /api/blogs/create สร้างบล็อค
// {title: "xxx", (image: ไฟล์รูปภาพ), content: "xxxx", topic_id: "1234"}
router.post("/create", doctorAuthorization, CreateBlogs);

// /api/blogs/my-blogs ส่งBlogsทั้งหมดที่หมอสร้าง
// {id: "123", title: "xxx", url: "/blog-image.jpg", topic: "โรคติดหมา", created_at: "วันเวลา"}
router.get("/my-blogs", doctorAuthorization, GetMyBlog);

// /api/blogs/:id ส่งข้อมูลของบล็อค
// {id: "123", title: "xxx", content: "xxxx", url: "/blog-image.jpg", views: 22, doctor_id: "12345", name: "ชื่อหมอ", profileImageUrl: "/profile-image.jpg",  created_at: "วันเวลา"}
router.get("/:id", GetBlog);

// /api/blogs/:id/update แก้ไขข้อมูลของบล็อค
// {title: "xxx", content: "xxx", image: รูปภาพ}
router.patch("/:id/update", doctorAuthorization, UpdateBlogs);

// /api/blogs/:id ลบบล็อค
router.delete("/:id", doctorAuthorization, DeleteBlogs);

// /api/blogs/topics/:topic_id/related-blogs ส่งบล็อคที่อยู่ในTopicที่เลือกไปให้ 5 บล็อค
// [{id: "123", title: "xxxx", url: "blog-image.jpg", topic: "โรคติดหมา"}]
router.get("/topics/:topic_id/related-blogs", GetRelateBlog);

// /api/blogs/recommended/latest ส่งบล็อคไป3บล็อค เรียงตามเวลาที่สร้างมาก-น้อย
// [{id: "123", title: "xxx", content: "xxx", url: "รูปของบล็อค", views: 12, created_at: "วันเวลา"}]
router.get("/recommended/latest", GetRecommendBlog);

router.patch("/:id/increase/views", increaseBlogViews)

module.exports = router;