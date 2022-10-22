const jwt = require("jsonwebtoken");

const userAuthorization = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized",
        });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(401).send({
                message: "Unauthorized",
            });
        }
        req.user = {
            userId: result.userId,
        };
        next();
    });
}

const patientAuthorization = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized",
        });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(401).send({
                message: "Unauthorized",
            });
        }
        if (result.role !== "PATIENT") {
            return res.status(403).send({
                message: "Access denied",
            });
        }
        req.user = {
            userId: result.userId,
        };
        next();
    });
};

const doctorAuthorization = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized",
        });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, result) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized",
            });
        }
        if (result.role !== "DOCTOR") {
            return res.status(403).send({
                message: "Access denied",
            });
        }
        req.user = {
            userId: result.userId,
        };
        next();
    });
};

const adminAuthorization = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized",
        });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, result) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized",
            });
        }
        if (result.role !== "ADMIN") {
            return res.status(403).send({
                message: "Access denied",
            });
        }
        req.user = {
            userId: result.userId,
        };
        next();
    });
};

module.exports = { userAuthorization, patientAuthorization, doctorAuthorization, adminAuthorization };
