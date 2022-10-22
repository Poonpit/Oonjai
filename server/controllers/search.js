const { connection } = require("../mysql");

const searchBlogs = async (req, res) => {
    const { key } = req.query;
    if (!key || key.trim() === "") {
        return res.send({
            blogs: [],
        });
    }
    const formattedKey = "%" + key + "%";
    try {
        const query = `
            SELECT blogs.id, title, topic, views, url, created_at FROM blogs
            LEFT JOIN blog_images
            ON blogs.id=blog_images.blog_id
            LEFT JOIN topics
            ON blogs.topic_id=topics.id
            WHERE title LIKE ? OR content LIKE ?
        `;
        const blogs = await connection.query(query, [formattedKey, formattedKey]);
        res.send({
            blogs,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const searchQuestions = async (req, res) => {
    const { key } = req.query;
    if (!key || key.trim() === "") {
        return res.send({
            questions: [],
        });
    }
    const formattedKey = "%" + key + "%";
    try {
        const query = `
            SELECT questions.id, title, questions.content, topic, questions.created_at AS created_at, COUNT(answers.id) AS answers
            FROM questions
            LEFT JOIN topics
            ON questions.topic_id=topics.id
            LEFT JOIN answers
            ON answers.question_id=questions.id
            LEFT JOIN users
            ON answers.user_id=users.id
            WHERE title LIKE ? OR questions.content LIKE ?
            GROUP BY answers.question_id
            HAVING COUNT(answers.user_id) > 0
        `;
        const questions = await connection.query(query, [formattedKey, formattedKey]);
        res.send({
            questions,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

module.exports = { searchBlogs, searchQuestions };
