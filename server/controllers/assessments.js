const { v4 } = require("uuid");
const { connection } = require("../mysql");

const mental_test = async (req, res) => {
    try {
        const userId = req.user.userId;
        const choose = req.body.choose;
        const id_v4 = v4();
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += choose[i];
        }
        const query = `
        INSERT INTO assessments (id,user_id,type,result	)
        VALUES ("${id_v4}","${userId}","MENTAL","${sum}")
        `;
        await connection.query(query);
        res.status(200).send({ result: sum });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

///////////////////////////////////////////////////////////////////////
const covid_test = async (req, res) => {
    try {
        const userId = req.user.userId;
        const choose = req.body.choose;
        const id_v4 = v4();
        let sum = 0;
        for (let i = 0; i < 7; i++) {
            sum += choose[i];
        }
        const query = `
        INSERT INTO assessments (id,user_id,type,result	)
        VALUES ("${id_v4}","${userId}","COVID","${sum}")
        `;
        await connection.query(query);
        res.status(200).send({ result: sum });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

/////////////////////////////////////////////////////////////
const mantal_result = async (req, res) => {
    const userId = req.user.userId;
    try {
        const query = `
            select id,user_id,type,result,created_at	
            from assessments
            where assessments.user_id="${userId}" and type="MENTAL" order by created_at DESC;
        `;
        const assessments = await connection.query(query);
        res.send({
            assessments,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

/////////////////////////////////////////////////////////////////////////

const covid_resule = async (req, res) => {
    const userId = req.user.userId;
    try {
        const query = `
        select id,user_id,type,result,created_at	
        from assessments
        where assessments.user_id="${userId}" and type="COVID" order by created_at DESC;
        `;
        const assessments = await connection.query(query);
        res.send({
            assessments,
        });
    } catch (e) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};

module.exports = { mental_test, covid_test, mantal_result, covid_resule };
