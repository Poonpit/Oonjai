import Link from "next/link";
import { EyeFill } from "react-bootstrap-icons";
import useEffectOnce from "../../hooks/use-effect-once";
import { serverUrl } from "../../utils/serverApi";
import axios from "axios";
import { useState } from "react";
import moment from "moment";

const RecommendedBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchRecommendedBlogsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/blogs/recommended/latest");
            setBlogs(data.blogs);
            console.log(data.blogs);
        } catch (e) {
            console.log(e);
        }
    };

    useEffectOnce(() => {
        fetchRecommendedBlogsHandler();
    });

    return (
        <div className="py-3 px-4">
            <h3>Recommended blogs</h3>
            <hr />
            <div className="row">
                {blogs.map((blog) => (
                    <Link href={`/blogs/${blog.id}`} key={blog.id}>
                        <div
                            className="recommended-blog-item col-4 bg-light rounded-3 px-0 overflow-hidden border position-relative"
                            role="button"
                        >
                            <span
                                className="badge bg-warning px-2"
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                }}
                            >
                                {blog.topic}
                            </span>
                            <div>
                                <img
                                    src={blog.url}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <div className="text-break p-2">
                                <div className="mb-2">
                                    <h5>{blog.title}</h5>
                                </div>
                                <div className="border-top mt-1 pt-1 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <EyeFill />
                                        <span className="ms-1">{blog.views}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted">{moment(blog.created_at).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendedBlogs;
