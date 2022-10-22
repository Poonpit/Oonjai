import { useState } from "react";
import { Container } from "react-bootstrap";
import MyBlogItem from "../../components/Blog/MyBlogItem";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";
import useEffectOnce from "../../hooks/use-effect-once";

const MyBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/blogs/my-blogs", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setBlogs(data.blogs);
        } catch (e) {
            toast.error(e);
        }
    };

    useEffectOnce(() => {
        fetchBlogsHandler();
    });

    const deleteBlogHandler = async (id) => {
        const answer = window.confirm("คุณต้องการที่จะลบบล็อคนี้หรือไม่");
        if (answer) {
            try {
                const { data } = await axios.delete(serverUrl + `/blogs/${id}`, {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                });
                const filtered = blogs.filter((blog) => blog.id !== id);
                setBlogs(filtered);
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    return (
        <Container>
            <div
                className="bg-light rounded-3 mt-3 px-5 mx-5 py-3"
                style={{
                    height: "44rem",
                    overflowY: "scroll",
                }}
            >
                <h3>บล็อคของฉัน</h3>
                <hr />
                <div className="px-3 mt-2">
                    {blogs.map((blog) => (
                        <MyBlogItem blog={blog} key={blog.id} onDeleteBlogHandler={deleteBlogHandler} />
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default MyBlogsPage;
