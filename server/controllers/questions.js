const { v4 } = require("uuid");
const { connection } = require("../mysql");

const getRelatedQuestions = async (req, res) => {
    const topicId = req.params.id;
    try {
        const questions = await connection.query(
            `SELECT questions.id, title, questions.content, views, questions.created_at FROM questions
            LEFT JOIN answers
            ON questions.id=answers.question_id
            WHERE questions.topic_id=?
            GROUP BY answers.question_id 
            HAVING COUNT(answers.id)>0
            ORDER BY views DESC`,
            [topicId]
        );
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

const increaseQuestionView = async (req, res) => {
    try {
        const qid = req.params.id;
        await connection.query("UPDATE questions SET views = views + 1 WHERE id=?", [qid]);
        res.send({});
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// CREATE QUESTION - for patient

const createQuestion = async (req, res) => {
    const owner = req.user.userId;
    const qid = v4();
    const title = req.body.title;
    const content = req.body.content;
    const topic = req.body.topicId;
    try {
        const qry = `
            insert into questions values('${qid}','${title}','${content}',0,'${topic}','${owner}',NOW())
        `;
        await connection.query(qry);
        const interested_users = await connection.query(
            `
            SELECT users.id FROM users
            LEFT JOIN interested_in
            ON users.id=interested_in.user_id
            WHERE interested_in.topic_id=? AND users.role="DOCTOR"
        `,
            [topic]
        );
        for (let i = 0; i < interested_users.length; i++) {
            const ins = `
                insert into notifications values('${v4()}','QUESTION',NULL,'${qid}','${interested_users[i].id}',NOW())
            `;
            await connection.query(ins);
            await connection.query(
                `UPDATE users SET unread_notification = unread_notification+1 WHERE id="${interested_users[i].id}"`
            );
        }
        res.status(200).send({ message: "question created" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// LATEST QUESTION - 5 most latest question

const getLatest = async (req, res) => {
    try {
        const qry = `
            select q.id, q.title, q.content, t.topic, u.name, p.url, q.created_at,count(a.id) as 'number_of_answers',
                (case when (count(a.id)>0) then TRUE else FALSE end) as 'status'
            from questions q, users u, answers a, topics t, profile_images p
            where q.id = a.question_id
                and q.topic_id = t.id
                and q.user_id = u.id
                and u.id = p.user_id
            group by q.id
            having status = 1
            order by created_at DESC
            limit 5
        `;
        const result = await connection.query(qry);
        res.status(200).send({ questions: result });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// INTERESTED QUESTION - from what doctor interested in

const getInterest = async (req, res) => {
    const doctor = req.user.userId;
    try {
        const query = `
            SELECT questions.id, questions.title, questions.content, topics.topic, users.name, profile_images.url,
            COUNT(answers.id) as "answers", questions.created_at FROM questions
            LEFT JOIN topics ON questions.topic_id=topics.id
            LEFT JOIN users ON questions.user_id=users.id
            LEFT JOIN profile_images ON users.id=profile_images.user_id
            LEFT JOIN answers ON questions.id=answers.question_id
            WHERE topics.id IN (SELECT topic_id FROM interested_in WHERE user_id="${doctor}")
            GROUP BY questions.id
            HAVING COUNT(answers.id)=0
            ORDER BY questions.created_at DESC
        `;
        const result = await connection.query(query);
        res.status(200).send({ questions: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// GET QUESTION - from question id

const getQuestion = async (req, res) => {
    const qid = req.params.id;
    try {
        const qry = `
            select q.id, q.title, q.content, q.views, q.user_id, u.name, u.birthday, p.url, t.topic, t.id as topic_id, q.created_at
            from questions q, users u, profile_images p, topics t
            where q.user_id = u.id
                and u.id = p.user_id
                and q.id = '${qid}'
                and q.topic_id = t.id
        `;
        const [result] = await connection.query(qry);

        res.status(200).send({ question: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// GET USER'S QUESTIONS - all questions from specific patient

const getUserQuestion = async (req, res) => {
    const uid = req.user.userId;
    try {
        const qry = `
            select q.id, q.title, q.content, t.topic, q.created_at,count(a.id) as 'number_of_answers',
                (case when (count(a.id)>0) then TRUE else FALSE end) as 'status'
            from questions q, answers a, topics t
            where q.id = a.question_id
                and q.topic_id = t.id
                and q.user_id = '${uid}'
            order by created_at DESC
        `;
        const query = `
            SELECT questions.id, questions.title, questions.content, topics.topic, questions.created_at, COUNT(answers.id) as number_of_answers,
            (CASE WHEN COUNT(answers.id)>0 THEN TRUE ELSE FALSE END) as status
            FROM questions
            LEFT JOIN topics ON questions.topic_id=topics.id
            LEFT JOIN answers ON questions.id=answers.question_id
            WHERE questions.user_id="${uid}"
            GROUP BY questions.id
            ORDER BY created_at DESC
        `;
        const result = await connection.query(query);
        res.status(200).send({ questions: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// UPDATE QUESTION - for owner

const updateQuestion = async (req, res) => {
    const qid = req.params.id;
    title = req.body.title;
    content = req.body.content;
    tid = req.body.topic_id;
    try {
        const qry = `
            update questions set title = '${title}', content = '${content}', topic_id = '${tid}' WHERE id="${qid}"
        `;
        await connection.query(qry);
        res.status(200).send({ message: "update success" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// DELETE QUESTION - for owner

const delQuestion = async (req, res) => {
    const qid = req.params.id;
    try {
        const qry = `
            delete from questions where id = '${qid}'
        `;
        await connection.query(qry);
        res.status(200).send({ message: "question deleted" });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// BAN QUESTION - for doctors

const banQuestion = async (req, res) => {
    const nid = v4();
    const qid = req.params.id;
    try {
        const [question] = await connection.query(`SELECT user_id FROM questions WHERE id=?`, [qid]);

        await connection.query("UPDATE users SET banned_questions = banned_questions+1 WHERE id=?", [question.user_id]);

        const qry = `
            delete from questions where id = '${qid}'
        `;
        await connection.query(qry);
        const ins = `
            insert into notifications values('${nid}','QUESTION_BANNED',NULL,NULL,"${question.user_id}",NOW())
        `;
        await connection.query(ins);
        await connection.query(
            `UPDATE users SET unread_notification = unread_notification+1 WHERE id="${question.user_id}"`
        );

        res.status(200).send({ message: "question banned" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

// GET ANSWER - from question id

const getAnswer = async (req, res) => {
    const qid = req.params.id;
    try {
        const qry = `
            select a.id, a.content, a.user_id, u.name, u.role, p.url, a.created_at
            from questions q, answers a, users u, profile_images p
            where a.question_id = q.id
                and a.user_id = u.id
                and u.id = p.user_id
                and a.question_id = '${qid}'
            order by a.created_at
        `;
        const result = await connection.query(qry);
        res.status(200).send({ answers: result });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// ADD ANSWER - for owner and doctors

const addAnswer = async (req, res) => {
    const nid = v4();
    const ansId = v4();
    const qid = req.params.id;
    content = req.body.content;
    owner = req.user.userId;

    try {
        const [question] = await connection.query(`SELECT user_id FROM questions WHERE id=?`, [qid]);

        const qry = `
            insert into answers values ('${ansId}', '${qid}', '${content}', NULL, '${owner}', NOW())
        `;
        const ins = `
            insert into notifications values('${nid}','ANSWER',NULL,'${qid}','${question.user_id}',NOW())
        `;
        await connection.query(ins);

        await connection.query(qry);
        await connection.query("UPDATE users SET unread_notification=unread_notification+1 WHERE id=?", [
            question.user_id,
        ]);

        const query = `
            SELECT answers.id AS id, answers.user_id AS user_id, content, name, role, url, answers.created_at
            FROM answers
            LEFT JOIN users ON answers.user_id=users.id
            LEFT JOIN profile_images ON users.id=profile_images.user_id
            WHERE answers.id=?
        `;
        const [answer] = await connection.query(query, [ansId]);

        res.status(200).send({ answer });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// UPDATE ANSWER - for owner of specific answer

const updateAnswer = async (req, res) => {
    const ansId = req.params.a_id;
    content = req.body.content;
    try {
        const qry = `
            update answers set content = '${content}' where id = '${ansId}'
        `;
        await connection.query(qry);
        res.status(200).send({ message: "answer updated" });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// REPLY ANSWER - for every user?

const replyAnswer = async (req, res) => {
    const ansId = v4();
    const nid = v4();
    const replied_answer = req.params.a_id;
    const qid = req.params.q_id;
    const thisOwner = req.user.userId;
    content = req.body.content;
    try {
        const qry = `
            insert into answers values ('${ansId}', '${qid}', '${content}', '${replied_answer}', '${thisOwner}', NOW())
        `;
        const [answer] = await connection.query(`SELECT user_id FROM answers WHERE id="${replied_answer}"`);
        await connection.query(qry);
        const ins = `
            insert into notifications values('${nid}','REPLY',NULL,'${qid}','${answer.user_id}',NOW())
        `;
        await connection.query(ins);

        const [replied] = await connection.query(
            `SELECT answers.id AS answer_id, answers.user_id AS user_id, content, name, role, url, answers.created_at, replied_to
            FROM answers
            LEFT JOIN users ON answers.user_id=users.id
            LEFT JOIN profile_images ON users.id=profile_images.user_id
            WHERE answers.id=?`,
            [ansId]
        );

        await connection.query("UPDATE users SET unread_notification=unread_notification+1 WHERE id=?", [answer.user_id])

        res.status(200).send({ answer: replied });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

// DELETE ANSWER - for owner of specific answer

const delAnswer = async (req, res) => {
    const ansId = req.params.a_id;
    console.log(ansId);
    try {
        const delAns = `
            delete from answers where id = '${ansId}'
        `;
        await connection.query(delAns);
        res.status(200).send({ message: "answer deleted" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

module.exports = {
    getRelatedQuestions,
    createQuestion,
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
    increaseQuestionView,
};
