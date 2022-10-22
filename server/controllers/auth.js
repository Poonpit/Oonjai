const { connection } = require("../mysql");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const TakeoutClient = require("takeout.js");
const bcrypt = require('bcrypt');

const client = new TakeoutClient();
client.login(process.env.TAKEOUT_API_KEY);

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const query = `
            SELECT id, name, password, role, unread_notification, url FROM users
            LEFT JOIN profile_images
            ON id=user_id
            WHERE email=? AND is_verified=TRUE AND (banned_questions < 5 OR banned_questions IS NULL)
        `;
        const [user] = await connection.query(query, [email, password]);
        if (!user) {
            return res.status(400).send({
                message: "ไม่พบผู้ใช้",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).send({
                message: "รหัสผ่านผิด"
            })
        }

        user.password = undefined;
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_TOKEN_KEY,
            {
                expiresIn: "10d",
            }
        );
        res.send({
            user,
            token,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

const signup = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const birthday = req.body.birthday;
    
        const id = v4();
    
        const [result] = await connection.query(`select * from users where email = "${email}" AND is_verified=TRUE`);
        if (result) {
            return res.status(400).send({
                message: "email ถูกใช้ไปแล้ว",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            insert into users(id,email,password,name, birthday, role) values("${id}", "${email}", "${hashedPassword}","${name}","${birthday}", "PATIENT")
        `;
        await connection.query(query);
    
        const token = jwt.sign({
            id
        }, process.env.JWT_VERIFICATION_KEY, {
            expiresIn: "10m"
        });
    
        const emailtemplate = {
            to: email,
            from: "นายแพทย์ปีเตอร์แพน",
            subject: "Verification",
            html: `
                <a href="http://localhost:3000/verify/${token}">คลิกที่นี่เพื่อยืนยันอีเมลของคุณ</a>
            `,
        };
        await client.send(emailtemplate);
    
        res.status(200).send({
            message: `อีเมลได้ถูกส่งไปยัง ${email} แล้ว`,
        });
    }catch(e) {
        res.status(500).send({
            message: "Something went wrong"
        })
    }
};

const verify = (req, res) => {
    const token = req.body.token;

    jwt.verify(token, process.env.JWT_VERIFICATION_KEY, async (err, result) => {
        if (err) {
            return res.status(400).send({
                message: "กรุณาสมัครใหม่อีกครั้ง",
            });
        }

        try {
            const [user] = await connection.query(`SELECT id, is_verified FROM users WHERE id=?`, [result.id]);
            if (user.is_verified) {
                return res.status(409).send({
                    message: "บัญชีได้รับการยืนยันแล้ว",
                });
            }

            await connection.query(`UPDATE users SET is_verified=TRUE WHERE id=?`, [result.id]);
            await connection.query(`INSERT INTO profile_images(user_id) VALUES ("${result.id}")`)
            res.send({
                message: "Verified",
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
            });
        }
    });
};

module.exports = { login, signup, verify };
