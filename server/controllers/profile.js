const { connection } = require("../mysql");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
    const userId = req.user.userId;
    try {
        const query = `
            select id, email, name, url, birthday from users
            LEFT JOIN profile_images
            ON users.id=profile_images.user_id
            where id="${userId}"
        `;
        const queryInterested = `
            SELECT topics.id, topics.topic FROM interested_in
            LEFT JOIN topics
            ON topics.id=interested_in.topic_id
            WHERE interested_in.user_id="${userId}"
        `;
        const [user] = await connection.query(query);
        const interested_in = await connection.query(queryInterested);
        res.send({
            ...user,
            interested_in,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

/////////////////////////////////////////////////////////////////////

const getProfile_doctor = async (req, res) => {
    const userId = req.user.userId;
    try {
        const query = `
            select id, email, name, url, personal_information from users
            LEFT JOIN profile_images
            ON users.id=profile_images.user_id
            where id="${userId}"
        `;
        const queryInterested = `
            SELECT topics.id, topics.topic FROM interested_in
            LEFT JOIN topics
            ON interested_in.topic_id=topics.id
            WHERE interested_in.user_id="${userId}"
        `;
        const [user] = await connection.query(query);
        const interested_in = await connection.query(queryInterested);
        res.send({
            ...user,
            interested_in,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

///////////////////////////////////////////////////////////////////////

const doctors_information = async (req, res) => {
    const params = req.params.id;
    try {
        const query = `
            SELECT id, name, personal_information, url FROM users
            LEFT JOIN profile_images
            ON users.id=profile_images.user_id
            WHERE users.id="${params}"
        `;
        const [user] = await connection.query(query);
        const interested_in = await connection.query(
            `SELECT interested_in.topic_id, topics.topic FROM interested_in LEFT JOIN topics ON interested_in.topic_id=topics.id WHERE interested_in.user_id="${params}"`
        );
        res.send({
            ...user,
            interested_in,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

///////////////////////////////////////////////////////////////////////
const UpdateProfile_Patient = async (req, res) => {
    try {
        const userId = req.user.userId;
        patient_name = req.body.name;
        patient_birthday = req.body.birthday;
        const query = `
        update users 
        set users.name = "${patient_name}", users.birthday = "${patient_birthday}"
        where users.id="${userId}";
        `;
        await connection.query(query);
        res.status(200).send({ message: "อัพเดทเสร็จสิ้น" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

////////////////////////////////////////////////////////////////////////
const UpdateProfile_doctor = async (req, res) => {
    try {
        const userId = req.user.userId;
        doc_name = req.body.name;
        doc_per_information = req.body.personal_information;
        const query = `
        update users 
        set users.name = "${doc_name}", users.personal_information = "${doc_per_information}"
        where users.id="${userId}";
        `;
        await connection.query(query);
        res.status(200).send({ message: "อัพเดทเสร็จสิ้น" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

//////////////////////////////////////////////////////////////////////////

const UpdatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        password_user = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(salt, password_user);

        const query = `
        update users 
        set users.password = "${hashedPassword}"
        where users.id="${userId}";
        `;
        await connection.query(query);
        res.status(200).send({ message: "อัพเดทเสร็จสิ้น" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

////////////////////////////////////////////////////////////////
const insert = async (topics, userId) => {
    if (topics.length === 0) {
        return;
    }
    const query = `
    INSERT INTO interested_in (user_id,	topic_id) VALUES ("${userId}", "${topics[topics.length - 1]}")
    `;
    await connection.query(query);
    topics.pop();
    return insert(topics, userId);
};

const addTopic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const topics = req.body.topics;
        await insert(topics, userId);
        const interested_in = await connection.query(`
        SELECT topics.id, topics.topic FROM interested_in
        LEFT JOIN topics
        ON topics.id=interested_in.topic_id
        WHERE interested_in.user_id="${userId}"`);
        res.status(200).send({ interested_in });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

////////////////////////////////////////////////////////////////
const delete_topic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const params = req.params.id;
        const query = `
        DELETE FROM interested_in 
        WHERE interested_in.user_id="${userId}" and  interested_in.topic_id= "${params}";
        `;
        await connection.query(query);
        res.status(200).send({ message: "อัพเดทเสร็จสิ้น" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};
module.exports = {
    getProfile,
    getProfile_doctor,
    doctors_information,
    UpdateProfile_Patient,
    UpdateProfile_doctor,
    UpdatePassword,
    addTopic,
    delete_topic,
};
