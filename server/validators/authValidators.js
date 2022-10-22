const signinValidator = (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || email.trim().length === 0) {
            res.status(400).send({
                message: "โปรดกรอกอีเมล",
            });
        } else if (!password || password.trim().length === 0) {
            res.status(400).send({
                message: "โปรดป้อนรหัสผ่าน",
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

module.exports = { signinValidator };
