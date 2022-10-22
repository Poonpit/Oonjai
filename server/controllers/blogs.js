const { v4 } = require("uuid");
const { connection } = require("../mysql");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const CreateBlogs = async (req, res) => {
    const blog_id = v4();
    const image_id = v4();
    const blog_userId = req.user.userId;
    const blog_topicId = req.body.selectedTopicId;
    const blog_title = req.body.title;
    const blog_content = req.body.content;
    const image = req.body.image;
    try {
        const cloud_image = await cloudinary.uploader.upload(image, { public_id: image_id });
        const queryblog = `
            insert into blogs (id, title, content, views, topic_id, user_id) 
            values ("${blog_id}", "${blog_title}", ?, DEFAULT, "${blog_topicId}", "${blog_userId}")
        `;

        await connection.query("BEGIN");
        await connection.query(queryblog, [blog_content]);

        const queryblogimage = `
        insert into blog_images (blog_id, url, image_id)
        values ("${blog_id}", "${cloud_image.url}", "${image_id}")
        `;
        await connection.query(queryblogimage);

        ////////////////////////////////////////////////////////////////
        const queryUser = `
            select user_id
            from interested_in
            where topic_id = "${blog_topicId}" AND user_id!="${blog_userId}"
        `;
        const notificationUserId = await connection.query(queryUser);
        await connection.query("COMMIT");

        for (let i = 0; i < notificationUserId.length; i++) {
            const queryNotification = `
                insert into notifications(id,type,blog_id,user_id) values ("${v4()}", "BLOG","${blog_id}","${
                notificationUserId[i].user_id
            }")
            `;
            await connection.query(queryNotification);
            await connection.query("UPDATE users SET unread_notification = unread_notification+1 WHERE id=?", [
                notificationUserId[i].user_id,
            ]);
        }

        res.status(200).send({ message: "สร้างเสร็จสิ้น" });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
};
//////////////////////////////////////////////////////////////////

const DeleteBlogs = async (req, res) => {
    const id_blog = req.params.id;
    const query = `
        select image_id
        from blog_images
        where blog_id = "${id_blog}"
    `;
    const [image] = await connection.query(query);
    await cloudinary.uploader.destroy(image.image_id);

    await connection.query("DELETE FROM notifications WHERE blog_id=?", [id_blog]);

    const queryblogimage = `
        delete from blog_images
        where blog_images.blog_id = "${id_blog}"
    `;
    await connection.query(queryblogimage);
    const queryblog = `
        delete from blogs
        where blogs.id = "${id_blog}"
    `;
    await connection.query(queryblog);
    res.status(200).send({ message: "ลบเสร็จสิ้น" });
};

const UpdateBlogs = async (req, res) => {
    const id_blog = req.params.id;
    const blog_title = req.body.title;
    const blog_content = req.body.content;
    const image = req.body.image;

    let cloud_image = {};
    if (image) {
        const query = `
            select image_id
            from blog_images
            where blog_id = "${id_blog}"
        `;
        const [Newimage] = await connection.query(query);
        await cloudinary.uploader.destroy(Newimage.image_id);
        cloud_image = await cloudinary.uploader.upload(image, { public_id: Newimage.image_id });
        const queryblogimage = `
            update blog_images set blog_images.url = "${cloud_image.url}" where blog_images.blog_id = "${id_blog}"
        `;
        await connection.query(queryblogimage);
    }

    const queryblog = `
        update blogs set blogs.title = "${blog_title}", blogs.content = ? where blogs.id = "${id_blog}"
    `;
    await connection.query(queryblog, [blog_content]);

    res.status(200).send({ message: "อัพเดทเสร็จสิ้น", url: cloud_image.url || "" });
};

const GetBlog = async (req, res) => {
    try {
        const id_blog = req.params.id;
        const queryblog = `
        select blogs.id, blogs.title, blogs.content, blog_images.url as blog_url, topic, topics.id as topic_id, blogs.views, blogs.user_id as doctor_id, users.name, profile_images.url as profile_url, blogs.created_at  
        from blogs, blog_images, users, profile_images, topics
        where blogs.id = "${id_blog}" 
              and blogs.id = blog_images.blog_id 
              and blogs.user_id = profile_images.user_id
              and blogs.user_id = users.id
              and blogs.topic_id = topics.id
        `;
        const [blog] = await connection.query(queryblog);

        res.status(200).send({ blog });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "",
        });
    }
};

const GetMyBlog = async (req, res) => {
    const blog_userId = req.user.userId;
    const queryblog = `
        select blogs.id, blogs.title, blog_images.url, topics.topic, blogs.created_at
        from blogs, blog_images, topics
        where blogs.user_id = "${blog_userId}"
            and blogs.id = blog_images.blog_id 
            and blogs.topic_id = topics.id
        ORDER BY created_at DESC
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).send({ blogs });
};

const GetRelateBlog = async (req, res) => {
    const topic_id = req.params.topic_id;
    const queryblog = `
        select blogs.id, blogs.title, blog_images.url, topics.topic
        from blogs, blog_images, topics
        where blogs.topic_id = "${topic_id}" 
            and blogs.topic_id = topics.id
            and blogs.id = blog_images.blog_id    
        order by blogs.created_at desc limit 5
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).send({ blogs });
};

const GetRecommendBlog = async (req, res) => {
    const queryblog = `
        select blogs.id, blogs.title, blogs.content, blog_images.url, topic, blogs.views, blogs.created_at
        from blogs, blog_images, topics
        where blogs.id = blog_images.blog_id and blogs.topic_id = topics.id
        order by blogs.views desc limit 3
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).send({ blogs });
};

const increaseBlogViews = async (req, res) => {
    await connection.query(`UPDATE blogs SET views = views + 1 WHERE id="${req.params.id}"`);
    res.status(204).send({});
};

module.exports = {
    CreateBlogs,
    DeleteBlogs,
    UpdateBlogs,
    GetBlog,
    GetMyBlog,
    GetRelateBlog,
    GetRecommendBlog,
    increaseBlogViews,
};
