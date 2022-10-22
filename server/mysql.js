const { createConnection } = require("mysql2");
const util = require("util");
const schemas = require("./schema");

const connection = createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const connectToMySQL = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await connection.connect();
            connection.query = util.promisify(connection.query);
            await connection.execute("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            console.log("MySQL Connected");
            await createTable();
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const createTable = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.USER_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.PROFILE_IMAGE_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.TOPIC_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.INTERESTED_IN_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.ASSESSMENT_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.BLOG_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.BLOG_IMAGE_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.QUESTION_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.ANSWER_SCHEMA}`);
            await connection.execute(`CREATE TABLE IF NOT EXISTS ${schemas.NOTIFICATION_SCHEMA}`);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { connection, connectToMySQL };
