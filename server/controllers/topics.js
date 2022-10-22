const { connection } = require("../mysql");
const { v4 } = require("uuid");
const { deleteImages } = require("../services/imageProcess");

const getAllTopics = async (req, res) => {
    try {
        const query = `SELECT * FROM topics ORDER BY topic`;
        const topics = await connection.query(query);
        res.send({
            topics,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const getPopularTopics = async (req, res) => {
    try {
        const query = `
            SELECT topics.id, topic FROM topics
            LEFT JOIN questions
            ON topics.id=questions.topic_id
            GROUP BY topics.id
            ORDER BY COUNT(questions.id) DESC
            LIMIT 5
        `;
        const topics = await connection.query(query);
        res.send({
            topics,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const createNewTopic = async (req, res) => {
    const { topic } = req.body;
    try {
        const query = `SELECT id FROM topics WHERE topic=?`;
        const [isExists] = await connection.query(query, [topic]);
        if (isExists) {
            return res.status(409).send({
                message: "มีชื่อหัวข้อนี้อยู่ก่อนแล้ว",
            });
        }
        const createTopicQuery = `INSERT INTO topics VALUES (?, ?)`;
        const getCreatedTopicQuery = `SELECT * FROM topics WHERE topic=?`;
        await connection.query("BEGIN");
        await connection.query(createTopicQuery, [v4(), topic]);
        const [createdTopic] = await connection.query(getCreatedTopicQuery, [topic]);
        await connection.query("COMMIT");
        res.status(201).send({
            topic: createdTopic,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const updateTopic = async (req, res) => {
    const { id } = req.params;
    const { topic } = req.body;
    try {
        await connection.query(`UPDATE topics SET topic=? WHERE id=?`, [topic, id]);
        res.status(204).send();
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const deleteTopic = async (req, res) => {
    const { id } = req.params;
    if (!id || id.trim() === "") {
        return res.status(400).send({
            message: "ID must be provided",
        });
    }
    try {
        const [topic] = await connection.query(`SELECT id FROM topics WHERE id=?`, [id]);
        if (!topic) {
            return res.status(409).send({
                message: "ไม่พบTopic",
            });
        }
        await connection.query("BEGIN");
        const blogImageIds = await connection.query(
            `SELECT image_id FROM blog_images LEFT JOIN blogs ON blog_images.blog_id=blogs.id AND blogs.topic_id=?`,
            [id]
        );
        await connection.query(`DELETE FROM interested_in WHERE topic_id=?`, [id]);
        console.log("OK i");
        await connection.query(`DELETE FROM blog_images WHERE blog_id IN (SELECT id FROM blogs WHERE topic_id=?)`, [
            id,
        ]);
        console.log("OK b i");
        await connection.query(`DELETE FROM blogs WHERE topic_id=?`, [id]);
        console.log("OK b");
        await connection.query(`DELETE FROM questions WHERE topic_id=?`, [id]);
        console.log("OK q");
        await connection.query(`DELETE FROM topics WHERE id=?`, [id]);
        await connection.query("COMMIT");

        res.status(204).send();

        deleteImages(blogImageIds);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const getTopic = async (req, res) => {
    const {id} = req.params;
    try {
        const [topic] = await connection.query("SELECT * FROM topics WHERE id=?", [id]);
        if(!topic) {
            return res.status(404).send({
                message: "Not found"
            })
        }
        res.send({
            topic
        })
    }catch(e) {
        res.status(500).send({
            message: "Something went wrong"
        })
    }
}

const getTopicBlogs = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send({
            message: "Topic not found",
        });
    }
    try {
        const query = `
            SELECT blogs.id, title, views, url, topic, created_at FROM blogs
            LEFT JOIN blog_images
            ON blogs.id=blog_images.blog_id
            LEFT JOIN topics
            ON blogs.topic_id=topics.id
            WHERE topics.id=?
            ORDER BY blogs.created_at
        `;
        const blogs = await connection.query(query, [id]);
        res.send({
            blogs,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const getTopicQuestions = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send({
            message: "Topic not found",
        });
    }
    try {
        const query = `
        SELECT questions.id, title, questions.content, users.name, profile_images.url, COUNT(answers.question_id) AS answers,
        topic, questions.created_at FROM questions
        LEFT JOIN topics
        ON questions.topic_id=topics.id
        JOIN users
        ON questions.user_id=users.id
        LEFT JOIN profile_images
        ON users.id=profile_images.user_id
        LEFT JOIN answers
        ON questions.id=answers.question_id
        WHERE questions.topic_id=?
        GROUP BY answers.question_id
        HAVING COUNT(answers.id) > 0
        ORDER BY questions.created_at
    `;
        const questions = await connection.query(query, [id]);
        res.send({
            questions,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

module.exports = {
    getAllTopics,
    getPopularTopics,
    createNewTopic,
    updateTopic,
    deleteTopic,
    getTopic,
    getTopicBlogs,
    getTopicQuestions,
};
