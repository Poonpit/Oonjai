const cloudinary = require("cloudinary").v2;
const { connection } = require("../mysql");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

async function getDoctors(req, res) {
    const query = `
        select id, name, url from users
        left join profile_images on users.id = profile_images.user_id
        where role = "DOCTOR"
    `;
    const doctors = await connection.query(query);
    res.send({
        doctors: doctors,
    });
}

async function input_img(req, res) {
    const email = req.body.email;
    const name = req.body.name;
    const image = req.body.image;
    const password = req.body.password;

    try {
        const [doctor] = await connection.query("SELECT id FROM users WHERE email=?", [email]);
        if (doctor) {
            return res.status(409).send({
                message: "อีเมลถูกใช้ไปแล้ว",
            });
        }

        const id = v4();
        const result = await cloudinary.uploader.upload(image, { public_id: id, resource_type: "image" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userId = v4();
        const query = `
            insert into users (id, email, name, password, role, is_verified, personal_information) values ("${userId}", "${email}", "${name}", "${hashedPassword}", "DOCTOR", TRUE, "")
        `;
        await connection.query(query);
        await connection.query(`INSERT INTO profile_images VALUES("${userId}","${result.url}", "${id}" )`);

        const getsql = `
            select id, name, url from users left join profile_images on users.id = profile_images.user_id
            where id = "${userId}"
        
        `;
        const [user_doc] = await connection.query(getsql);

        res.send({
            user: user_doc,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}

async function getDoctor(req, res) {
    const id = req.params.id;
    const query = `
        select id, email, name, personal_information,url, created_at from users left join profile_images on users.id = profile_images.user_id
        where id = "${id}"
        `;

    const [user] = await connection.query(query);
    const query2 = `
        select topic_id, topic from interested_in left join topics on topic_id = topics.id 
        where user_id = "${id}" 
    `;
    const topics = await connection.query(query2);
    const response = {
        ...user,
        interested_in: topics,
    };
    res.send({
        doctor: response,
    });
}

async function getDoctorBlogs(req, res) {
    const id = req.params.id;

    const q = `
        select blogs.user_id as id, title, topic, created_at, url from blogs left join blog_images on blog_id = blogs.id
        left join topics on topic_id = topics.id where blogs.user_id = "${id}"
    `;
    const blogs = await connection.query(q);
    res.send({
        blogs,
    });
}

const removeDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        await connection.query(`DELETE FROM users WHERE id=?`, [id]);

        res.status(200).send({
            message: `Removed`,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const removeQuestions = async (req, res) => {
    try {
        const { number, period } = req.query;

        if (Number.isNaN(+number)) {
            return res.status(400).send({
                message: "Invalid number",
            });
        } else if (!["Days", "Weeks"].includes(period)) {
            return res.status(400).send({
                message: "Invalid period",
            });
        }

        const now = new Date();
        const today = new Date();

        if (period === "Days") {
            now.setDate(now.getDate() - +number);
        } else if (period === "Weeks") {
            now.setDate(now.getDate() - 7 * +number);
        }
        const newDateFormat = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:01";

        const questionIds = await connection.query(`SELECT questions.id
        FROM questions LEFT JOIN answers ON questions.id=answers.question_id
        WHERE (questions.created_at BETWEEN "${newDateFormat}"
        AND "${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getMinutes()}")
        GROUP BY questions.id
        HAVING COUNT(answers.id) = 0`)
        for(const qId of questionIds) {
            await connection.query(`DELETE FROM questions WHERE id="${qId.id}"`)
        }

        res.status(200).send({
            message: "Removed",
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const aggregate = async (req, res) => {
    try {
        const unansweredQuery = `
            SELECT COUNT(*) as count, date_format(questions.created_at - interval 1 day, '%Y-%m-%d') as day_log FROM questions
            LEFT JOIN answers
            ON questions.id=answers.question_id
            WHERE questions.created_at > NOW() - INTERVAL 1 WEEK
            GROUP BY day_log, answers.question_id
            HAVING COUNT(answers.id)=0
            LIMIT 7
        `;
        const unansweredStatistic = await connection.query(unansweredQuery);
        const registerUserQuery = `
            SELECT COUNT(*) as count, date_format(users.created_at - interval 1 day, "%Y-%m-%d") as day_log FROM users
            WHERE role="PATIENT" AND users.created_at > NOW() - INTERVAL 1 WEEK
            GROUP BY day_log
            LIMIT 7
        `;
        const registerUserStatistic = await connection.query(registerUserQuery);

        const slice = 7 - new Date().getDay();

        const arr1 = [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }];
        const copied1 = JSON.parse(JSON.stringify(unansweredStatistic));
        for (let i = 0; i < copied1.length; i++) {
            const curDate = (new Date(copied1[i].day_log).getDay() + slice) % 7;
            arr1[curDate] = copied1[i];
        }

        const arr2 = [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }];
        const copied2 = JSON.parse(JSON.stringify(registerUserStatistic));
        for (let i = 0; i < copied2.length; i++) {
            const curDate = (new Date(copied2[i].day_log).getDay() + slice) % 7;
            arr2[curDate] = copied2[i];
        }

        res.send({ unansweredStatistic: arr1, registerUserStatistic: arr2 });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

module.exports = { getDoctors, input_img, getDoctor, getDoctorBlogs, removeDoctor, removeQuestions, aggregate };
