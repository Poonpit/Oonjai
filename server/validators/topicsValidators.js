const {connection} = require("../mysql");

const createTopicValidator = (req, res, next) => {
    try {
        const { topic } = req.body;
        if (!topic || topic.trim() === "") {
            res.status(400).send({
                message: "โปรดกรอกชื่อหัวข้อ",
            });
        } else {
            next();
        }
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const updateTopicValidator = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {topic} = req.body;
        if(!id || id.trim() === "") {
            res.status(400).send({
                message: "โปรดระบุIDของTopicด้วย"
            })
        } else if(!topic || topic.trim() === "") {
            res.status(400).send({
                message: "โปรดกรอกTopicด้วย"
            })
        } else {
            const query = `SELECT * FROM topics WHERE id=?`;
            const [fetchedTopic] = await connection.query(query, [id]);
            if(!fetchedTopic) {
                return res.status(409).send({
                    message: "ไม่พบTopicดังกล่าว"
                })
            }
            if(fetchedTopic.topic === topic) {
                return res.status(204).send();
            }
            const [isExists] = await connection.query(`SELECT * FROM topics WHERE topic=? AND id!=?`, [topic, id]);
            if(isExists) {
                return res.status(400).send({
                    message: "Topicนี้ถูกใช้ไปแล้ว"
                })
            }
            next();
        }
    }catch(e) {
        res.status(500).send({
            message: "Something went wrong"
        })
    }
}

module.exports = { createTopicValidator, updateTopicValidator };
