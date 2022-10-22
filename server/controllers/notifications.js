const { connection } = require("../mysql");

const getNotifications = async (req, res) => {
    const { userId } = req.user;
    const query = `
        SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC
    `;
    const notifications = await connection.query(query, userId);
    res.send({
        notifications,
    });
};

const readNotifications = async (req, res) => {
    const { userId } = req.user;
    const query = `UPDATE users SET unread_notification=0 WHERE id=?`;
    await connection.query(query, [userId]);
    res.status(204).send();
}

const getUnreadNotifications = async (req, res) => {
    const {userId} = req.user;
    const [user] =  await connection.query("SELECT unread_notification FROM users WHERE id=?", [userId]);

    res.send({
        unreadNotification: user.unread_notification
    })
}

module.exports = { getNotifications, readNotifications, getUnreadNotifications };
